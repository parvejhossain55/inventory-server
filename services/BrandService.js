const cloudinary = require("cloudinary");
const Brand = require("../models/BrandModel");
const sendError = require("../utils/error");

async function getAllBrands() {
  return await Brand.find().select("name slug image");
}

async function getBrandBySlug(slug) {
  return await Brand.findOne({ slug });
}

async function createBrand(brandData) {
  try {
    const brand = await Brand.create(brandData);

    return { status: 201, message: "Brand Created", brand };
  } catch (error) {
    sendError(error.message, error.status);
  }
}

async function updateBrand(id, brandData) {
  try {
    const brand = await Brand.findByIdAndUpdate(id, brandData);
    return brand;
  } catch (error) {
    sendError(error.message, error.status);
  }
}

async function deleteBrand(role, id, { public_id }) {
  try {
    if (role !== "admin") {
      return { status: 403, message: "Only admins can delete categories." };
    }

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return { status: 404, message: "Brand not found" };
    }

    await cloudinary.uploader.destroy(public_id);

    return { status: 200, message: "Brand deleted successfully." };
  } catch (error) {
    sendError(error.message, error.status);
  }
}

module.exports = {
  getAllBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
};
