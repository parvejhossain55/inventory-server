const slugify = require("slugify");
const Brand = require("../models/BrandModel");

async function getAllBrands() {
  return await Brand.find();
}

async function getBrandById(id) {
  return await Brand.findById(id);
}

async function createBrand(brandData) {
  const brand = new Brand(brandData);
  await brand.save();
  return brand;
}

async function updateBrand(id, brandData) {
  const brand = await Brand.findByIdAndUpdate(id, brandData, { new: true });
  return brand;
}

async function deleteBrand(role, id) {
  try {
    if (role !== "admin") {
      return { status: 403, message: "Only admins can delete categories." };
    }

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return { status: 404, message: "Brand not found" };
    }

    return { status: 200, message: "Brand deleted successfully." };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "An error occurred while deleting the Brand.",
    };
  }
}

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
