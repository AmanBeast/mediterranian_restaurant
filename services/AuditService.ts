import { prisma } from "@/lib/prisma";

export class AuditService {
  static async log(params: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: any;
    ipAddress?: string;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          details: params.details ? JSON.stringify(params.details) : null,
          ipAddress: params.ipAddress || null,
        },
      });
    } catch (err) {
      console.error("[AuditService] Failed to record audit log:", err);
    }
  }

  static async getRecentLogs(take = 20) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });
  }
}
