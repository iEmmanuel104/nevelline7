import { useState } from 'react';
import { ProductImageUpload, CategoryImageUpload } from '../../components/ui/CloudinaryUpload';

export default function CloudinaryTest() {
  const [productImage, setProductImage] = useState<string>('');
  const [categoryImage, setCategoryImage] = useState<string>('');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cloudinary Upload Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Product Image Upload</h2>
          <div className="border border-gray-300 rounded-lg p-6">
            <ProductImageUpload
              onUpload={(url) => {
                setProductImage(url);
                console.log('Product image uploaded:', url);
              }}
              onRemove={() => {
                setProductImage('');
                console.log('Product image removed');
              }}
              currentImage={productImage}
              showPreview={true}
              buttonText="Upload Product Image"
            />
            {productImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Uploaded URL:</p>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {productImage}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Category Image Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Category Image Upload</h2>
          <div className="border border-gray-300 rounded-lg p-6">
            <CategoryImageUpload
              onUpload={(url) => {
                setCategoryImage(url);
                console.log('Category image uploaded:', url);
              }}
              onRemove={() => {
                setCategoryImage('');
                console.log('Category image removed');
              }}
              currentImage={categoryImage}
              showPreview={true}
              buttonText="Upload Category Image"
            />
            {categoryImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Uploaded URL:</p>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {categoryImage}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Display */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Current Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Cloud Name:</strong> {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'Not set'}
          </div>
          <div>
            <strong>Upload Preset:</strong> {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Not set'}
          </div>
          <div>
            <strong>Paystack Public Key:</strong> {import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ? '✅ Set' : '❌ Not set'}
          </div>
          <div>
            <strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}
          </div>
        </div>
      </div>

      {/* Upload Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Test Instructions</h3>
        <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
          <li>Click "Upload Product Image" or "Upload Category Image" to test the upload widget</li>
          <li>The widget should open with your Cloudinary configuration</li>
          <li>Upload an image and verify it appears in the preview</li>
          <li>Check the browser console for upload logs</li>
          <li>Verify images are stored in your Cloudinary "nevelline" folder</li>
        </ul>
      </div>
    </div>
  );
}