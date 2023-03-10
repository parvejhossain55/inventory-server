const BrandService = require("../services/BrandService");

async function getAllBrands(req, res) {
  try {
    const brand = await BrandService.getAllBrands();
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getBrandById(req, res) {
  try {
    const brand = await BrandService.getBrandById(req.params.id);
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createBrand(req, res) {
  try {
    const brand = await BrandService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateBrand(req, res) {
  try {
    const brand = await BrandService.updateBrand(req.params.id, req.body);
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteBrand(req, res) {
  try {
    const { status, message } = await BrandService.deleteBrand(
      req.user.role,
      req.params.id
    );
    res.status(status).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllProductsByBrand(req, res) {
  try {
    const products = await CategoryService.getAllCategories();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getAllProductsByBrand,
};
