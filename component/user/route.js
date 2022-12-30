const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('./../_core/middlewares/permission');

//xuất UI
//đường dẫn trực tiếp vào trang SignIn
router.get(
    '/', //đường dẫn vào trang signin
    [permission.noLogin],
    service.getSignIn
);

router.get(
    '/forgotpass', //đường dẫn vào trang quên mật khẩu
    [permission.noLogin],
    service.getForgotPass
);

router.get(
    '/signin', //đường dẫn vào trang signin
    [permission.noLogin],
    service.getSignIn
);

router.get(
    '/signup', //đường dẫn vào trang signup
    [permission.noLogin],
    service.getSignUp
);

router.get(
    '/logout', [],
    service.getLogout
)

router.get(
    '/OTP', [permission.isActiveUserActon],
    service.getOTP
)

router.get(
    '/Creat_new_pass', [permission.noLogin],
    service.get_Create_new_pass
)

//post thông tin lên database
router.post(
    '/signup', [permission.noLogin],
    service.postSignUp
)

router.post(
    '/signin', [permission.noLogin],
    service.postSignIn
)

router.post(
    '/checkOTP', [permission.isActiveUserActon],
    service.checkOTP
)

router.post(
    '/resend_OTP', [permission.isActiveUserActon],
    service.post_Resend_OTP
)

router.post(
    '/forgotpass', [permission.noLogin],
    service.post_ForgotPass
);

router.post(
    '/create_new_pass', [permission.noLogin],
    service.post_Create_new_pass
)
module.exports = router;