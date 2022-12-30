'use strict';
const cartModel = require('./model.carts');
const constant = require('./../../_core/constant');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findBy = async(data) => {
    const _obj = cartModel.create();

    const options = {};
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.product_name) {
        if (!options.where) options.where = {};
        options.where.product_name = data.product_name;
    }
    if (data.price) {
        if (!options.where) options.where = {};
        options.where.price = data.price;
    }
    if (data.img_name) {
        if (!options.where) options.where = {};
        options.where.img_name = data.img_name;
    }
    if (data.product_quantity) {
        if (!options.where) options.where = {};
        options.where.product_quantity = data.product_quantity;
    }
    return _obj.findOne(options)
};

const findAll = async(data) => {
    const _obj = cartModel.create();

    const options = {};
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.product_name) {
        if (!options.where) options.where = {};
        options.where.product_name = data.product_name;
    }
    if (data.price) {
        if (!options.where) options.where = {};
        options.where.price = data.price;
    }
    if (data.img_name) {
        if (!options.where) options.where = {};
        options.where.img_name = data.img_name;
    }
    if (data.product_quantity) {
        if (!options.where) options.where = {};
        options.where.product_quantity = data.product_quantity;
    }
    return _obj.findAll(options)
};
//=====================================================
const cartsCreate = async(data) => {
    const obj = cartModel.create();
    return obj.create(data);
};
//=====================================================

module.exports = {
    findBy,
    cartsCreate,
    findAll,
};