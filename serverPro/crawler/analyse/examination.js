// 解析考表页面
const cheerio = require('cheerio');
const log4js = require('./../../config/log4js');
const zhjwSpecialText = require('./zhjwSpecialText');

const logger = log4js.getLogger('/models/parse/examination');


const analyseUserInfo = (html) => {
  // logger.debug('html: ', html);
  const errSpecialText = zhjwSpecialText(html);
  logger.debug('errSpecialText: ', errSpecialText);
  if (errSpecialText) {
    return {
      error: errSpecialText,
    };
  }
  const $ = cheerio.load(html, {
    ignoreWhitespace: true,
    xmlMode: false,
    lowerCaseTags: false,
  });
  const userInfoTable = $('body').find('#user').eq(1).find('tr');
  logger.debug('userInfoTable.length: ', userInfoTable.length);
  const examination = [];
  userInfoTable.each((index, item) => {
    logger.debug('index, item', index);
    if (index > 0) {
      const examinationItem = {
        campus: $(item).find('td').eq(1)
            .text()
            .replace(/\s+/g, ''), // 校区
        teachingBuilding: $(item).find('td').eq(2)
            .text()
            .replace(/\s+/g, ''), // 教学楼
        classroom: $(item).find('td').eq(3)
            .text()
            .replace(/\s+/g, ''), // 教室
        class: $(item).find('td').eq(4)
            .text()
            .replace(/\s+/g, ''), // 课程
        weekNumber: $(item).find('td').eq(5)
            .text()
            .replace(/\s+/g, ''), // 考试周次
        week: $(item).find('td').eq(6)
            .text()
            .replace(/\s+/g, ''), // 考试星期
        date: $(item).find('td').eq(7)
            .text()
            .replace(/\s+/g, ''), // 考试日期
        time: $(item).find('td').eq(8)
            .text()
            .replace(/\s+/g, ''), // 考试时间
        seatNumber: $(item).find('td').eq(9)
            .text()
            .replace(/\s+/g, ''), // 座位号
      };
      examination.push(examinationItem);
      logger.debug('examinationItem', examinationItem);
    }
  });
  logger.debug('fetch: ', { examination });
  return {
    error: null,
    examination,
  };
};


module.exports = analyseUserInfo;
