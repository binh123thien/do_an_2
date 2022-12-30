'use strict';
const userModel = require('./model.user');
const constant = require('./../../_core/constant');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const findBy = async(data) => {
    const _obj = userModel.create();

    const options = {};
    if (data.id) {
        if (!options.where) options.where = {};
        options.where.id = data.id;
    }
    if (data.mobile) {
        if (!options.where) options.where = {};
        options.where.mobile = data.mobile;
    }
    if (data.password) {
        if (!options.where) options.where = {};
        options.where.password = data.password;
    }
    return _obj.findOne(options)
};
//=====================================================
const userCreate = async(data) => {
    const obj = userModel.create();
    return obj.create(data);
};
//=====================================================

module.exports = {
    findBy,
    userCreate,
};