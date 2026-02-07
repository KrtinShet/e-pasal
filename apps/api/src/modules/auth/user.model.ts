import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'merchant' | 'staff' | 'admin';
  storeId?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  onboardingCompleted: boolean;
  refreshTokenId?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['merchant', 'staff', 'admin'],
      default: 'merchant',
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    refreshTokenId: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ storeId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
