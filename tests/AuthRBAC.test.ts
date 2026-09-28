import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRole } from "@prisma/client";

// Mock next/headers
const mockGetCookie = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockImplementation(() =>
    Promise.resolve({
      get: mockGetCookie,
      set: vi.fn(),
      delete: vi.fn(),
    })
  ),
}));

import { requireAuth, encrypt } from "@/lib/session";

describe("Role-Based Access Control (RBAC) Security Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should deny anonymous access to protected procedures", async () => {
    mockGetCookie.mockReturnValue(undefined);

    await expect(requireAuth()).rejects.toThrow("Unauthorized");
  });

  it("should permit STAFF for general staff-level actions", async () => {
    const staffToken = await encrypt({
      userId: "staff-1",
      email: "staff@elaia-table.com",
      name: "Callista Vance",
      role: UserRole.STAFF,
      expiresAt: new Date(Date.now() + 10000),
    });

    mockGetCookie.mockReturnValue({ value: staffToken });

    const session = await requireAuth([UserRole.ADMIN, UserRole.STAFF]);
    expect(session.role).toBe(UserRole.STAFF);
    expect(session.email).toBe("staff@elaia-table.com");
  });

  it("should deny STAFF from ADMIN-only actions", async () => {
    const staffToken = await encrypt({
      userId: "staff-1",
      email: "staff@elaia-table.com",
      name: "Callista Vance",
      role: UserRole.STAFF,
      expiresAt: new Date(Date.now() + 10000),
    });

    mockGetCookie.mockReturnValue({ value: staffToken });

    await expect(requireAuth([UserRole.ADMIN])).rejects.toThrow("Forbidden");
  });

  it("should permit ADMIN for all actions", async () => {
    const adminToken = await encrypt({
      userId: "admin-1",
      email: "admin@elaia-table.com",
      name: "Dimitri Thorne",
      role: UserRole.ADMIN,
      expiresAt: new Date(Date.now() + 10000),
    });

    mockGetCookie.mockReturnValue({ value: adminToken });

    const session = await requireAuth([UserRole.ADMIN]);
    expect(session.role).toBe(UserRole.ADMIN);
    expect(session.email).toBe("admin@elaia-table.com");
  });
});
