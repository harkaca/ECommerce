import mongoose, { Document, Schema } from 'mongoose';
import { IDepartment } from './DepartmentSchema';

export interface ICategory extends Document {
  name: string;
  department: IDepartment['_id'];
  description: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  description: { type: String, required: true },
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
