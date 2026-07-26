/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL: string;
  readonly PUBLIC_KEYCLOAK_URL: string;
  readonly PUBLIC_KEYCLOAK_REALM: string;
  readonly PUBLIC_KEYCLOAK_CLIENT_ID: string;
  readonly PUBLIC_USE_MOCKS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
