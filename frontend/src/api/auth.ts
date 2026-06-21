import type { LoginRequest, RegisterRequest, User } from '../types';
import apiClient from './client';

/**
 * Auth API calls.
 * Authentication is handled via httpOnly cookies set by the backend.
 * No localStorage tokens are stored on the client.
 */

export interface AuthResponse {
  user: User;
  /** Short-lived JWT (included for convenience; primary auth is cookie-based) */
  token: string;
}

/** Login — the server sets an httpOnly session cookie on success. */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/login', data);
  return res.data;
}

/** Register a new account (or via invitation token). */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/register', data);
  return res.data;
}

/** Logout — server clears the httpOnly cookie. */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

/** Fetch the current user from the server using the session cookie. */
export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>('/auth/me');
  return res.data;
}

/** Verify an invitation token is still valid (used on the register page). */
export interface VerifyTokenResponse {
  valid: boolean;
  email?: string;
}

export async function verifyInvitationToken(token: string): Promise<VerifyTokenResponse> {
  const res = await apiClient.get<VerifyTokenResponse>(`/invitations/verify?token=${encodeURIComponent(token)}`);
  return res.data;
}
