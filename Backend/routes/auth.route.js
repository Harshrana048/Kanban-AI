// external module
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');


// local module
const {register,getlogin, verifyEmail, resendVerification, getMe, logout} = require('../Controller/auth.controller');
const {registerSchema,loginSchema} = require('../libs/validate-schema');
const { protect } = require('../middleware/auth.middleware');

// post /api/auth/register
router.post('/register',validate({
    body: registerSchema,

}),register );

//  @GET /api/auth/verify-email/:token
router.get('verify-email/:token',verifyEmail)

// @POST /api/auth/resend-verification
router.post('/resend-verification',resendVerification);

// post /api/auth/login
router.post('/login',validate({
    body:loginSchema
}),getlogin);

//  @GET /api/auth/me
router.get('me',protect,getMe);

// @POST /api/auth/logout

router.post('logout',protect,logout);


module.exports = router;
