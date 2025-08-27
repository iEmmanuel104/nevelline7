import { useEffect, useState } from 'react';
import { Button } from './button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface CloudinaryUploadProps {
  onUpload: (imageUrl: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  buttonSize?: 'default' | 'sm' | 'lg';
  showPreview?: boolean;
  previewClassName?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'original';
  imageType?: 'product' | 'category' | 'gallery';
}

interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (config: any, callback: (error: any, result: any) => void) => CloudinaryWidget;
    };
  }
}

export function CloudinaryUpload({
  onUpload,
  onRemove,
  currentImage,
  buttonText = "Upload Image",
  buttonVariant = "outline",
  buttonSize = "default",
  showPreview = true,
  previewClassName = "w-full h-48 object-cover rounded-lg border",
  multiple = false,
  maxFiles = 1,
  className = "",
  disabled = false,
  aspectRatio = "original",
  imageType = "product"
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [widget, setWidget] = useState<CloudinaryWidget | null>(null);

  // Get optimal dimensions based on image type
  const getImageDimensions = (type: string, ratio: string) => {
    const dimensions = {
      product: {
        square: { width: 800, height: 800 },
        portrait: { width: 600, height: 800 },
        landscape: { width: 800, height: 600 },
        original: { width: 1200, height: 1200 }
      },
      category: {
        square: { width: 400, height: 400 },
        portrait: { width: 300, height: 400 },
        landscape: { width: 400, height: 300 },
        original: { width: 600, height: 600 }
      },
      gallery: {
        square: { width: 600, height: 600 },
        portrait: { width: 500, height: 600 },
        landscape: { width: 600, height: 500 },
        original: { width: 1000, height: 1000 }
      }
    };
    return dimensions[type as keyof typeof dimensions]?.[ratio as keyof typeof dimensions.product] || dimensions.product.original;
  };

  const imageDims = getImageDimensions(imageType, aspectRatio);

  // Optimized file size recommendations based on image type
  const getOptimizedSettings = (type: string) => {
    const settings = {
      product: {
        maxFileSize: 2000000, // 2MB - optimal for product images
        quality: 'auto:good',
        eager: [
          // Thumbnail for listings
          `w_300,h_300,c_fill,q_auto:eco,f_auto`,
          // Medium for product cards
          `w_600,h_600,c_fill,q_auto:good,f_auto`,
          // Large for product detail
          `w_${imageDims.width},h_${imageDims.height},c_fill,q_auto:good,f_auto`
        ].join('|'),
        recommendation: 'Recommended: 800x800px, under 2MB for optimal loading'
      },
      category: {
        maxFileSize: 1000000, // 1MB - categories need smaller files
        quality: 'auto:eco',
        eager: [
          `w_200,h_200,c_fill,q_auto:eco,f_auto`,
          `w_${imageDims.width},h_${imageDims.height},c_fill,q_auto:good,f_auto`
        ].join('|'),
        recommendation: 'Recommended: 400x400px, under 1MB for fast loading'
      },
      gallery: {
        maxFileSize: 5000000, // 5MB - gallery can have larger files
        quality: 'auto:good',
        eager: [
          `w_400,h_300,c_fill,q_auto:eco,f_auto`,
          `w_${imageDims.width},h_${imageDims.height},c_fit,q_auto:good,f_auto`
        ].join('|'),
        recommendation: 'Recommended: 1200x800px, under 5MB for high quality display'
      }
    };
    return settings[type as keyof typeof settings] || settings.product;
  };

  const optimizedSettings = getOptimizedSettings(imageType);

  // Cloudinary configuration with optimized settings
  const cloudinaryConfig = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    sources: ['local', 'url', 'camera'] as const,
    multiple: multiple,
    maxFiles: maxFiles,
    maxFileSize: optimizedSettings.maxFileSize,
    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    maxImageWidth: imageDims.width,
    maxImageHeight: imageDims.height,
    cropping: false, // No forced cropping unless user chooses
    showSkipCropButton: true,
    croppingAspectRatio: aspectRatio === 'original' ? null : (aspectRatio === 'square' ? 1 : aspectRatio === 'portrait' ? 0.75 : 1.33),
    croppingShowDimensions: true,
    theme: 'white',
    showPoweredBy: false,
    showUploadMoreButton: false,
    showCompletedButton: true,
    eager: optimizedSettings.eager,
    quality: optimizedSettings.quality,
    fetchFormat: 'auto',
    flags: 'progressive',
    // File size validation message
    text: [
      {
        text: optimizedSettings.recommendation,
        size: 20,
        color: '#666666',
        gravity: 'south',
        y: 20
      }
    ]
  };

  useEffect(() => {
    // Load Cloudinary widget script if not already loaded
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        initializeWidget();
      };
    } else {
      initializeWidget();
    }

    return () => {
      // Cleanup widget when component unmounts
      if (widget) {
        widget.destroy();
      }
    };
  }, []);

  const initializeWidget = () => {
    if (window.cloudinary) {
      const newWidget = window.cloudinary.createUploadWidget(
        cloudinaryConfig,
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            setIsUploading(false);
            return;
          }

          if (result?.event === "success") {
            const imageUrl = result.info.secure_url;
            onUpload(imageUrl);
            setIsUploading(false);
          }

          if (result?.event === "upload-added") {
            setIsUploading(true);
          }
        }
      );
      setWidget(newWidget);
    }
  };

  const handleUpload = () => {
    if (widget && !disabled && !isUploading) {
      widget.open();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={className}>
      {showPreview && currentImage && (
        <div className="relative mb-4">
          <img
            src={currentImage}
            alt="Current upload"
            className={previewClassName}
          />
          {onRemove && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      
      <Button
        type="button"
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleUpload}
        disabled={disabled || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Uploading...
          </>
        ) : (
          <>
            {currentImage ? <ImageIcon className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {currentImage ? 'Change Image' : buttonText}
          </>
        )}
      </Button>
    </div>
  );
}

// Specialized upload components for different use cases with consistent sizing
export function ProductImageUpload(props: Omit<CloudinaryUploadProps, 'imageType' | 'aspectRatio'>) {
  return (
    <CloudinaryUpload 
      {...props} 
      imageType="product" 
      aspectRatio="square"
      previewClassName={props.previewClassName || "w-full aspect-square object-cover rounded-lg border"}
    />
  );
}

export function CategoryImageUpload(props: Omit<CloudinaryUploadProps, 'imageType' | 'aspectRatio'>) {
  return (
    <CloudinaryUpload 
      {...props} 
      imageType="category" 
      aspectRatio="square"
      previewClassName={props.previewClassName || "w-full aspect-square object-cover rounded-lg border"}
    />
  );
}

export function GalleryUpload(props: Omit<CloudinaryUploadProps, 'imageType' | 'multiple' | 'maxFiles'>) {
  return (
    <CloudinaryUpload 
      {...props} 
      imageType="gallery" 
      aspectRatio="original"
      multiple={true} 
      maxFiles={5}
      previewClassName={props.previewClassName || "w-full h-48 object-cover rounded-lg border"}
    />
  );
}