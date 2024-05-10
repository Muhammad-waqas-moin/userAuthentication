const successResponse = (res, message, statusCode, data, length) => {
  const response = {
    status: "success",
    message: message,
  };
  if (data) {
    response.data = data;
  }
  if (length) {
    response.length = length;
  }
  return res.status(statusCode).json(response);
  //   return res.status(statusCode).json({
  //     status: "success",
  //     message: message,
  //     data: data ? data : [],
  //   });
};
const errorResponse = (res, errorMessage, statusCode) => {
  return res.status(statusCode).json({
    status: "failed",
    message: errorMessage,
  });
};

module.exports = { successResponse, errorResponse };
