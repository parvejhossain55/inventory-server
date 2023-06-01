const BrandService = require("../services/BrandService");
const cloudinary = require("cloudinary").v2;

async function getAllBrands(req, res) {
  try {
    const brand = await BrandService.getAllBrands();
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getBrandBySlug(req, res) {
  try {
    const brand = await BrandService.getBrandById(req.params.slug);
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createBrand(req, res, next) {
  try {
    let data = { ...req.body, image: {} };

    if (req?.file) {
      (data.image.public_id = req.file.cloudinaryId),
        (data.image.secure_url = req.file.cloudinaryUrl);
    }

    const { status, message, brand } = await BrandService.createBrand(data);
    res.status(status).json({ message, brand });
  } catch (err) {
    next(err);
  }
}

async function updateBrand(req, res, next) {
  try {
    const { name, slug, public_id, secure_url } = req.body;
    const data = {};
    // const data = { name, slug, image: { public_id, secure_url } };

    if (req?.file) {
      await cloudinary.uploader.destroy(public_id);
      const imgData = {
        public_id: req.file.cloudinaryId,
        secure_url: req.file.cloudinaryUrl,
      };

      data.image = imgData;
    }

    data.name = name;
    data.slug = slug;

    const brand = await BrandService.updateBrand(req.params.id, data);
    res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
}

async function deleteBrand(req, res) {
  try {
    const { status, message } = await BrandService.deleteBrand(
      req.user.role,
      req.params.id,
      req.query
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
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  getAllProductsByBrand,
};
