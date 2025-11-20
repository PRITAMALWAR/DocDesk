import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String, default: '' }
  },
  { timestamps: true }
);

// Prevent duplicate feedback from same patient to same doctor
feedbackSchema.index({ patient: 1, doctor: 1 }, { unique: true });

export default mongoose.model('Feedback', feedbackSchema);
