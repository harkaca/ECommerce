import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
  sessionId: string;
  products: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }>;
}

const cartSchema = new Schema<ICart>({
  sessionId: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;
