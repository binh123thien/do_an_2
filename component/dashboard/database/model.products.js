'use strict';
const _ = require("lodash");

const Sequelize = require('sequelize');

const config = {
    schema: {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        product_name: Sequelize.STRING,
        price: Sequelize.STRING,
        img_name: Sequelize.STRING,
        user_id: Sequelize.BIGINT,

    },
    options: {
        freezeTableName: true,
        // define the table's names
        timestamps: false,
        tableName: 'products'
    }
};

const create = () => {
    return dbconnect.define(config.options.tableName, config.schema, config.options);
};

module.exports = {
    create
};