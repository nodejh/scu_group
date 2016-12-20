const mongo = require('./../config/mongo');

const Release = mongo.model('release', {
  username: { type: 'string' },
  number: { type: 'string' },  // 发布者学号
  title: { type: 'string' },  // 标题
  introduction: { type: 'string' },  // 活动简介
  teamInfo: { type: 'string' },  // 团队现况
  requirement: { type: 'string' }, // 队员要求
  type: { type: 'string' }, // 类型
  deadline: { type: 'number' }, // 截止日期
  datetime: { type: 'number' },  // 发布时间
  // joined_users: { type: 'object' }, // 加入该活动的用户
  joined_users: { type: Array }, // 加入该活动的用户
  updatetime: { type: 'number' }, // 更新时间
});


module.exports = {
  insert(user) {
    return Release.insert(user).exec();
  },
  find(option) {
    return Release.find(option);
  },
  update(query, update, upsert, multi, writeConcern) {
    return Release.update(query, update, upsert, multi, writeConcern).exec();
  },
};
