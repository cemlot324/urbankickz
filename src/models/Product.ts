import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
  colors: [{ type: String, required: true }],
  style: { type: String, required: true },
  category: { type: String, required: true },
  stock: {
    type: Map,
    of: {
      type: Map,
      of: Number
    }
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', productSchema)