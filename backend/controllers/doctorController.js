import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export const listDoctors = async (req, res) => {
  const { specialty, minRating, q } = req.query;
  const filter = {};
  if (specialty) filter.specialty = new RegExp(`^${specialty}$`, 'i');
  if (minRating) filter.rating = { $gte: Number(minRating) };

  // Perform DB-level filtering first
  const docs = await Doctor.find(filter).populate('user', 'name email');

  // Apply text search across specialty and populated user.name in memory
  // This ensures searching by doctor name works even though name is in the User collection
  let out = docs;
  if (q && String(q).trim()) {
    const rx = new RegExp(String(q).trim(), 'i');
    out = docs.filter(d => rx.test(d.specialty || '') || rx.test(d.user?.name || ''));
  }
  res.json(out);
};

export const getMyDoctorProfile = async (req, res) => {
  const userId = req.user._id;
  const doc = await Doctor.findOne({ user: userId }).populate('user', 'name email role');
  if (!doc) return res.status(404).json({ message: 'Doctor profile not found' });
  res.json(doc);
};

export const getDoctorById = async (req, res) => {
  const { id } = req.params;
  const doc = await Doctor.findById(id).populate('user', 'name email');
  if (!doc) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doc);
};

export const createDoctor = async (req, res) => {
  const { userId, specialty, availability } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const doc = await Doctor.create({ user: userId, specialty, availability });
  res.status(201).json(doc);
};

export const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const upd = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
  if (!upd) return res.status(404).json({ message: 'Doctor not found' });
  res.json(upd);
};

export const upsertMyDoctorProfile = async (req, res) => {
  // Only for logged-in doctors/admins; doctor user creates/updates their own profile
  const userId = req.user._id;
  const {
    specialty,
    profilePhoto,
    degree,
    gender,
    languages,
    hospitalName,
    clinicAddress,
    experienceYears,
    availableDays,
    timeSlots
  } = req.body;

  // Build availability from availableDays + timeSlots (array of strings HH:MM)
  let availability = undefined;
  if (Array.isArray(availableDays) && Array.isArray(timeSlots)) {
    availability = availableDays.map((d) => ({ day: d, slots: timeSlots }));
  }

  const payload = {
    specialty,
    profilePhoto,
    degree,
    gender,
    languages,
    hospitalName,
    clinicAddress,
    ...(typeof experienceYears !== 'undefined' ? { experienceYears } : {}),
    ...(availability ? { availability } : {}),
  };

  let doc = await Doctor.findOne({ user: userId });
  if (!doc) {
    if (!specialty) return res.status(400).json({ message: 'specialty required' });
    doc = await Doctor.create({ user: userId, ...payload });
    return res.status(201).json(doc);
  } else {
    Object.assign(doc, payload);
    await doc.save();
    return res.json(doc);
  }
};
