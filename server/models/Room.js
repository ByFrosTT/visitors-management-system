import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  block: { type: String, required: true },
  capacity: { type: Number, required: true },
  occupancy: { type: Number, default: 0 },
  monthlyRent: { type: Number, required: true },
  status: { type: String, enum: ['available', 'full'], default: 'available' }
});

export default mongoose.model('Room', roomSchema);