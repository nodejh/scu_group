// ============================
// 模拟登录信息门户服务
// ============================
const request = require('request');
const iconv = require('iconv-lite');
const config = require('./../../config/config');
const log4js = require('./../../config/log4js');
const website = require('./../../config/website').my;


const logger = log4js.getLogger('/crawler/fetch/zhjw');


/**
 * 模拟登陆信息门户服务
 * @method login
 * @param  {string}   number   学号
 * @param  {string}   password 密码
 * @param  {Function} callback 登录成功后的回调函数
 * @return {promise}           错误信息或cookie
 */
function login(number, password) {
  logger.debug('number && password\n', number, password);
  return new Promise((resolve, reject) => {
    // 模拟登陆信息门户服务
    const options = {
      url: website.url.login,
      encoding: null,
      form: {
        'Login.Token1': number,
        'Login.Token2': password,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': config.crawler['User-Agent'],
      },
      method: 'POST',
    };
    logger.debug('url: ', options.url);
    request(options, (error, response, body) => {
      if (error) {
        logger.error('error ', error);
        reject({
          code: 1003,
          error: '模拟登陆信息门户服务失败',
          detail: error,
        });
      }
      if (response.statusCode !== 200) {
        logger.error('error response: ', response);
        reject({
          code: 1043,
          error: '模拟登陆信息门户服务失败，响应头状态码不是200',
          detail: response,
        });
      }
      const content = iconv.decode(body, 'utf8');
      // const content = body;
      logger.debug('body: ', body);
      logger.debug('content: ', content);
      if (content.indexOf(website.successText.account) !== -1) {
        const cookie = response.headers['set-cookie'].join();
        resolve(cookie);
      } else if (content.indexOf(website.errorText.account) !== -1) {
        reject({ code: 1006, error: '用户不存在或密码错误' });
      } else {
        reject({ code: 1007, error: '登录失败，请重试' });
      }
    });
  });
}

module.exports = login;
