import mongoose, { Document, Schema } from 'mongoose';


export interface IDepartment extends Document {
  name: string;
  description: string;
}

const departmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true },
  description: { type: String }, 
});

const Department = mongoose.model<IDepartment>('Department', departmentSchema);

export default Department;
