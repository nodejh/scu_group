// 处理微信端的请求，返回考表等信息
const express = require('express');
const UsersModel = require('./../models/users');
const login = require('./../crawler/fetch/loginZhjw');
const fetchExamination = require('./../crawler/fetch/examination');
const analyseExamination = require('./../crawler/analyse/examination');
const log4js = require('./../config/log4js');


const logger = log4js.getLogger('/routes/wechat');
const router = new express.Router();


router.get('/examination', (req, res) => {
  const openid = req.query.openid;
  logger.debug('openid: ', openid);
  UsersModel.find({ openid })
    .exec()
    .then((result) => {
      logger.debug('result 根据openid查询userinfo的结果: ', result);
      if (result.length === 0) {
        req.session.openid = openid;
        // return res.render('index');
        logger.debug('req.session.openid: ', req.session.openid);
        // return res.redirect('/');
        // return res.json({
        //   code: 2000,
        //   message: '请先进入组队平台绑定教务系统账号后再查看考表～',
        // });
        return Promise.reject({
          notRealPromiseException: true,
          info: {
            code: 2000,
            message: '请先进入组队平台绑定教务系统账号后再查看考表～',
          },
        });
      }
      // 用户存在，登录成功，且继续查看考表
      const userinfo = result[0];
      const data = {
        number: userinfo.number,
        password: userinfo.password,
      };
      logger.debug('userinfo: ', userinfo);
      delete userinfo.password;
      delete userinfo.passwordLib;
      // 设置session，用户登录成功
      req.session.user = userinfo;
      // res.render('index');
      // return res.redirect('/');
      return data;
    })
    .then((data) => {
      logger.debug('data 即将登录教务系统: ', data);
      return login(data.number, data.password);
    })
    .then((result) => {
      logger.debug('登录后的 cookie: ', result);
      // 获取教务系统中的用户信息
      return fetchExamination(result);
    })
    .then((html) => {
      const analyseRes = analyseExamination(html);
      if (analyseRes.error) {
        return Promise.reject({
          notRealPromiseException: true,
          info: {
            code: 2001,
            message: '获取考表失败，请重试',
          },
        });
      }
      const examination = analyseRes.examination;
      return res.json({
        code: 0,
        data: {
          examination,
        },
      });
    })
    .catch((e) => {
      logger.error('wechat e: ', e);
      if (e.notRealPromiseException) {
        return res.json(e.info);
      }
      return res.json({
        code: 2000,
        message: '请先进入组队平台绑定教务系统账号后再查看考表～',
      });
    });
});


module.exports = router;
