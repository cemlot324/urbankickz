import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [wishlistItemSchema],
});

wishlistSchema.pre('save', function(next) {
  console.log('Saving wishlist:', this);
  next();
});

export default mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);