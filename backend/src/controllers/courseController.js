import Course from '../models/Course.js';
export async function listCourses(_req, res) {
  const courses = await Course.find().populate('instructor', 'name email').populate('category', 'name').sort({ createdAt: -1 });
  res.json(courses);
}
export async function createCourse(req, res) {
  const { title, description, instructor, category, price, level, status } = req.body;
  if (!title) return res.status(400).json({ message: 'Course title is required' });
  const course = await Course.create({ title, description, instructor: instructor || undefined, category: category || undefined, price, level, status });
  res.status(201).json(course);
}
export async function updateCourse(req, res) {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
}
export async function deleteCourse(req, res) {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ message: 'Course deleted' });
}