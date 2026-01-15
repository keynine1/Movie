import mongoose, { Schema, models } from "mongoose";

const FavoriteSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    movieId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    posterPath: { type: String },
  },
  { timestamps: true }
);

// กันซ้ำ: 1 user กด favorite หนังเดิมได้ครั้งเดียว
FavoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Favorite = models.Favorite || mongoose.model("Favorite", FavoriteSchema);
export default Favorite;
