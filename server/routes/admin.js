const express = require('express');
// const UserModel = require('./../models/user');
const ReleaseModel = require('./../models/releaseAdmin');
// const login = require('./../crawler/fetch/loginZhjw');
// const fetchUserInfo = require('./../crawler/fetch/userInfo');
// const analyseUserInfo = require('./../crawler/analyse/userInfo');
const log4js = require('./../config/log4js');
// const checkNotLogin = require('./../middlewares/check').checkNotLogin;

const logger = log4js.getLogger('/routes/admin');
const router = new express.Router();


/**
 * 所有活动
 */
router.get('/release', (req, res) => {
  ReleaseModel.find({})
    .sort({ datetime: -1 })
    .exec()
    .then((result) => {
      logger.debug('result: ', result);
      return res.json({
        code: 0,
        data: {
          release: result,
        },
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '所有活动失败',
        });
      });
});


/**
 * 删除活动
 */
router.delete('/release/delete', (req, res) => {
  const id = req.query.id;
  logger.debug('id: ', id);
  ReleaseModel.remove({ _id: id }, 1).exec()
    .then((result) => {
      logger.debug('result: ', result);
      if (result.length === 0) {
        return Promise.reject('活动不存在');
      }
      return res.json({
        code: 0,
        data: {
          release: result[0],
        },
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '删除活动失败',
        });
      });
});


module.exports = router;
