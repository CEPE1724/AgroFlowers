import type { AuthUser, Session } from '@/types/auth';

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS !== 'false';
const SESSION_DURATION_MS = 60 * 60 * 1000;

interface MockAccount {
  email: string;
  password: string;
  user: AuthUser;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: 'admin@agroflowers.com',
    password: '123456',
    user: { id: 'u-admin', email: 'admin@agroflowers.com', name: 'Administrador General', role: 'ADMIN' },
  },
  {
    email: 'supervisor@agroflowers.com',
    password: '123456',
    user: { id: 'u-supervisor', email: 'supervisor@agroflowers.com', name: 'Supervisora de Operaciones', role: 'SUPERVISOR' },
  },
  {
    email: 'operador@agroflowers.com',
    password: '123456',
    user: { id: 'u-operador', email: 'operador@agroflowers.com', name: 'Operador de Bodega', role: 'OPERADOR' },
  },
];

function buildMockToken(user: AuthUser): string {
  const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Correo o contraseña incorrectos');
    this.name = 'InvalidCredentialsError';
  }
}

export async function loginWithMock(email: string, password: string): Promise<Session> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const account = MOCK_ACCOUNTS.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
  );

  if (!account) {
    throw new InvalidCredentialsError();
  }

  return {
    user: account.user,
    token: buildMockToken(account.user),
    refreshToken: `refresh.${account.user.id}`,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
}

export const demoAccounts = MOCK_ACCOUNTS.map(({ email, password, user }) => ({
  email,
  password,
  role: user.role,
}));

export function isUsingMocks(): boolean {
  return USE_MOCKS;
}
