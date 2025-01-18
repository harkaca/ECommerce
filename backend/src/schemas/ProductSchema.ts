import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from './CategorySchema'
import { ICharacteristic } from './CharacteristicsSchema'; 

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: ICategory['_id']; 
  characteristics: ICharacteristic['_id'][];  
  image?: string;
  stock: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },  
  characteristics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Characteristic' }],  
  image: { type: String },  
  stock: { type: Number, default: 1 }, 
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
