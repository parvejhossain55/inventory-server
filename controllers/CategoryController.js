const CategoryService = require("../services/CategoryService");

async function getAllCategories(req, res) {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCategoryBySlug(req, res) {
  try {
    const category = await CategoryService.getCategoryBySlug(req.params.slug);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createCategory(req, res) {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateCategory(req, res) {
  try {
    const category = await CategoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const { status, message } = await CategoryService.deleteCategory(
      req.user.role,
      req.params.id
    );
    res.status(status).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllProductsByCategory(req, res) {
  try {
    const products = await CategoryService.getAllCategories();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllProductsByCategory,
};
