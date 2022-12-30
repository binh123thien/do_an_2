'use strict';
const axios = require('axios');
const _ = require('lodash');

const OTPGenerator = length => {
        let result = '';
        let characters = '0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    // =======================================
const Trim = (s) => {
    if (s) {
        return s.trim();
    } else {
        return '';
    }
};

const p = (url, page) => {

    const u = url.split('?')[1];
    const u2 = u.split('&');
    let t = '';
    _.forEach(u2, (v) => {
        if (v.split('=')[0] === 'page') {
            t += 'page=' + page + '&';
        } else {
            t += v + '&';
        }
    });

    return t.substring(0, t.length - 1);
};

const replaceQuery = (url, query, newValue) => {

    const u = url.split('?')[1];
    const u2 = u.split('&');
    let t = '';
    let i = 0;
    _.forEach(u2, (v) => {
        if (v.split('=')[0] === query) {
            i = 1;
            t += query + '=' + newValue + '&';
        } else {
            t += v + '&';
        }
    });
    if (i === 0) {
        return (t + query + '=' + newValue);
    } else {
        return t.substring(0, t.length - 1);
    }
};

const Paging = (url, totalItem, itemInPage, currentPage) => {
    const pageCount = Math.ceil(totalItem / itemInPage);
    let paging = '';
    for (let i = 1; i <= pageCount; i++) {
        if (parseInt(currentPage) === i) {
            paging += "<a style =\"text-decoration: none; color: black; margin: 0px 2px;\" class=\"paginate_button current \">" + i + "</a>";
        } else {
            paging += "<a href='?" + p(url, i) + "' style =\"text-decoration: none; color: black; margin: 0px 2px;\" class=\"paginate_button \">" + i + "</a>";
        }
    }
    return paging;
};

const getCodeDomain = (domain) => {
    const ds = domain.split('.');
    let d = '';
    let i = 0;
    _.forEach(ds, (v) => {
        if (i === 1) {
            d = v;
        } else {
            d += '_' + v;
        }
        i++;
    });
    return d.toUpperCase();
};

const Digit = (s) => {
    const v = Math.ceil(s);
    return v.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

// length must > 6
function generatePassword(length) {
    let retVal = "";
    const charset = "abcdefghijklmnopqrstuvwxyz";
    const charsetLength = length - 6;
    for (let i = 0, n = charset.length; i < charsetLength; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const upperLength = 2;
    for (let i = 0, n = upper.length; i < upperLength; ++i) {
        retVal += upper.charAt(Math.floor(Math.random() * n));
    }

    const number = "0123456789";
    const numberLength = 2;
    for (let i = 0, n = number.length; i < numberLength; ++i) {
        retVal += number.charAt(Math.floor(Math.random() * n));
    }

    const punctuation = "!@#$%^&*()_+~`|}{[]\\:;?><,./-=";
    const punctuationLenght = 2;
    for (let i = 0, n = punctuation.length; i < punctuationLenght; ++i) {
        retVal += punctuation.charAt(Math.floor(Math.random() * n));
    }


    return shuffelWord(retVal);
}

function shuffelWord(Word) {
    let shuffledWord = '';
    Word = Word.split('');
    while (Word.length > 0) {
        shuffledWord += Word.splice(Word.length * Math.random() << 0, 1);
    }
    return shuffledWord;
}

const getAccessToken = async(data) => {
    const url = data.protocol + '://' + data.domain + '/wp-json/onweb/v1/generate/token';
    return axios.post(url, {
        private_key_crm: data.website_key,
        user: data.website_user
    });
};

const Url2Domain2 = (url, subDomain = false) => {
    if (url !== undefined) {
        url = url.replace(/(https?:\/\/)?(www.)?/i, '');

        if (subDomain) {
            url = url.split('.');
            url = url.slice(url.length - 2).join('.');
        }

        if (url.indexOf('/') !== -1) {
            return url.split('/')[0];
        }
    } else {
        url = '';
    }

    return url;
};

const removeVietnameseTones = str => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
};

module.exports = {
    Trim,
    Paging,
    replaceQuery,
    getCodeDomain,
    Digit,
    generatePassword,
    getAccessToken,
    Url2Domain2,
    removeVietnameseTones,
    // ==============
    OTPGenerator
};