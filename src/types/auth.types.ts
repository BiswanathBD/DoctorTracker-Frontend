export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: {
    url: string;
    key: string;
  };
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}
