import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
