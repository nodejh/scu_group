const mongo = require('./../config/mongo');

const ValidationEmails = mongo.model('ValidationEmails', {
  userid: { type: 'string' }, // 用户 id
  uuid: { type: 'string' }, // 发给用户用于验证的唯一字符串
  email: { type: 'string' }, // 用户的邮箱,
  datetime: { type: 'number' }, // 发送时间戳
  // 是否通过验证，验证成功后，将其改为 true，同时也需要将user表email改为true
  isValidated: { type: Boolean },
  validationTime: { type: 'number' }, // 验证时间
  fromMail: { type: 'string' }, // 发送邮件的邮箱
  content: { type: 'string' }, // 发送的内容
  url: { type: 'string' }, // 用户验证的 url
});


module.exports = ValidationEmails;
