import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  guardianContact: { type: String, required: true },
  allocatedRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  status: { type: String, enum: ['allocated', 'unallocated'], default: 'unallocated' }
});

export default mongoose.model('Student', studentSchema);