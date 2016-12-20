const http = require('http');
const config = require('./../config/config');
const log4js = require('./../config/log4js');


const logger = log4js.getLogger('/models/examiation');


const getExamination = (openid) => {
  logger.debug('根据openid获取考表');
  return new Promise((resolve, reject) => {
    http.get({
      host: config.host,
      path: `/wechat/examination?openid=${openid}`,
    }, (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        logger.debug('body: ', body);
        try {
          const parsed = JSON.parse(body);
          if (parsed.code === 0) {
            resolve(parsed.data);
          } else {
            reject({
              code: 100,
              message: parsed.message,
            });
          }
        } catch (e) {
          reject({
            code: 500,
            message: '服务器错误，请稍后重试',
            error: e,
          });
        }
      });
    });
  });
};


module.exports = getExamination;
