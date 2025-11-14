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

export const updateMyHistory = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const doc = await MedicalHistory.findOne({ _id: id, patient: req.user._id });
  if (!doc) return res.status(404).json({ message: 'History not found' });
  if (typeof notes === 'string' && notes.trim().length > 0) {
    doc.notes = notes;
  }
  await doc.save();
  res.json(doc);
};

export const deleteMyHistory = async (req, res) => {
  const { id } = req.params;
  const doc = await MedicalHistory.findOne({ _id: id, patient: req.user._id });
  if (!doc) return res.status(404).json({ message: 'History not found' });
  await doc.deleteOne();
  res.status(204).send();
};
