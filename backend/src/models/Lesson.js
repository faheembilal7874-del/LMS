import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  order: { type: Number, default: 1 },
  isPreview: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Lesson', schema);