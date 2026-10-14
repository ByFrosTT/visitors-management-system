import express from 'express';
import Room from '../models/Room.js';
import Student from '../models/Student.js';
import Fee from '../models/Fee.js';

const router = express.Router();

// Rooms Endpoints
router.post('/rooms', async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Students Endpoints
router.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().populate('allocatedRoom');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Room Allocation
router.post('/allocate', async (req, res) => {
  const { studentId, roomId } = req.body;
  try {
    const room = await Room.findById(roomId);
    const student = await Student.findById(studentId);

    if (!room || !student) return res.status(404).json({ error: 'Room or Student not found' });
    if (room.occupancy >= room.capacity) return res.status(400).json({ error: 'Room is full' });
    if (student.status === 'allocated') return res.status(400).json({ error: 'Student already allocated' });

    student.allocatedRoom = roomId;
    student.status = 'allocated';
    await student.save();

    room.occupancy += 1;
    if (room.occupancy === room.capacity) room.status = 'full';
    await room.save();

    await Fee.create({
      student: studentId,
      room: roomId,
      amountDue: room.monthlyRent,
      amountPaid: 0,
      status: 'pending'
    });

    res.json({ message: 'Room allocated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fee Tracking Endpoints
router.get('/fees', async (req, res) => {
  try {
    const fees = await Fee.find().populate('student').populate('room');
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/fees/pay', async (req, res) => {
  const { feeId, amountPaid } = req.body;
  try {
    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ error: 'Fee not found' });

    fee.amountPaid += Number(amountPaid);
    if (fee.amountPaid >= fee.amountDue) {
      fee.status = 'paid';
    } else if (fee.amountPaid > 0) {
      fee.status = 'partial';
    }
    fee.paidAt = new Date();
    await fee.save();

    res.json({ message: 'Payment recorded', fee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;