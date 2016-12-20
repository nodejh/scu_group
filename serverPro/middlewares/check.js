const log4js = require('./../config/log4js');


const logger = log4js.getLogger('/middlewares/check');


module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.user) {
      logger.debug('未登录');
      return res.json({
        code: 1000,
        message: '未登录',
      });
    }
    next();
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      logger.debug('已登录');
      return res.json({
        code: 1001,
        message: '已登录',
      });
    }
    next();
  },
};
