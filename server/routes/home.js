const express = require('express');
const UsersModel = require('./../models/users');
// const UserModel = require('./../models/user');
// const NewsModel = require('./../models/news');
// const login = require('./../crawler/fetch/loginZhjw');
// const fetchUserInfo = require('./../crawler/fetch/userInfo');
// const analyseUserInfo = require('./../crawler/analyse/userInfo');
const log4js = require('./../config/log4js');
// const checkNotLogin = require('./../middlewares/check').checkNotLogin;

const logger = log4js.getLogger('/routes/home');
const router = new express.Router();


/**
 * 首页
 */
router.get('/', (req, res) => {
  logger.debug('home...');
  logger.debug('req.session.openid: ', req.session.openid);
  res.render('index', { title: '四川大学组队平台' });
});


router.get('/wechat', (req, res) => {
  const openid = req.query.openid;
  logger.debug('openid: ', openid);
  UsersModel.find({ openid })
    .exec()
    .then((result) => {
      logger.debug('result: ', result);
      if (result.length === 0) {
        req.session.openid = openid;
        // return res.render('index');
        logger.debug('req.session.openid: ', req.session.openid);
        return res.redirect('/');
      }
      const userinfo = result[0];
      logger.debug('userinfo: ', userinfo);
      delete userinfo.password;
      delete userinfo.passwordLib;
      // 设置session，用户登录成功
      req.session.user = userinfo;
      // res.render('index');
      return res.redirect('/');
    })
    .catch((e) => {
      logger.error('wechat e: ', e);
      // return res.render('index');
      return res.redirect('/');
    });
});


module.exports = router;
