// external module
const express = require('express');
const router = express.Router();
const {z} = require('zod');
const validate = require('../middleware/validate');


// local module
const {register,getlogin} = require('../Controller/auth.controller');
const {registerSchema,loginSchema} = require('../libs/validate-schema')

// post /api/auth/register
router.post('/register',validate({
    body: registerSchema,

}),register );

// post /api/auth/login
router.post('/login',validate({
    body:loginSchema
}),getlogin);

module.exports = router;
