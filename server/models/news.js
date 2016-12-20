const mongo = require('./../config/mongo');

const News = mongo.model('News', {
  user: { type: Object }, // 发布者姓名
  title: { type: 'string' },  // 标题
  introduction: { type: 'string' },  // 活动简介
  teamInfo: { type: 'string' },  // 团队现况
  requirement: { type: 'string' }, // 队员要求
  type: { type: 'string' }, // 类型
  deadline: { type: 'number' }, // 截止日期
  datetime: { type: 'number' },  // 发布时间
  joinedUsers: { type: Array }, // 加入该活动的用户 id
  updatetime: { type: 'number' }, // 更新时间
});


module.exports = News;
