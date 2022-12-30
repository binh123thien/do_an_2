'use strict';

const bcrypt = require('bcrypt');
const utils = require('./../_helper/utils');
const userData = require('./database/data');
const constant = require('./../_core/constant');
const apiRecaptchav3 = require('./../_helper/api/reCaptchav3');
const moment = require('moment');
const redis = require('redis');
const client = redis.createClient();

// ===============================================
// tạo đường dẫn vào trang Sign In
const getSignIn = async(req, res) => {
        res.render('pages/auth/Sign_in');
    }
    // =============================================
const getSignUp = async(req, res) => {
        res.render('pages/auth/Sign_up');
    }
    //=========================================================

const getLogout = async(req, res) => {
    req.session.user = null; // xóa session id
    req.session.total = null;
    res.redirect('/auth/signin');
};

const getOTP = async(req, res) => {
    //lấy giá trị đếm ngược
    client.TTL('otp_' + req.session.active_user.id, (err, reply) => {
        if (err) throw err;
        res.render('pages/auth/OTP', { reply, req });
    });
}

const getForgotPass = async(req, res) => {
    res.render('pages/auth/ForgotPass');
}

const get_Create_new_pass = async(req, res) => {
    res.render('pages/auth/create_new_pass');
}

// ===================================================== POST
const postSignUp = async(req, res) => {
    //Tim kiem so sanh mobile tren he thong
    const check_phone_db = await userData.findBy({
        mobile: req.body.mobile,
    });
    // Neu co thi thong bao cho user biet
    if (check_phone_db) {
        //thông báo ra màn hình
        req.flash('error_messages', 'Số điện thoại đã được đăng ký!');
        res.redirect('back');
    } else {
        //lấy dữ liệu từ form nhập ở trang đăng nhập
        const data = {
            mobile: req.body.mobile,
            password: req.body.pass,
            email: req.body.email,
            full_name: req.body.name,
        };
        //push dữ liệu lên database 
        const user = await userData.userCreate(data);
        //Tao ma OTP
        const otp = utils.OTPGenerator(4);
        //Luu OTP vao redis
        client.set('otp_' + user.id, otp);
        // //Show OTP ra 
        client.get('otp_' + user.id, (err, reply) => {
            if (err) throw err;
            console.log('Ma OTP cua quy khach:', reply);
        });
        //Gioi han OTP trong 30s
        client.expire('otp_' + user.id, 30);
        //Luu session 
        req.session.active_user = user;

        //Chuyen sang trang xac thuc tai khoan
        res.redirect('/auth/OTP');
    }
}

const postSignIn = async(req, res) => {
    const user = await userData.findBy({
        mobile: req.body.mobile,
        password: req.body.pass,
    });
    if (user) {
        if (user.status == 'active') {
            req.session.user = user.id,
                res.redirect('/dashboard');
        } else if (user.status == 'pending') {
            //Tao ma OTP
            const otp = utils.OTPGenerator(4);
            //Luu OTP vao redis
            client.set('otp_' + user.id, otp);
            // //Show OTP ra 
            client.get('otp_' + user.id, (err, reply) => {
                if (err) throw err;
                console.log('Ma OTP cua quy khach:', reply);
            });
            //Gioi han OTP trong 30s
            client.expire('otp_' + user.id, 30);
            //Luu session 
            req.session.active_user = user;
            req.flash('error_messages', 'Tài khoản của bạn chưa xác nhận OTP.');
            res.redirect('/auth/OTP');
        } else {
            req.flash('error_messages', 'Số điện thoại hoặc mật khẩu không đúng.');
            res.redirect('back');
        }
    } else {
        req.flash('error_messages', 'Số điện thoại hoặc mật khẩu không đúng.');
        res.redirect('back');
    }
}
const checkOTP = async(req, res) => {
    //lấy 4 số khách nhập
    const OTP1 = req.body.dight1;
    const OTP2 = req.body.dight2;
    const OTP3 = req.body.dight3;
    const OTP4 = req.body.dight4;
    const maOTP = OTP1 + OTP2 + OTP3 + OTP4;
    //chuyển mã OTP sang string
    const OTPinput = JSON.stringify(maOTP);
    //Show mã của khách nhập ra
    console.log('Ma khach nhap:', OTPinput);
    //chuyển mã OTP trong redis sang string
    client.get('otp_' + req.session.active_user.id, async(err, reply) => {
        if (err) throw err;
        // chuyen redis thanh chuoi
        const OTPredis = JSON.stringify(reply);
        //so sanh OTPinput voi OTPredis
        if (OTPinput == OTPredis) {
            //tim kiem ID user
            const user = await userData.findBy({
                id: req.session.active_user.id
            });
            //update status
            user.update({
                status: 'active'
            });
            //xóa session active_user để ban đầu load trang OTP, chạy permission Activer_User: để trả về trang signin
            req.session.active_user = null;
            //chuyển sang trang chủ
            req.session.user = user.id;
            res.redirect('/dashboard');
        } else {
            //sai OTP thì back lại và thông báo
            req.flash('error_messages', 'Mã OTP không đúng');
            res.redirect('back');
            console.log('Ma OTP khong dung');
        }
    });
}

const post_Resend_OTP = async(req, res) => {
    //Xuất mã OTP lại gán vào biến
    client.get('otp_' + req.session.active_user.id, (err, reply) => {
        if (err) throw err;
        const OTPrecall = reply;
        //Nếu OTP hết hạn thì tạo lại OTP mới
        if (OTPrecall == null) {
            //Tạo mã OTP mới
            const otp = utils.OTPGenerator(4);
            //gán vào redis
            client.set('otp_' + req.session.active_user.id, (otp), (err, reply) => {
                if (err) throw err;
                //gioi han ma trong 20s
                client.expire('otp_' + req.session.active_user.id, 30);
                client.get('otp_' + req.session.active_user.id, (err, reply) => {
                    if (err) throw err;
                    console.log('Ma moi cua ban la:', reply);
                    req.flash('success_messages', 'Mã OTP mới đã được gửi!');
                    res.redirect('back');
                });
            });
        } else {
            req.flash('error_messages', 'Mã OTP còn hiệu lực, Kiểm tra OTP gửi về điện thoại!');
            res.redirect('back');
            //Nếu còn thì thông báo sử dụng mã cũ
            console.log('Ma van con:', OTPrecall);
        }
    });
}
const post_ForgotPass = async(req, res) => {
    const check_phone_forgot = await userData.findBy({
            mobile: req.body.mobile,
        })
        //kiểm tra số điện thoại có trên db ko
    if (check_phone_forgot) {
        req.session.active_user = check_phone_forgot;
        res.redirect('/auth/Creat_new_pass');
    } else {
        req.flash('error_messages', 'Số điện thoại chưa được đăng kí');
        res.redirect('back');
    }
}

const post_Create_new_pass = async(req, res) => {
        const pass = req.body.pass;
        const confirm_pass = req.body.pass_confirm;
        const user = await userData.findBy({
            mobile: req.session.active_user.mobile
        });
        if (pass === confirm_pass) {
            user.update({
                password: req.body.pass,
            });
            req.flash('success_messages', 'Tạo mật khẩu mới thành công!!');
            res.redirect('/auth/signin');
        } else {
            req.flash('error_messages', 'Mật khẩu không trùng khớp');
            res.redirect('back');
        }

    }
    // =========================================== template
    //=====================================================

module.exports = {
    //get
    getSignIn,
    getSignUp,
    getLogout,
    getOTP,
    getForgotPass,
    get_Create_new_pass,
    //======= post
    postSignUp,
    postSignIn,
    checkOTP,
    post_Resend_OTP,
    post_ForgotPass,
    post_Create_new_pass,
}