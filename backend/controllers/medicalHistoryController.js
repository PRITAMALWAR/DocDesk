import MedicalHistory from '../models/MedicalHistory.js';

export const addHistory = async (req, res) => {
  const { notes, doctorId } = req.body;
  const mh = await MedicalHistory.create({ patient: req.user._id, doctor: doctorId, notes });
  res.status(201).json(mh);
};

export const getMyHistory = async (req, res) => {
  const list = await MedicalHistory.find({ patient: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
};

export const getPatientHistory = async (req, res) => {
  const { patientId } = req.params;
  const list = await MedicalHistory.find({ patient: patientId }).sort({ createdAt: -1 });
  res.json(list);
};
