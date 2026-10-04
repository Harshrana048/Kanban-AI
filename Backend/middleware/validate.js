// middleware/validate.js
const { z } = require('zod');

const validate = (schemas) => (req, res, next) => {
  // If the user forgot to pass schemas
  if (!schemas) {
    return res.status(500).json({ error: "Validation schema is required" });
  }

  
  const schemaConfig = schemas.safeParse ? { body: schemas } : schemas;

  const errors = [];

  // 1. Check Body
  if (schemaConfig.body) {
    const result = schemaConfig.body.safeParse(req.body);
    if (!result.success) {
      result.error.issues.forEach((err) => {
        errors.push({ field: err.path.join('.'), message: err.message });
      });
    } else {
      req.body = result.data; 
    }
  }

  // 2. Check Params
  if (schemaConfig.params) {
    const result = schemaConfig.params.safeParse(req.params);
    if (!result.success) {
      result.error.issues.forEach((err) => {
        errors.push({ field: err.path.join('.'), message: err.message });
      });
    } else {
      Object.assign(req.params, result.data);
    }
  }

  // 3. Check Query
  if (schemaConfig.query) {
    const result = schemaConfig.query.safeParse(req.query);
    if (!result.success) {
      result.error.issues.forEach((err) => {
        errors.push({ field: err.path.join('.'), message: err.message });
      });
    } else {
      Object.assign(req.query, result.data);
    }
  }

  
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      errors: errors,
    });
  }

  return next();
};

module.exports = validate;