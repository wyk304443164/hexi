let common = {};

/**
 * 设置setSessionStorage
 * @param key
 * @param value
 */

common.setSessionStorage = function (key, value) {
  sessionStorage.setItem(key, value);
};

/**
 * 获取SessionStorage值
 * @param key
 * @returns {*}
 */

common.getSessionStorage = function (key) {
  return sessionStorage.getItem(key);
};

common.getAccessToken = function () {
  return this.getSessionStorage('access_token');
};

/**
 * 获取地址栏或者sessionStorage里面的openid
 * @returns {*}
 */

common.getOpenId = function () {
  //这边只有地址栏
  return this.getSessionStorage('openid');
};

/**
 * 获取url地址
 * @param name
 */

common.getQueryString = function (name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
};

/**
 * 获取url地址--NEW ,如果该方法获取不到会重新用上面的方法获取
 * @param _that
 * @param name
 * @returns {*}
 */

common.localQuery = function (_that, name) {
  let value = '';
  if (!this.isEmpty(_that) &&
    !this.isEmpty(_that.props) &&
    !this.isEmpty(_that.props.location) &&
    !this.isEmpty(_that.props.location.query)) {
    value = _that.props.location.query[name];
  }
  if (this.isEmpty(value)) {
    value = this.getQueryString(name);
  }
  return value;
};

/**
 * 如果是null 或者没有就返回''空字符串
 * @param obj
 * @returns {string}
 */

common.replaceIfNull = function (obj) {
  return this.isNull(obj) ? '' : obj;
};

/**
 * 判断是不是空的或者undefined
 * @param obj
 * @returns {boolean}
 */

common.isNull = function (obj) {
  return obj === null || typeof obj === 'undefined' || obj === undefined;
};

/**
 * 判断是不是空的字符串
 * @param obj
 * @returns {boolean}
 */

common.isEmpty = function (obj) {
  return this.isNull(obj) || obj === '';
};

/**
 * 每一页的页数
 * @type {number}
 */

common.pageSize = 10;

/**
 * 算出一共有多少页数
 * @param totalRecord
 * @param pageSize 默认就是上面的数量
 * @returns {number}
 */

common.getTotalPageNum = function (totalRecord, pageSize = this.pageSize) {
  return (totalRecord + pageSize - 1) / pageSize;
};

/**
 * 给string加上startsWith方法
 */

common.startsWith = function (str1, str2) {
  if (this.isNull(str1) || this.isNull(str2)) {
    return true;
  }
  return str1.slice(0, str2.length) === str2;
};

/**
 * 组合post，给对象，return 文字
 * @param data
 */

common.formatPostData = function (data) {
  if (this.isEmpty(data)) return '';
  let formData = "";
  for (let item in data) {
    formData += `${item}=${encodeURIComponent(data[item])}&`;
  }
  formData = formData.substr(0, formData.length - 1);
  return formData;
};

/**
 * 组合get
 * @param data
 * @returns {string}
 */

common.formatGetData = function (data) {
  if (this.isEmpty(data)) return '';
  let formData = this.formatPostData(data);
  formData = `?${formData}`;//加?号
  return formData;
};

/**
 * 格式化Number每三位加上,
 * @param number
 * @returns {*}
 */

common.formatNumberAdd = function (number) {
  if (number.length <= 3)
    return (number === '' ? '0' : number);
  else {
    let mod = number.length % 3;
    let output = (mod === 0 ? '' : (number.substring(0, mod)));
    for (let i = 0; i < Math.floor(number.length / 3); i++) {
      if ((mod === 0) && (i === 0))
        output += number.substring(mod + 3 * i, mod + 3 * i + 3);
      else
        output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
    }
    return (output);
  }
};

/**
 * 时间戳转年月日
 * @param strDate
 * @returns {string}
 */

common.formatDateTime = function (strDate) {
  if (this.isEmpty(strDate)) return '';//如果传过来为空那么就是空字符串
  strDate = strDate + '';
  if (strDate.length === 10) strDate = strDate + '000';
  let date = new Date(Number(strDate));
  return date.getFullYear() + "-" + (formatDateTimeToDouble(date.getMonth() + 1)) + "-" + formatDateTimeToDouble(date.getDate())
    + " " + formatDateTimeToDouble(date.getHours()) + ":" + formatDateTimeToDouble(date.getMinutes()) + ":"
    + formatDateTimeToDouble(date.getSeconds());
};

function formatDateTimeToDouble(s) {
  return s < 10 ? '0' + s : s;
}

/**
 * 格式化数字
 * @param num
 * @returns {string}
 */

common.formatNumber = function (num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};

/**
 * 去除小数点啥的如果是空的，就返回 ''
 * @param number
 * @returns {string}
 */

common.formatInputNumber = function (number) {
  if (this.isNull(number) || number === '' || !this.isPositiveInteger(number)) {
    return '';
  } else {
    let n = parseInt(number);
    if (this.isNull(n)) return '';
    return n + '';
  }
};

/**
 * 格式化时间戳
 * @param diffTime
 */

common.formatDiffDate = function (diffTime) {
  let date = {
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  };
  if (diffTime <= 0) {
    return date;
  }
  if (!this.isNull(diffTime)) {
    date.day = Math.floor(diffTime / 86400);
    date.hour = Math.floor(diffTime % 86400 / 3600);
    date.minute = Math.floor(diffTime % 86400 % 3600 / 60);
    date.second = Math.floor(diffTime % 86400 % 3600 % 60);
  }
  return date;
};

/**
 * 截字符串
 * @param str
 * @param len
 * @returns {*}
 */

common.cutString = function (str, len) {
  //length属性读出来的汉字长度为1
  if (str.length * 2 <= len) {
    return str;
  }
  let strlen = 0;
  let s = "";
  for (let i = 0; i < str.length; i++) {
    s = s + str.charAt(i);
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2;
      if (strlen >= len) {
        return s.substring(0, s.length - 1) + "...";
      }
    } else {
      strlen = strlen + 1;
      if (strlen >= len) {
        return s.substring(0, s.length - 2) + "...";
      }
    }
  }
  return s;
};

/**
 * 是否为正整数
 * @param s
 * @returns {boolean}
 */

common.isPositiveInteger = function (s) {
  let re = /^[0-9]+$/;
  return re.test(s)
};

/**
 * 判断是不是手机号
 * @param s
 * @returns {boolean}
 */

common.isMobilePhone = function (s) {
  let re = /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  return re.test(s);
};

/**
 * 深拷贝
 * @param obj
 * @returns {*}
 */

export let cloneObj = function (obj) {
  let str, newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (window.JSON) {
    str = JSON.stringify(obj); //系列化对象
    newobj = JSON.parse(str); //还原
  } else {
    for (let i in obj) {
      newobj[i] = typeof obj[i] === 'object' ?
        cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
};

export default common;
