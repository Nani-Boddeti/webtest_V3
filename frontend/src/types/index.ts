/** Core entity types matching the backend API schema */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'editor';
  createdAt: string;
}

export interface AuthPayload {
  user: User;
  /** JWT token (returned by some endpoints for immediate use) */
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  token?: string; // invitation token
}

export interface Invitation {
  id: string;
  email: string;
  role: 'owner' | 'editor';
  token: string;
  used: boolean;
  createdAt: string;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  theme: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Signup {
  id: string;
  landingPageId: string;
  email: string;
  name: string;
  isWinner: boolean;
  createdAt: string;
}

export interface BuildPlanTask {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
  order: number;
  createdAt: string;
  updatedAt: string;
}
