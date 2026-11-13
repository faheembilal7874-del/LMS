import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'instructor', 'student'], default: 'student' },
  status: { type: String, enum: ['active', 'pending', 'blocked'], default: 'active' },
  avatarUrl: String
}, { timestamps: true });
export default mongoose.model('User', userSchema);