const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthMiddleware');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @route   POST /api/appointments
// @desc    Book a new appointment (Patient only)
router.post('/', auth, async (req, res) => {
  const { doctorId, date, reason } = req.body;
  
  if (req.user.role !== 'patient') {
    return res.status(403).json({ msg: 'Access denied. Only patients can book appointments.' });
  }

  try {
    const newAppointment = new Appointment({
      patient: req.user.id,
      doctor: doctorId,
      date,
      reason,
    });

    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/appointments/patient
// @desc    Get all appointments for a patient
router.get('/patient', auth, async (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ msg: 'Access denied.' });
  }
  
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', ['name', 'email']);
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/appointments/doctor
// @desc    Get all appointments for a doctor
router.get('/doctor', auth, async (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ msg: 'Access denied.' });
  }
  
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', ['name', 'email']);
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
