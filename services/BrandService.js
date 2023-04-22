const fs = require("fs");
const path = require("path");
const Brand = require("../models/BrandModel");

async function getAllBrands() {
  return await Brand.find().select("name slug image");
}

async function getBrandBySlug(slug) {
  return await Brand.findOne({ slug });
}

async function createBrand(brandData, image) {
  try {
    const brand = await Brand.create({ ...brandData, image });
    console.log("brand ", brand);

    return { status: 201, message: "Brand Created", brand };
  } catch (error) {
    const filePath = path.join(__dirname, "../", "public", "uploads", image);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return
      }
    });
    return { status: 500, message: "Something Wrong "};
  }
}

async function updateBrand(id, brandData, image) {
  const updateBrand = { name: brandData.name };

  if (image) {
    const filePath = path.join(
      __dirname,
      "../",
      "public",
      "uploads",
      brandData.old_img
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    updateBrand.image = image;
  }

  const brand = await Brand.findByIdAndUpdate(id, updateBrand);
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

    const filePath = path.join(
      __dirname,
      "../",
      "public",
      "uploads",
      brand.image
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

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
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
};
