const { default: slugify } = require("slugify");
const Category = require("../models/CategoryModel");

async function getAllCategories() {
  return await Category.find();
}

async function getCategoryById(id) {
  return await Category.findById(id);
}

async function createCategory(categoryData) {
  const category = new Category(categoryData);
  await category.save();
  return category;
}

async function updateCategory(id, categoryData) {
  const category = await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
  });
  return category;
}

async function deleteCategory(role, id) {
  try {
    if (role !== "admin") {
      return { status: 403, message: "Only admins can delete categories." };
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return { status: 404, message: "Category not found" };
    }

    return { status: 200, message: "Category deleted successfully." };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "An error occurred while deleting the category.",
    };
  }
}

async function getAllProductsByCategory() {
  return await Category.find().populate("products").exec();
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllProductsByCategory,
};
