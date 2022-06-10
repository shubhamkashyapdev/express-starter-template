import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { UserDocument } from '../models/user.model';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

export interface ProductDocument extends mongoose.Document {
  user: UserDocument['_id'];
  productId: string;
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      type: String,
      unique: true,
      required: true,
      default: () => `product_${nanoid()}`,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);

export default ProductModel;
