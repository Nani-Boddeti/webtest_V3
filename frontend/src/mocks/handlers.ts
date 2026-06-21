import { http, HttpResponse, delay } from 'msw';
import type { User } from '../types';

/**
 * MSW handlers for auth endpoints used in Part 1.
 * Uses an in-memory store seeded with a demo account.
 *
 * Part 2 will add handlers for: landing pages, signups, invitations, tasks.
 */

// ── In-memory data store ──────────────────────────────────────────
interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'editor';
  password: string;
  createdAt: string;
}

interface StoredInvitation {
  id: string;
  email: string;
  role: 'owner' | 'editor';
  token: string;
  used: boolean;
  createdAt: string;
}

const users: StoredUser[] = [
  {
    id: 'user-1',
    email: 'demo@waitlisthub.com',
    name: 'Demo Owner',
    role: 'owner',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
];

const invitations: StoredInvitation[] = [];

// Helper to strip password
function sanitiseUser(u: StoredUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
  };
}

// Active session (simulates httpOnly cookie)
let activeUserId: string | null = null;

export const handlers = [
  // ── POST /api/auth/login ──────────────────────────────────────
  http.post('*/api/auth/login', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email: string; password: string };
    const user = users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) {
      return HttpResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }
    activeUserId = user.id;
    return HttpResponse.json(
      { user: sanitiseUser(user), token: 'mock-jwt-token' },
      { status: 200 },
    );
  }),

  // ── POST /api/auth/register ───────────────────────────────────
  http.post('*/api/auth/register', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as {
      email: string;
      password: string;
      name: string;
      token?: string;
    };

    // Check duplicate email
    if (users.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Email already registered.' }, { status: 409 });
    }

    // Validate invitation token if provided
    if (body.token) {
      const invite = invitations.find((i) => i.token === body.token);
      if (!invite || invite.used) {
        return HttpResponse.json({ message: 'Invalid or already used invitation token.' }, { status: 400 });
      }
      // Mark invitation as used
      invite.used = true;
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email: body.email,
      name: body.name,
      role: body.token ? 'editor' : 'owner',
      password: body.password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    activeUserId = newUser.id;

    return HttpResponse.json(
      { user: sanitiseUser(newUser), token: 'mock-jwt-token' },
      { status: 201 },
    );
  }),

  // ── POST /api/auth/logout ─────────────────────────────────────
  http.post('*/api/auth/logout', async () => {
    await delay(100);
    activeUserId = null;
    return HttpResponse.json(null, { status: 200 });
  }),

  // ── GET /api/auth/me ──────────────────────────────────────────
  http.get('*/api/auth/me', async () => {
    await delay(200);
    if (!activeUserId) {
      return HttpResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    }
    const user = users.find((u) => u.id === activeUserId);
    if (!user) {
      return HttpResponse.json({ message: 'User not found.' }, { status: 401 });
    }
    return HttpResponse.json(sanitiseUser(user), { status: 200 });
  }),

  // ── GET /api/invitations/verify?token=xxx ─────────────────────
  http.get('*/api/invitations/verify', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return HttpResponse.json({ valid: false }, { status: 400 });
    }

    const invite = invitations.find((i) => i.token === token);
    if (!invite || invite.used) {
      return HttpResponse.json({ valid: false }, { status: 200 });
    }

    return HttpResponse.json({ valid: true, email: invite.email }, { status: 200 });
  }),

  // ── POST /api/invitations (for Part 2) — stub ─────────────────
  http.post('*/api/invitations', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email: string; role: 'owner' | 'editor' };
    const token = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const invite: StoredInvitation = {
      id: `inv-${Date.now()}`,
      email: body.email,
      role: body.role || 'editor',
      token,
      used: false,
      createdAt: new Date().toISOString(),
    };
    invitations.push(invite);
    return HttpResponse.json(
      {
        ...invite,
        link: `/register?token=${token}`,
      },
      { status: 201 },
    );
  }),

  // ── GET /api/invitations (for Part 2) — stub ──────────────────
  http.get('*/api/invitations', async () => {
    await delay(200);
    return HttpResponse.json(
      invitations.map((i) => ({ ...i, link: `/register?token=${i.token}` })),
      { status: 200 },
    );
  }),
];
