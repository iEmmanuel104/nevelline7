import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { AdminContext } from '../contexts/AdminContext';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Query for checking auth status with persistent cache
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin'],
    queryFn: authService.verify,
    retry: 1, // Allow one retry
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24, // Consider data fresh for 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 30, // Keep in cache for 30 days
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['admin'], data);
      // Store success in localStorage for extra persistence
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', data.admin.email);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(['admin'], null);
      queryClient.clear();
      // Clear localStorage
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminEmail');
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AdminContext.Provider 
      value={{ 
        admin: data?.admin, 
        isLoading, 
        isError,
        login, 
        logout,
        refetch
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

