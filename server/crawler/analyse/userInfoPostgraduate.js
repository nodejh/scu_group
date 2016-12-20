// 解析信息门户服务个人信息页面
const cheerio = require('cheerio');
const log4js = require('./../../config/log4js');

const logger = log4js.getLogger('/models/parse/userInfoPostgraduate');


const analyseUserInfo = (html) => {
  // logger.debug('html: ', html);
  // logger.debug('html: ', html.indexOf('登录'));
  if (html.indexOf('退出登录') === -1) {
    return {
      error: '请登录后再获取个人信息',
    };
  }
  const $ = cheerio.load(html, {
    ignoreWhitespace: true,
    xmlMode: false,
    lowerCaseTags: false,
  });
  const userInfoTableTr = $('body').find('.portlet-table-down');
  const userInfo = {
    name: $(userInfoTableTr).find('td').eq(0)
      .text()
      .replace(/\s+/g, ''),
    college: $(userInfoTableTr).find('td').eq(1)
      .text()
      .replace(/\s+/g, ''), // 学院
    major: $(userInfoTableTr).find('td').eq(2)
      .text()
      .replace(/\s+/g, ''), // 专业
    researchDirection: $(userInfoTableTr).find('td').eq(3)
      .text()
      .replace(/\s+/g, ''), // 研究方向
  };
  logger.debug('userInfo: ', userInfo);
  return {
    error: null,
    userInfo,
  };
};


module.exports = analyseUserInfo;
