// middleware/validate.js
const { z } = require('zod');

const validate = (schemas) => (req, res, next) => {
  try {
    // 1. Ensure schemas object exists
    if (!schemas) {
      throw new Error("No schemas were passed to the validate middleware!");
    }

    // 2. Check body if schema is provided
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    
    // 3. Check params if schema is provided
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }

    // 4. Check query if schema is provided
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }

    return next();
  } catch (error) {
    // Check if it's a Zod error (using both issues and errors fields safely)
    const zodIssues = error?.issues || error?.errors;

    if (zodIssues && Array.isArray(zodIssues)) {
      const formattedErrors = zodIssues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({ 
        status: 'fail', 
        errors: formattedErrors 
      });
    }

    // CRITICAL: If it's NOT a Zod error, print it to the terminal so we can see it!
    console.error("====== REAL ERROR INSIDE MIDDLEWARE ======");
    console.error(error);
    console.error("==========================================");

    return res.status(500).json({
      status: 'error',
      message: error.message || 'An unexpected error occurred'
    });
  }
};

module.exports = validate;
