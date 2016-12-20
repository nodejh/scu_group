const wechat = require('wechat');
const API = require('wechat-api');
const log4js = require('./../config/log4js');
const wechatConfig = require('../config/wechat');
const menu = require('../config/menu');
const wechatMessage = require('../config/wechatMessage');
const getExamination = require('./../models/examination');


const logger = log4js.getLogger('/routes/wechat');


// 微信的配置
const config = {
  token: wechatConfig.token,
  appid: wechatConfig.appid,
  encodingAESKey: wechatConfig.encodingAESKey,
};

// 用户关注微信的统一的回复消息
const replyMessage = wechatMessage.welcome;

// 菜单
const api = new API(wechatConfig.appid, wechatConfig.appSecret);
api.getAccessToken((err, token) => {
  logger.debug(err);
  logger.debug(token);
});

logger.debug(JSON.stringify(menu));
// 创建微信菜单
api.createMenu(JSON.stringify(menu), (err, result) => {
  logger.debug('创建微信菜单:', result);
  logger.debug('menu: ', menu);
});


const we = wechat(config)
.text((message, req, res) => {
  logger.debug('text');
  logger.debug(message);
  logger.debug(message.Content.indexOf('考表'));
  if (message.Content.indexOf('考表') !== -1) {
    const openid = message.FromUserName;
    // 查询考表，并返回
    getExamination(openid)
    .then((result) => {
      const examination = result.examination;
      logger.debug('result: ', result);
      let data = '';
      if (examination.length === 0) {
        data = '您没有考试安排';
      } else {
        data = `共有 ${examination.length} 门考试`;
        data += '\n\n\n';
        examination.forEach((item) => {
          data += `${item.date} ${item.time} ${item.class} ${item.campus}${item.teachingBuilding}`;
          data += '\n\n';
        });
      }
      res.reply(data);
    })
    .catch((e) => {
      const reply = e.message;
      res.reply(reply);
    });
  } else {
    res.reply('您可以回复“考表”查看考试安排');
  }
})
.image((message, req, res) => {
  logger.debug('image');
  logger.debug(message);
  res.reply(replyMessage);
})
.voice((message, req, res) => {
  logger.debug('voice');
  logger.debug(message);
  res.reply(replyMessage);
})
.video((message, req, res) => {
  logger.debug('video');
  logger.debug(message);
  res.reply(replyMessage);
})
.location((message, req, res) => {
  logger.debug('location');
  logger.debug(message);
  res.reply(replyMessage);
})
.link((message, req, res) => {
  logger.debug('link');
  logger.debug(message);
  res.reply(replyMessage);
})
.event((message, req, res) => {
  logger.debug('event');
  logger.debug(message);
  switch (message.Event) {
    case 'subscribe':
      logger.debug('用户关注微信号,用户的openid:===', message.FromUserName);
      res.reply(replyMessage.welcome);
      break;
    case 'unsubscribe':
      logger.debug('用户取消关注微信号===', message.FromUserName);
      break;
    case 'CLICK':
      logger.debug('点击事件===', message.FromUserName);
      if (message.EventKey === 'examination') {
        // 考表查询
        const openid = message.FromUserName;
        // 查询考表，并返回
        getExamination(openid)
        .then((result) => {
          const examination = result.examination;
          logger.debug('result: ', result);
          let data = `共有 ${examination.length} 门考试`;
          data += '\n\n\n';
          examination.forEach((item) => {
            data += `${item.date} ${item.time} ${item.class} ${item.campus}${item.teachingBuilding}`;
            data += '\n\n';
          });
          res.reply(data);
        })
        .catch((e) => {
          const reply = e.message;
          res.reply(reply);
        });
      } else {
        res.reply('点击“考表查询”查询考试安排');
      }
      break;
    default:
      res.reply(replyMessage.welcome);
  }
})
.device_text((message, req, res) => {
  logger.debug('device_text');
  logger.debug(message);
  res.reply(replyMessage.welcome);
})
.device_event((message, req, res) => {
  logger.debug('device_event');
  logger.debug(message);
  res.reply(replyMessage.welcome);
})
.middlewarify();


module.exports = we;
