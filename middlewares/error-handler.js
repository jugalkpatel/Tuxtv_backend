const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const error = `An Account with that ${field} already exists`;
  res.status(409).json({
    success: false,
    message: error,
    fields: field,
  });
};

const handleValidationError = (err, res) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const fields = Object.values(err.errors).map((error) => error.path);

  if (errors.length > 1) {
    const formattedErrors = errors.join(" ");
    res.status(404).json({
      success: false,
      message: formattedErrors,
      fields,
    });
    return;
  }

  res.status(404).json({
    success: false,
    message: errors,
    fields,
  });
};

const handleTokenExpiredError = (err, res) => {
  res.status(401).json({
    success: false,
    message: "Token Expired",
    err,
  });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    return (error = handleValidationError(error, res));
  }

  if (error.code && error.code === 11000) {
    return (error = handleDuplicateKeyError(error, res));
  }

  if (error.name === "TokenExpiredError") {
    return (error = handleTokenExpiredError(error, res));
  }

  console.log(error);
  console.log(error.stack);
  res.status(error.status || 500);
  res.json({
    success: false,
    status: error.status,
    message: error.message,
  });
};

module.exports = { errorHandler };
