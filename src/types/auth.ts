export type Role = 'ADMIN' | 'SUPERVISOR' | 'OPERADOR';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Session {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
