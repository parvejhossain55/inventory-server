const express = require("express");
const router = express.Router();
const Product = require("../models/ProductModel");
const { faker } = require("@faker-js/faker");

router.post("/create-product", async (req, res) => {
  for (let i = 0; i < 10; i++) {
    const name = faker.commerce.productName();
    const product = new Product({
      title: name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.lorem.paragraphs(),
      price: faker.datatype.number({ min: 100, max: 2000, precision: 0.01 }),
      quantity: faker.datatype.number({ min: 10, max: 100 }),
      sku: faker.datatype.uuid(),
      type: faker.helpers.arrayElement(["feature", "sale", "new"]),
      sold: faker.datatype.number({ min: 0, max: 100 }),
      status: faker.helpers.arrayElement(["draft", "published"]),
      unit: faker.helpers.arrayElement(["piece", "set", "box"]),
      images: [faker.image.imageUrl(635, 810)],
      category: faker.helpers.arrayElements([
        "6409c7680caf2af94fc043bb",
        "6409c7da0caf2af94fc043bd",
        "6409c7ec0caf2af94fc043bf",
        "6409c81f0caf2af94fc043c3",
        "6409c8360caf2af94fc043c5",
        "6409c8960caf2af94fc043cd",
        "6409c8a10caf2af94fc043cf",
      ]),
      brand: faker.helpers.arrayElement([
        "64006ede828acfef9a053661",
        "64006f828332bc8b856b1f5f",
      ]),
    });
    product.save();
  }
  res.json({ ok: true });
});
module.exports = router;
