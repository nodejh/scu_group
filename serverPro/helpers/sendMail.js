const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const configMail = require('./../config/config').mail;

// 开启一个 SMTP 连接池
const transport = nodemailer.createTransport(smtpTransport(configMail));

// 设置邮件内容 example
// const amailOptions = {
//   from: '四川大学组队平台<scu0822@163.com>', // 发件地址
//   to: '571963318@qq.com', // 收件列表
//   subject: '四川大学组队平台邮箱验证', // 标题
//   html: '<b>您好，为了让平台中的同学更好地联系到您，请点击链接进行邮箱验证。</b> ', // html 内容
// };


/**
 * 发送邮件
 * @param  {object} mailOptions 邮件信息
 * @return {Promise}             发送结果
 */
function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    // 发送邮件
    transport.sendMail(mailOptions, (error, response) => {
      if (error) {
        // console.error(error);
        reject(error);
      } else {
        // console.log(response);
        resolve(response);
      }
      transport.close(); // 如果没用，关闭连接池
    });
  });
}

// sendMail(amailOptions)
// .then((r) => console.log(r))
// .catch((e) => console.log(e));

module.exports = sendMail;
