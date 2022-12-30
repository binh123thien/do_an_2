'use strict';

const constants = require('./../_core/constant');
const moment = require('moment');
const utils = require('./../_helper/utils');
const productData = require('./database/data');
const cartData = require('./database/data cart');

const getDashboard = async(req, res) => {
    // nếu ỦRL chưa đúng định dạng (có truy vấn page) thì đổi lại cho đúng
    if (!req.query.page) {
        res.redirect('/dashboard?page=1');
    } else {
        const size = 4;
        //nếu có page thì hiện page còn không có page thì hiện 1
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const _dataProduct = {
            offset: (page - 1) * size,
            limit: size,
            user_id: req.user.id,
        };
        // Kiểm tra xem có tìm kiếm hay không
        if (req.query.key) {
            _dataProduct.keyword = utils.Trim(req.query.key);
        }
        const queryProduct = await productData.queryProducts(_dataProduct);
        const paging = utils.Paging(req.originalUrl, queryProduct.count, size, page);

        res.render('pages/dashboard/index', {
            req,
            paging,
            queryProduct,
            size,

        });
    }

};
// trang giỏ hàng
const getModal = async(req, res) => {
    // tìm sản phẩm đã thêm vào giỏ hàng
    const Producted_Order = await cartData.findAll({
        user_id: req.user.id
    });
    res.render('pages/dashboard/add_to_cart', {
        req,
        Producted_Order,
    });
};

//xác nhận đơn hàng
const post_confirm_order = async(req, res) => {
    let total_item = 0;
    let total = 0;
    //tìm tất cả sản phẩm troing giỏ hàng
    const data = await cartData.findAll({
        user_id: req.user.id,
        product_quantity: req.body.amount,
        product_name: req.body.product_name,
        price: req.body.price,
    });
    //lấy từng gtri trong mảng
    data.forEach(i => {
        console.log('ooooooo', parseInt(i.price));
        console.log('llllll', i.product_quantity);
        total_item = (parseInt(i.price) * (i.product_quantity));
        console.log('totalllllll', total_item);
        i.update({
            total: total_item,
        })
        console.log(i);
        total += (parseInt(i.price) * (i.product_quantity));
        console.log('totalllllll tổng', total);
    });
    req.session.total = total;
    res.redirect('back');
};

//minus
const post_minus = async(req, res) => {
    //tìm sản phảm được chọn
    const product_id = await cartData.findBy({
        id: req.params.quantityId
    });

    let quantity = parseInt(product_id.product_quantity);
    quantity = quantity - 1;
    if (quantity <= 0) {
        req.flash('error_messages', 'Lỗi số lượng');
    } else {
        product_id.update({
            product_quantity: quantity,
        });
    }
    res.redirect('back');
};
//plus
const post_plus = async(req, res) => {
    //tìm sản phảm được chọn
    const product_id = await cartData.findBy({
        id: req.params.quantityId
    });

    let quantity = parseInt(product_id.product_quantity);
    quantity = quantity + 1;
    if (quantity <= 0) {
        req.flash('error_messages', 'Lỗi số lượng');
    } else {
        product_id.update({
            product_quantity: quantity,
        });
    }
    res.redirect('back');
};
// trang upload
const get_Add_Product = async(req, res) => {
    res.render('pages/dashboard/add_product', {
        req
    });
};
//phân trang tìm kiếm
const postSearchPrevious = async(req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page - 1;
        if (!req.params.key) {
            res.redirect('/dashboard?page=' + page);
        } else {
            res.redirect('/dashboard?page=' + page + '&key=' + req.params.key);
        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postSearchNext = async(req, res) => {
    try {
        let page = parseInt(req.params.page);
        page = page + 1;
        if (!req.params.key) {
            res.redirect('/dashboard?page=' + page);
        } else {
            res.redirect('/dashboard?page=' + page + '&key=' + req.params.key);
        }
    } catch (e) {
        console.log(e);
        res.render('pages/error/500');
    }
};

const postSearch = async(req, res) => {
    if (utils.Trim(req.body.key).length > 0) {
        res.redirect('/dashboard?page=1&key=' + utils.Trim(req.body.key));
    } else {
        res.redirect('/dashboard?page=1');
    }
}

//============= upload image ==================
const multer = require('multer');
const upload = multer().single('profile_pic');
const readXlsxFile = require("read-excel-file/node");
// const excel = require("exceljs");

let handleUploadFile = async(req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form

    upload(req, res, async function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        // Display uploaded image for user validation
        // res.send(`You have uploaded this image: <hr/><img src="/upload/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`);

        //đường dẫn vào file
        let path = 'public/upload/' + req.file.filename;
        //đọc dữ liệu excel
        readXlsxFile(path).then(async(rows) => {
            //bỏ hàng đầu tiên
            rows.shift();
            //lọc mảng
            rows.forEach(async(row) => {
                let data = {
                    user_id: req.user.id,
                    product_name: row[0],
                    price: row[1],
                    img_name: row[2],
                };
                // console.log('dataaaaaaa', data);
                const uploadProducts = await productData.productsCreate(data);
                // products.push(products);
            });
        });

        req.flash('success_messages', 'Thêm sản phẩm thành công!')
        res.redirect('back');
        // const reader = require('xlsx');
        // let data = [];
        // try {
        //     const file = reader.readFile('public/upload/' + req.file.filename);
        //     const sheetNames = file.SheetNames
        //     for (let i = 0; i < sheetNames.length; i++) {
        //         const arr = reader.utils.sheet_to_json(
        //                 file.Sheets[sheetNames[i]])
        //             // console.log('oooooooo', sheetNames);
        //             // console.log('pppppppppppp', file.Sheets[sheetNames[i]]);
        //         arr.forEach(i => {
        //             data.push(i)
        //         })
        //     }
        //     // console.log('data sau khi push', data);
        //     // console.log('từng data', data[1][A]);
        // } catch (error) {
        //     console.log(error);
        // }
    });
};
//===================================CARTS================================================
const postAdd_to_cart = async(req, res) => {
    //thêm dữ liệu vào trang thêm sản phẩm vào giỏ hàng
    const data = {
        user_id: req.user.id,
        product_name: req.body.productname,
        price: req.body.price,
        img_name: req.body.img,
    };
    //đưa data lên db
    const cart_db = await cartData.cartsCreate(data);
    if (cart_db) {
        req.flash('success_messages', 'Đã thêm sản phẩm vào giỏ hàng của bạn!');
        res.redirect('back');
    } else {
        req.flash('error_messages', 'Thêm sản phẩm vào giỏ hàng thất bại');
        res.redirect('back');
    }
}

const post_Remove_Product_Cart = async(req, res) => {
    //kiếm sản phẩm user muốn xóa
    const delete_product = await cartData.findBy({
        user_id: req.user.id,
        id: req.params.productId,
    });
    if (delete_product) {
        //delete
        delete_product.destroy();
        req.flash('success_messages', 'Xóa sản phẩm trong giỏ thành công!');
        res.redirect('back');
    } else {
        req.flash('error_messages', 'Xóa sản phẩm thất bại');
        res.redirect('back');
    }
}
module.exports = {
    getDashboard,
    get_Add_Product,
    //upload sản phẩm
    handleUploadFile,
    //phân trang, tìm kiếm
    postSearchPrevious,
    postSearchNext,
    postSearch,
    //CARTS
    postAdd_to_cart,
    post_Remove_Product_Cart,
    getModal,
    post_confirm_order,
    post_minus,
    post_plus
};