/* eslint-disable */
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

// 开启一个 SMTP 连接池
var transport = nodemailer.createTransport(smtpTransport({
  host: "smtp.qq.com", // 主机
  secure: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: "571963318@qq.com", // 账号
    pass: "Changewhoiwas712" // 密码
  }
}));

// 设置邮件内容
var mailOptions = {
  from: "四川大学组队平台<571963318@qq.com>", // 发件地址
  to: "3478795306@qq.com, 571963318@qq.com", // 收件列表
  subject: "四川大学组队平台邮箱验证", // 标题
  html: "<b>您好，为了让平台中的同学更好地联系到您，请点击链接进行邮箱验证。</b> " // html 内容
}

// 发送邮件
// transport.sendMail(mailOptions, function(error, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(response);
//   }
//   transport.close(); // 如果没用，关闭连接池
// });

function sendMail(mailOptions) {
  return new Promise(function(resolve, reject) {
    // 发送邮件
    transport.sendMail(mailOptions, function(error, response) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(response);
        resolve(response);
      }
      transport.close(); // 如果没用，关闭连接池
    });
  });
}
