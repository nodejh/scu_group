const express = require('express');
const OAuth = require('wechat-oauth');
const config = require('../config/config');
const wechatConfig = require('../config/wechat');
const log4js = require('./../config/log4js');

const client = new OAuth(wechatConfig.appid, wechatConfig.appSecret);
const logger = log4js.getLogger('/routes/index');
const router = new express.Router();


/**
 * 处理微信端的请求
 * @type {String}
 */
router.get('/', (req, res) => {
  // logger.debug('req: ', req);
  const code = req.query.code;
  const state = req.query.state;
  logger.debug('code: ', code);
  logger.debug('state: ', state);
  if (code === undefined) {
    logger.error('no code');
    return res.json({ code: 0 });
  }

  client.getAccessToken(code, (err, result) => {
    if (err) {
      logger.error('获取openid失败:', err);
      return res.json({ code: 1001, error: JSON.stringify(err) });
    }

    const openid = result.data.openid;
    // return res.json({ code: 0, openid });
    res.redirect(301, `${config.redirectUrl}/wechat?openid=${openid}`);
  });
});


module.exports = router;
