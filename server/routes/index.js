const express = require('express');
const ValidationEmailsModel = require('./../models/validationEmails');
const NewsModel = require('./../models/news');
const UsersModel = require('./../models/users');
// const login = require('./../crawler/fetch/loginZhjw');
// const fetchUserInfo = require('./../crawler/fetch/userInfo');
// const analyseUserInfo = require('./../crawler/analyse/userInfo');
const log4js = require('./../config/log4js');
// const checkNotLogin = require('./../middlewares/check').checkNotLogin;

const logger = log4js.getLogger('/routes/index');
const router = new express.Router();


// /**
//  * 首页
//  */
// router.get('/', (req, res) => {
//   res.render('index', { title: '四川大学组队平台' });
// });


/**
 * 所有活动
 */
router.get('/news', (req, res) => {
  NewsModel.find({})
    .sort({ datetime: -1 })
    .exec()
    .then((result) => {
      logger.debug('result: ', result);
      return res.json({
        code: 0,
        data: {
          news: result,
        },
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '查询所有活动失败',
        });
      });
});


/**
 * 邮箱验证
 *  http://localhost:3001/api/validate/email/52d10d95-427a-46c0-9ac5-2e782562d817
 */
router.get('/validate/email/:uuid', (req, res) => {
  const uuid = req.params.uuid;
  ValidationEmailsModel.find({ uuid })
    .exec()
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({
          code: 10,
          message: '不存在该验证码',
        });
      }
      logger.debug('result: ', result);
      // const time = 24 * 60 * 60 * 1000;
      const time = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();
      // 判断是否已经验证或过期
      if (result[0].isValidated) {
        return Promise.reject({
          code: 10,
          message: '该链接已经验证过',
        });
      }
      logger.debug('now - result[0].datetime: ', now - result[0].datetime);
      if (now - result[0].datetime > time) {
        return Promise.reject({
          code: 10,
          message: '链接已经过期，请重试',
        });
      }

      const userid = result[0].userid;
      logger.debug('查询用户信息');
      return UsersModel.find({ _id: userid }).exec();
    })
    .then((result) => {
      logger.debug('result: ', result);
      if (result.length === 0) {
        return Promise.reject({
          code: 0,
          message: '不存在该用户',
        });
      }
      const _id = result[0]._id;
      const data = result[0].email;
      data.isValidated = true;
      // ({ _id: ObjectId("5832d904b714dd54de52a4c4") }, { $set: {"email.isValidated": true }})
      // 将用户信息中邮箱验证值设置为true
      logger.debug('将用户信息中邮箱验证值设置为true');
      return UsersModel.update({ _id }, { $set: { email: data } })
        .exec();
    })
    .then((result) => {
      logger.debug('result: ', result);
      logger.debug('将验ValidationEmails中isValidated设置为true');
      // 将验ValidationEmails中isValidated设置为true
      // update({uuid: 'd8c6155b-488a-44a4-8d39-114cc5ce68a3'}, { $set: {isValidated: true} })
      return ValidationEmailsModel
        .update({ uuid }, { $set: { isValidated: true, validationTime: new Date().getTime() } })
        .exec();
    })
    .then((result) => {
      logger.debug('result: ', result);
      // 如果已经登录，则将该用户的 session 中邮箱验证改为 true
      if (req.session.user) {
        req.session.user.email.isValidated = true;
        return res.json({
          code: 0,
          message: '邮箱验证成功！',
        });
      }
      return res.json({
        code: 0,
        message: '邮箱验证成功，请退出登录后重新登录进入网站！',
      });
    })
    .catch((e) => {
      res.json({
        code: 1,
        message: '邮箱验证失败，请重试！',
        e,
      });
    });
});


module.exports = router;
