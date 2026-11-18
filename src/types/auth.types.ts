export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: {
    url: string;
    key: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}
