import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },
  slots: [{ type: String }]
});

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialty: { type: String, required: true },
    availability: [availabilitySchema],
    profilePhoto: { type: String },
    degree: { type: String },
    gender: { type: String, enum: ['Male','Female','Other'], default: 'Male' },
    languages: [{ type: String }],
    hospitalName: { type: String },
    clinicAddress: { type: String },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
