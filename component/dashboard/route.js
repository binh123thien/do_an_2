const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('./../_core/middlewares/permission');

router.get(
    '/', [permission.mustLogin],
    service.getDashboard
);
// trang giỏ hàng
router.get(
    '/cart', [permission.mustLogin],
    service.getModal
);

router.post(
    '/confirm_order', [permission.mustLogin],
    service.post_confirm_order
);

router.post(
    '/:quantityId/minus', [permission.mustLogin],
    service.post_minus
);

router.post(
    '/:quantityId/plus', [permission.mustLogin],
    service.post_plus
);

//trang Upload sản phẩm
router.get(
    '/add_product', [permission.mustLogin],
    service.get_Add_Product
);
//=============================CARTS================================================================
router.post(
    '/add_to_cart', [permission.mustLogin],
    service.postAdd_to_cart
);

router.post(
    '/:productId/remove_product_cart', [permission.mustLogin],
    service.post_Remove_Product_Cart
);
//====================================================================================================================
//phân trang
router.post(
    '/search-products/Previous/:page/:key', [permission.mustLogin],
    service.postSearchPrevious,
);

router.post(
    '/search-products/Previous/:page', [permission.mustLogin],
    service.postSearchPrevious,
);
router.post(
    '/search-products/Next/:page/:key', [permission.mustLogin],
    service.postSearchNext,
);
router.post(
    '/search-products/Next/:page', [permission.mustLogin],
    service.postSearchNext,
);

//tìm kiếm
router.post(
    '/search', [permission.mustLogin],
    service.postSearch,
);

//==============upload file excel =============================================
// const readXlsxFile = require('read-excel-file/node');
const reader = require('xlsx');
const path = require('path');
const multer = require('multer');
// SET STORAGE
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/upload/');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
        return cb(new Error('Sai định dạng tệp'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter });
router.post(
    '/uploadfile', upload.single('myFile'), [permission.mustLogin],
    service.handleUploadFile,
)

module.exports = router;