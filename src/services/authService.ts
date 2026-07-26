import Keycloak from 'keycloak-js';
import type { AuthUser, Role, Session } from '@/types/auth';
import { setSession, clearSession } from '@/stores/authStore';

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

let keycloakInstance: Keycloak | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null;

function getKeycloakInstance(): Keycloak {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: import.meta.env.PUBLIC_KEYCLOAK_URL,
      realm: import.meta.env.PUBLIC_KEYCLOAK_REALM,
      clientId: import.meta.env.PUBLIC_KEYCLOAK_CLIENT_ID,
    });
  }
  return keycloakInstance;
}

function mapRealmRoles(roles: string[]): Role {
  const upperRoles = roles.map((role) => role.toUpperCase());
  if (upperRoles.includes('ADMIN')) return 'ADMIN';
  if (upperRoles.includes('SUPERVISOR')) return 'SUPERVISOR';
  return 'OPERADOR';
}

function buildSessionFromKeycloak(kc: Keycloak): Session {
  const parsed = kc.tokenParsed as Record<string, unknown> | undefined;
  const realmAccess = parsed?.realm_access as { roles?: string[] } | undefined;
  const roles = realmAccess?.roles ?? [];

  const user: AuthUser = {
    id: String(parsed?.sub ?? ''),
    email: String(parsed?.email ?? parsed?.preferred_username ?? ''),
    name: String(parsed?.name ?? parsed?.preferred_username ?? 'Usuario'),
    role: mapRealmRoles(roles),
  };

  return {
    user,
    token: kc.token ?? '',
    refreshToken: kc.refreshToken,
    expiresAt: Number(parsed?.exp ?? 0) * 1000,
  };
}

function scheduleTokenRefresh(kc: Keycloak): void {
  if (refreshTimer) clearInterval(refreshTimer);

  refreshTimer = setInterval(async () => {
    try {
      const refreshed = await kc.updateToken(30);
      if (refreshed) {
        setSession(buildSessionFromKeycloak(kc));
      }
    } catch {
      if (refreshTimer) clearInterval(refreshTimer);
      clearSession();
      loginWithKeycloak();
    }
  }, 20000);
}

export async function initKeycloakSession(): Promise<Session | null> {
  const kc = getKeycloakInstance();

  const authenticated = await kc.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    checkLoginIframe: false,
  });

  if (!authenticated) return null;

  scheduleTokenRefresh(kc);
  return buildSessionFromKeycloak(kc);
}

export function loginWithKeycloak(redirectPath = '/dashboard'): void {
  getKeycloakInstance().login({ redirectUri: `${window.location.origin}${redirectPath}` });
}

export function logoutFromKeycloak(): void {
  if (refreshTimer) clearInterval(refreshTimer);
  getKeycloakInstance().logout({ redirectUri: `${window.location.origin}/login` });
}
