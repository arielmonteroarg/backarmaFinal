import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true 
});

const userModel = mongoose.model("cart", cartSchema);

export default userModel


