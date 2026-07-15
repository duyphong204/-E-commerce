import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  imageUrl: string;
  title: string;
  altText: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bannerSchema.index({ order: 1, isActive: 1 });

const Banner = mongoose.model<IBanner>("Banner", bannerSchema);
export default Banner;
