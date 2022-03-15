import { Document } from "mongoose";

export default interface User extends Document {
    id: string;
    username: string;
    email: string;
    password: string | undefined;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createdAt: Date;
}
