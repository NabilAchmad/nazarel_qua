import connectMongo from './mongodb';
import { ActivityLog } from './models/ActivityLog';

export async function logActivity(action: string, details: Record<string, any>, userId?: number, username?: string) {
    try {
        await connectMongo();
        await ActivityLog.create({
            action,
            userId,
            username,
            details
        });
        console.log(`[Log Saved] ${action}`);
    } catch (error) {
        console.error('Failed to save activity log:', error);
    }
}
