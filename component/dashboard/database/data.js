'use strict';
const productsModel = require('./model.products');
const constant = require('./../../_core/constant');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findBy = async(data) => {
    const _obj = productsModel.create();

    const options = {};
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    // if (data.mobile) {
    //     if (!options.where) options.where = {};
    //     options.where.mobile = data.mobile;
    // }
    // if (data.password) {
    //     if (!options.where) options.where = {};
    //     options.where.password = data.password;
    // }
    return _obj.findOne(options)
};

const findAll = async(data) => {
    const _obj = productsModel.create();

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
    return _obj.findAll(options)
};
//=====================================================
const productsCreate = async(data) => {
    const obj = productsModel.create();
    return obj.create(data);
};
//=====================================================

const queryProducts = (data) => {
    const Product = productsModel.create();
    const options = {
        distinct: true,
        offset: data.offset,
        limit: data.limit,
        order: [
            //[receipt, 'id', 'DESC'],
            ['id', 'DESC']
        ],
    };
    if (data.keyword) {
        options.where = {
            [Op.or]: [{
                    product_name: {
                        [Op.like]: '%' + data.keyword + '%'
                    }
                },
                {
                    price: {
                        [Op.like]: '%' + data.keyword + '%'
                    }
                },
            ]
        }
    }

    if (data.user_id) {
        if (!options.where) options.where = {};
        options.where.user_id = data.user_id;
    }
    return Product.findAndCountAll(options);
};

module.exports = {
    findBy,
    productsCreate,
    findAll,
    queryProducts
};