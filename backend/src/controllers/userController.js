import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function listUsers(req, res) {
  const filter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
}
export async function createUser(req, res) {
  const { name, email, password, role = 'student' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (!['student', 'instructor', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });
}