import mongoose, { Schema, Document } from "mongoose";

export interface IProductImage {
  url: string;
  altText?: string;
}

export interface IProductDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  countInStock: number;
  sku: string;
  category: "Top Wear" | "Bottom Wear" | "Footwear" | "Accessories";
  brand: string;
  sizes: string[];
  colors: string[];
  collections?: string;
  material?: string;
  gender?: "Men" | "Women";
  images: IProductImage[];
  status: "active" | "inactive" | "out-of-stock";
  soldCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  rating: number;
  numReviews: number;
  tags?: string[];
  user: mongoose.Types.ObjectId;
  reviews: mongoose.Types.ObjectId[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  dimensions?: IProductDimensions;
  weight?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Top Wear", "Bottom Wear", "Footwear", "Accessories"],
    },
    brand: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    collections: {
      type: String,
    },
    material: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Men", "Women"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock"],
      default: "active",
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    metaKeywords: {
      type: String,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    weight: Number,
  },
  { timestamps: true }
);

// DB Indexes for search optimization
productSchema.index({ name: "text", sku: "text", brand: "text", category: "text" });
productSchema.index({ countInStock: 1 });

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
