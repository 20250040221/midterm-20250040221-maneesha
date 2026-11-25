const EXPECTED_AUTH_TOKEN = 'hospital-secret-123';


const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};


const requireAuth = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token || token !== EXPECTED_AUTH_TOKEN) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Unauthorized: Missing or invalid 'x-auth-token' header. Valid token is required for this operation."
    });
  }
  next();
};


const notFound = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
};


const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    status: status,
    message: message
  });
};

module.exports = {
  EXPECTED_AUTH_TOKEN,
  logger,
  requireAuth,
  notFound,
  errorHandler
};
