import Category from '../models/Category.js';
export async function listCategories(_req, res) { res.json(await Category.find().sort({ name: 1 })); }
export async function createCategory(req, res) {
  if (!req.body.name) return res.status(400).json({ message: 'Category name is required' });
  res.status(201).json(await Category.create({ name: req.body.name, description: req.body.description }));
}
export async function updateCategory(req, res) {
  const item = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Category not found' });
  res.json(item);
}
export async function deleteCategory(req, res) {
  const item = await Category.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
}