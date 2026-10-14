import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  month: { type: String, default: 'August 2026' },
  amountDue: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  status: { type: String, enum: ['paid', 'pending', 'partial'], default: 'pending' },
  paidAt: { type: Date }
});

export default mongoose.model('Fee', feeSchema);