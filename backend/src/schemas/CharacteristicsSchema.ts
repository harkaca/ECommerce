import mongoose, { Document, Schema } from 'mongoose';

export interface ICharacteristic extends Document {
  name: string;
  value: string;
}

const characteristicSchema = new Schema<ICharacteristic>({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const Characteristic =
  mongoose.models.Characteristic || mongoose.model<ICharacteristic>('Characteristic', characteristicSchema);

export default Characteristic;
