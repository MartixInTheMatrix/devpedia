import mongoose, { Schema, model } from 'mongoose';

interface Article {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    author: string;
}


const articleSchema = new Schema<Article>({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    createdAt: Date,
    updatedAt: Date,
    content: String,
});

export default model<Article>('Article', articleSchema);