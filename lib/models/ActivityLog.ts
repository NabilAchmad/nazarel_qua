import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  action: string;
  userId?: number; // Optional, jika tidak login (misal admin anonim atau sistem)
  username?: string;
  details: Record<string, any>; // Data fleksibel
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  userId: { type: Number, required: false },
  username: { type: String, required: false },
  details: { type: Schema.Types.Mixed, required: true }, // Mixed type for flexible JSON
  createdAt: { type: Date, default: Date.now },
});

// Mencegah error "Cannot overwrite model once compiled" di Next.js
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
