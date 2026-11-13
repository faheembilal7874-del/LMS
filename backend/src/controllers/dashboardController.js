import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
export async function stats(_req, res) {
  const [students, instructors, courses, enrollments, pendingCourses] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Course.countDocuments({ status: 'pending' })
  ]);
  res.json({ students, instructors, courses, enrollments, pendingCourses });
}