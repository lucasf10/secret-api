import { Document, Types } from 'mongoose'

export default interface Post extends Document {
    id: Types.ObjectId;
    text: string;
    createdBy: Types.ObjectId;
    comments: Types.ObjectId[];
    colorCode: string;
    likeAmount: number;
    createdAt: Date;
    location: {
        type: string;
        location: [number]
    }
    city: string;
}
