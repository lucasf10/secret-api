import { Document, Types } from 'mongoose'

export default interface Post extends Document {
    id: Types.ObjectId;
    text: string;
    createdBy: Types.ObjectId;
    comments: Types.ObjectId[];
    colorCode: string;
    likeAmount: Number;
    createdAt: Date;
}
