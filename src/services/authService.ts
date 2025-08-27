import api from '../lib/api';

export interface Admin {
  id: string;
  email: string;
  name: string;
  lastLogin: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ admin: Admin }> {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async verify(): Promise<{ admin: Admin }> {
    const { data } = await api.get('/auth/verify');
    return data;
  }

  async createAdmin(adminData: { email: string; password: string; name: string }): Promise<{ admin: Admin }> {
    const { data } = await api.post('/auth/create-admin', adminData);
    return data;
  }
}

export const authService = new AuthService();