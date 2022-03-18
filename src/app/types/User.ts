import { Document, Types } from 'mongoose'

export default interface User extends Document {
    id: Types.ObjectId;
    username: string;
    email: string;
    password?: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createdAt: Date;
    likedPosts: [Types.ObjectId];
}
