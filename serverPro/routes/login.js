const express = require('express');
const UsersModel = require('./../models/users');
const login = require('./../crawler/fetch/loginZhjw');
const loginPostgraduate = require('./../crawler/fetch/loginZhjwPostgraduate');
const fetchUserInfo = require('./../crawler/fetch/userInfo');
const fetchUserInfoPostgraduate = require('./../crawler/fetch/userInfoPostgraduate');
const analyseUserInfo = require('./../crawler/analyse/userInfo');
const analyseUserInfoPostgraduate = require('./../crawler/analyse/userInfoPostgraduate');
const log4js = require('./../config/log4js');
const checkNotLogin = require('./../middlewares/check').checkNotLogin;
const getRandomAvatar = require('./../helpers/getRandomAvatar');

const logger = log4js.getLogger('/routes/login');
const router = new express.Router();


/**
 * 判断是否登录
 */
router.get('/is_login', (req, res) => {
  const data = {
    isLogin: false,
  };
  if (req.session.user) {
    data.isLogin = true;
  }
  logger.debug(data);
  res.json({ code: 0, data });
});


/**
 * 登陆教务系统(本科生)
 * 1. 判断数据库中是否已经存在该用户
 * 2.1 如果存在，则对比密码
 * 2.2 如果不存在，则模拟登录教务系统
 * 2.2.1 然后将数据存入数据库
 *
 */
router.post('/login', checkNotLogin, (req, res) => {
  const number = req.body.number;
  const password = req.body.password;
  const openid = req.session.openid ? req.session.openid : '';
  logger.debug('openid: ', req.session.openid);
  logger.debug('number && password\n', number, password);
  // 学号和密码校验
  if (!/^\d+$/.test(number)) {
    return res.json({
      code: 1001,
      message: '教务系统账号格式错误',
    });
  }
  if (!password) {
    return res.json({
      code: 1002,
      message: '教务系统密码格式错误',
    });
  }
  // 判断数据库中是否已经存在该用户
  UsersModel.find({ number })
    .exec()
    .then((result) => {
      logger.debug('userinfo: ', result);
      if (result.length === 0) {
        // 用户不存在，模拟登录教务系统
        return login(number, password);
      }
      // 判断密码是否正确
      if (password === result[0].password) {
        return Promise.resolve({ stop: true, userinfo: result[0] });
      }
      // 数据库中的密码不正确
      // 模拟登录教务系统
      return login(number, password);
    })
    .then((result) => {
      // 模拟登录
      logger.debug('模拟登录...');
      if (result.stop) {
        // 伪停止 Promise
        logger.debug('伪停止 Promise...');
        return Promise.resolve(result);
      }
      logger.debug('cookie: ', result);
      // 获取教务系统中的用户信息
      return fetchUserInfo(result);
    })
    .then((result) => {
      // 获取教务系统中的用户信息
      logger.debug('获取教务系统中的用户信息...');
      if (result.stop) {
        // 伪停止 Promise
        logger.debug('伪停止 Promise...');
        return Promise.resolve(result);
      }
      const analyseRes = analyseUserInfo(result);
      if (analyseRes.error) {
        return Promise.reject({
          code: 1,
          message: '获取用户个人信息失败',
        });
      }
      const userinfo = analyseRes.userInfo;
      logger.debug('userinfo: ', userinfo);
      // const data = Object.assign(userinfo, user);
      const data = {
        number,  // 学号
        password,  // 教务系统密码
        openid,
        passwordLib: '',  // 图书馆密码
        name: { show: true, value: userinfo.name }, // 姓名
        studentID: { show: true, value: number }, // 学号
        gender: { show: true, value: userinfo.gender }, // 性别
        type: { show: true, value: userinfo.type }, // 学生类别: 本科
        state: { show: false, value: userinfo.state }, // 学籍状态: 在校
        college: { show: true, value: userinfo.college }, // 学院
        major: { show: true, value: userinfo.major }, // 专业
        grade: { show: true, value: userinfo.grade }, // 年级
        researchDirection: { show: true, value: '' }, // 研究方向
        phone: { show: false, value: '', isValidated: false }, // 电话号码
        wechat: { show: false, value: '' }, // 微信号码
        email: { show: false, value: '', isValidated: false }, // 邮箱
        qq: { show: false, value: '' }, // QQ 号码
        introduction: { show: true, value: '' }, // 个人简介
        projects: { show: true, value: '' }, // 项目经历
        avatar: getRandomAvatar(), // 头像
        datetime: new Date().getTime(),  // 注册时间
        updatetime: new Date().getTime(),  // 最近更新个人信息时间
        lastLoginTime: new Date().getTime(),  // 最近登录时间
      };
      logger.debug('insert data: ', data);
      return UsersModel.update({ number }, { $set: data }, { upsert: true }).exec();
    })
    .then((result) => {
      // 插入数据用户信息到数据库
      logger.debug('插入数据用户信息到数据库...');
      if (result.stop) {
        // 伪停止 Promise
        logger.debug('伪停止 Promise...');
        return Promise.resolve(result);
      }
      logger.debug('insert result: ', result);
      if (result.result && result.result.ok === 1) {
        // 插入成功，查询用户信息
        // 不用 _id 查询，因为会出错
        // 插入返回值有所不同，造成异常
        return UsersModel.find({ number }).exec();
      }
      return Promise.reject({ code: 1004, message: '存储用户信息失败' });
    })
    .then((result) => {
      // 存储用户信息后，查询用户信息
      logger.debug('存储用户信息后，查询用户信息...');
      if (result.stop) {
        // 伪停止 Promise
        logger.debug('伪停止 Promise...');
        return Promise.resolve(result);
      }
      if (result.length === 0) {
        // 查询失败
        logger.error('查询用户信息失败');
        return Promise.reject({ code: 1, message: '查询用户信息失败' });
      }
      return Promise.resolve({ stop: true, userinfo: result[0] });
    })
    .then((result) => {
      logger.debug('res.json...');
      logger.debug('userinfo: ', result);
      const userinfo = result.userinfo;
      delete userinfo.password;
      delete userinfo.passwordLib;
      // 设置session，用户登录成功
      req.session.user = userinfo;
      const obj = {
        code: 0,
        data: { userinfo },
      };
      return res.json(obj);
    })
    .catch((e) => {
      logger.error('e: ', e);
      // 对错误消息进行兼容处理
      // 因为有的地方 reject 传入的是 error 属性
      const message = e.message ? e.message : e.error;
      const obj = {
        code: e.code,
        message,
      };
      return res.json(obj);
    });
});


/**
 * 登陆教务系统(研究生)
 * 1. 判断数据库中是否已经存在该用户
 * 2.1 如果存在，则对比密码
 * 2.2 如果不存在，则模拟登录教务系统
 * 2.2.1 然后将数据存入数据库
 *
 */
router.post('/login_postgraduate', checkNotLogin, (req, res) => {
  const number = req.body.number;
  const password = req.body.password;
  const openid = req.session.openid ? req.session.openid : '';
  logger.debug('number && password\n', number, password);
  // 学号和密码校验
  if (!/^\d+$/.test(number)) {
    return res.json({
      code: 1001,
      message: '校园信息门户用户名格式错误',
    });
  }
  if (!password) {
    return res.json({
      code: 1002,
      message: '校园信息门户密码格式错误',
    });
  }
  // 判断数据库中是否已经存在该用户
  UsersModel.find({ number })
    .exec()
    .then((result) => {
      logger.debug('userinfo: ', result);
      if (result.length === 0) {
        // 用户不存在，模拟登录教务系统
        return loginPostgraduate(number, password);
      }
      // 判断密码是否正确
      if (password === result[0].password) {
        return Promise.resolve({ stop: true, userinfo: result[0] });
      }
      // 数据库中的密码不正确
      // 模拟登录教务系统
      return loginPostgraduate(number, password);
    })
    .then((result) => {
      // 模拟登录
      logger.debug('模拟登录...');
      if (result.stop) {
        // 伪停止 Promise
        logger.debug('伪停止 Promise...');
        return Promise.resolve(result);
      }
      logger.debug('cookie: ', result);
      // 获取教务系统中的用户信息
      return fetchUserInfoPostgraduate(result);
    })
    .then((result) => {
      // 获取教务系统中的用户信息
      logger.debug('获取校园信息门户中的用户信息...');
      if (result.stop) {
        // 伪停止 Promise
        logger.debug('伪停止 Promise...');
        return Promise.resolve(result);
      }
      const analyseRes = analyseUserInfoPostgraduate(result);
      if (analyseRes.error) {
        return Promise.reject({
          code: 1,
          message: '获取用户个人信息失败',
        });
      }
      const userinfo = analyseRes.userInfo;
      logger.debug('userinfo: ', userinfo);
      // const data = Object.assign(userinfo, user);
      const data = {
        number,  // 学号
        password,  // 教务系统密码
        openid,
        passwordLib: '',  // 图书馆密码
        name: { show: true, value: userinfo.name }, // 姓名
        studentID: { show: true, value: number }, // 学号
        gender: { show: true, value: '' }, // 性别
        type: { show: true, value: '研究生' }, // 学生类别: 研究生
        state: { show: false, value: '' }, // 学籍状态: 在校
        college: { show: true, value: userinfo.college }, // 学院
        major: { show: true, value: userinfo.major }, // 专业
        grade: { show: true, value: '' }, // 年级
        researchDirection: { show: true, value: userinfo.researchDirection }, // 研究方向
        phone: { show: false, value: '', isValidated: false }, // 电话号码
        wechat: { show: false, value: '' }, // 微信号码
        email: { show: false, value: '', isValidated: false }, // 邮箱
        qq: { show: false, value: '' }, // QQ 号码
        introduction: { show: true, value: '' }, // 个人简介
        projects: { show: true, value: '' }, // 项目经历
        avatar: getRandomAvatar(), // 头像
        datetime: new Date().getTime(),  // 注册时间
        updatetime: new Date().getTime(),  // 最近更新个人信息时间
        lastLoginTime: new Date().getTime(),  // 最近登录时间
      };
      logger.debug('insert data: ', data);
      return UsersModel.update({ number }, { $set: data }, { upsert: true }).exec();
    })
    .then((result) => {
      // 插入数据用户信息到数据库
      logger.debug('插入数据用户信息到数据库...');
      if (result.stop) {
        // 伪停止 Promise
        logger.debug('伪停止 Promise...');
        return Promise.resolve(result);
      }
      logger.debug('insert result: ', result);
      if (result.result && result.result.ok === 1) {
        // 插入成功，查询用户信息
        // 不用 _id 查询，因为会出错
        // 插入返回值有所不同，造成异常
        return UsersModel.find({ number }).exec();
      }
      return Promise.reject({ code: 1004, message: '存储用户信息失败' });
    })
    .then((result) => {
      // 存储用户信息后，查询用户信息
      logger.debug('存储用户信息后，查询用户信息...');
      if (result.stop) {
        // 伪停止 Promise
        logger.debug('伪停止 Promise...');
        return Promise.resolve(result);
      }
      if (result.length === 0) {
        // 查询失败
        logger.error('查询用户信息失败');
        return Promise.reject({ code: 1, message: '查询用户信息失败' });
      }
      return Promise.resolve({ stop: true, userinfo: result[0] });
    })
    .then((result) => {
      logger.debug('res.json...');
      logger.debug('userinfo: ', result);
      const userinfo = result.userinfo;
      delete userinfo.password;
      delete userinfo.passwordLib;
      // 设置session，用户登录成功
      req.session.user = userinfo;
      const obj = {
        code: 0,
        data: { userinfo },
      };
      return res.json(obj);
    })
    .catch((e) => {
      logger.error('e: ', e);
      // 对错误消息进行兼容处理
      // 因为有的地方 reject 传入的是 error 属性
      const message = e.message ? e.message : e.error;
      const obj = {
        code: e.code,
        message,
      };
      return res.json(obj);
    });
});


/**
 * 退出登录
 */
router.get('/logout', (req, res) => {
  logger.debug('logout...');
  req.session.destroy();
  return res.json({
    code: 0,
    data: {},
  });
});


module.exports = router;
