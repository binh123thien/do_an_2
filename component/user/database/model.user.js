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
        full_name: Sequelize.STRING,
        mobile: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        created_date: Sequelize.DATE,
        status: Sequelize.STRING,
    },
    options: {
        freezeTableName: true,
        // define the table's names
        timestamps: false,
        tableName: 'users'
    }
};

const create = () => {
    return dbconnect.define(config.options.tableName, config.schema, config.options);
};

module.exports = {
    create
};