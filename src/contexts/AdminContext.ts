import { createContext } from 'react';
import type { Admin } from '../services/authService';

export interface AdminContextType {
  admin: Admin | null | undefined;
  isLoading: boolean;
  isError: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);