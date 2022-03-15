import { Document, Types } from 'mongoose'

export default interface Comment extends Document {
    id: Types.ObjectId;
    text: string;
    createdBy: Types.ObjectId;
    post: Types.ObjectId;
    createdAt: Date;
}
