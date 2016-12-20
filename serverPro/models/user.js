const mongo = require('./../config/mongo');

const User = mongo.model('User', {
  number: { type: String },  // 学号
  password: { type: String },  // 教务系统密码
  passwordLib: { type: String },  // 图书馆密码
  phone: { type: Object }, // 电话号码
  wechat: { type: Object }, // 微信号码
  email: { type: Object }, // 邮箱
  qq: { type: Object }, // QQ 号码
  introduction: { type: Object }, // 个人简介
  project: { type: Array }, // 项目经历
  avatar: { type: 'string' }, // 头像
  datetime: { type: 'number' },  // 注册时间
  updatetime: { type: 'number' },  // 最近更新个人信息时间
  lastLoginTime: { type: 'number' },  // 最近登录时间
});


module.exports = User;
