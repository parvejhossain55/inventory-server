const transactionId = () => {
  const characters =
    "ABCDEFGH01234IJKLMNOPQRST012389UVWXYZ0123456";
  const length = 12;
  let transactionId = "";
  for (let i = 0; i < length; i++) {
    transactionId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return transactionId;
};

module.exports = transactionId;
