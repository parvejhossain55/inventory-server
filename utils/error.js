// class HttpError extends Error {
//   constructor(message, status) {
//     super(message);
//     this.status = status;
//   }
// }

// function sendError(msg = "Something Went Wrong", status = 500) {
//   throw new HttpError(msg, status);
// }

function sendError(msg = "Something Went Wrong", status = 500) {
  throw new Error(msg, status);
}

module.exports = sendError;
