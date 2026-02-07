import { AuditLog } from './audit.model.js';

interface LogInput {
  storeId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export class AuditService {
  async log(input: LogInput) {
    return AuditLog.create(input);
  }

  async getByStore(storeId: string, page = 1, limit = 50) {
    const [logs, total] = await Promise.all([
      AuditLog.find({ storeId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      AuditLog.countDocuments({ storeId }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export const auditService = new AuditService();
