function generateSku() {
  let sku = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < 10; i++) {
    sku += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return sku.toUpperCase();
}

module.exports = {
  generateSku,
};
