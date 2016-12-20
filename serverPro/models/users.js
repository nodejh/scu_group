const mongo = require('./../config/mongo');

const Users = mongo.model('Users', {
  number: { type: String },  // 学号
  openid: { type: String }, // openid
  studentID: { type: Object }, // 学号，用于展示
  password: { type: String },  // 教务系统密码
  passwordLib: { type: String },  // 图书馆密码
  name: { type: Object }, // 姓名
  gender: { type: Object }, // 性别
  type: { type: Object }, // 学生类别: 本科
  state: { type: Object }, // 学籍状态: 在校
  college: { type: Object }, // 学院
  major: { type: Object }, // 专业
  grade: { type: Object }, // 年级
  researchDirection: { type: Object }, // 研究方向
  phone: { type: Object }, // 电话号码
  wechat: { type: Object }, // 微信号码
  email: { type: Object }, // 邮箱
  qq: { type: Object }, // QQ 号码
  introduction: { type: Object }, // 个人简介
  projects: { type: Object }, // 项目经历
  avatar: { type: String }, // 头像
  datetime: { type: 'number' },  // 注册时间
  updatetime: { type: 'number' },  // 最近更新个人信息时间
  lastLoginTime: { type: 'number' },  // 最近登录时间
});


module.exports = Users;
