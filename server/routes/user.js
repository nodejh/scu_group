const express = require('express');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const port = require('./../config/config.js').port;
const config = require('./../config/config');
const UsersModel = require('./../models/users');
const ValidationEmailsModel = require('./../models/validationEmails');
const NewsModel = require('./../models/news');
const checkLogin = require('./../middlewares/check').checkLogin;
const log4js = require('./../config/log4js');
const reduceDimension = require('./../helpers/Array').reduceDimension;
const sendMail = require('./../helpers/sendMail');
const controlUserinfo = require('./../helpers/ControlUserinfo');

const logger = log4js.getLogger('/routes/user');
const router = new express.Router();
// const imagePath = './../public/uploads/avatars/';


/**
 * 获取当前用户个人信息
 */
router.get('/userinfo', checkLogin, (req, res) => {
  const userinfo = req.session.user;
  return res.json({
    code: 0,
    data: { userinfo },
  });
});


/**
 * 更新姓名等可见性
 * 主要是更新某一项
 * 效率比更新全部更高
 */
router.put('/userinfo/update_one', checkLogin, (req, res) => {
  const data = req.body.data;
  const key = req.body.key;
  const number = req.session.user.number;
  logger.debug('data: ', data);
  UsersModel.update({ number }, { $set: data })
    .then((result) => {
      logger.debug('result: ', result);
      if (result.result && result.result.ok) {
        req.session.user[key] = data[key];
        return res.json({
          code: 0,
          message: '更新成功',
        });
      }
    })
    .catch((e) => {
      const obj = {
        code: 1,
        message: '更新失败',
        e,
      };
      return res.json(obj);
    });
});


/**
 * 更新用户信息
 * 主要是表单填写的信息
 * 一次性更新全部
 */
router.put('/userinfo/update', checkLogin, (req, res) => {
  const data = req.body.data;
  const number = req.session.user.number;
  const _id = req.session.user._id;
  logger.debug('data: ', data);
  UsersModel.update({ number }, { $set: data })
    .then((result) => {
      logger.debug('result: ', result);
      if (result.result && result.result.ok) {
        // 更新 session
        // eslint-disable-next-line
        for (let key in data) {
          // logger.debug('key: ', key);
          req.session.user[key] = data[key];
        }
        // 判断邮箱是否经过验证；如果没有，则发送邮件
        if (req.session.user.email && !req.session.user.email.isValidated) {
          // 发送邮件,同时将数据存入数据库
          const email = data.email.value;
          const uniqueId = uuid();
          const fromMail = config.mail.from;
          const url = `http://${req.host}:${port}/api/validate/email/${uniqueId}`;
          const content = `<p>您好，为了让平台中的同学更好地联系到您，
              <a href="${url}">请点击此处链接进行邮箱验证。</a>
              如果无法点击，请复制链接 <u>${url}</u> 然后通过浏览器打开。
            </p>`;
          logger.debug('req.host: ', req.host);
          const mailOptions = {
            from: `四川大学组队平台<${fromMail}>`, // 发件地址
            to: email, // 收件列表
            subject: '四川大学组队平台邮箱验证', // 标题
            html: content, // html 内容
          };
          const promiseSendMail = sendMail(mailOptions);
          // 将用户信息存入数据库
          const emailData = {
            userid: _id, // 用户 id
            uuid: uniqueId, // 发给用户用于验证的唯一字符串
            email, // 用户的邮箱,
            fromMail, // 发送邮件的邮箱
            content, // 发送的内容
            url, // 用户验证的 url
            datetime: new Date().getTime(), // 发送时间戳
            // 是否通过验证，验证成功后，将其改为 true，同时也需要将user表email改为true
            isValidated: false,
            validationTime: new Date().getTime(), // 验证时间
          };
          const promiseInsertValidationEmail = ValidationEmailsModel.insert(emailData).exec();
          return Promise.all([
            promiseSendMail,
            promiseInsertValidationEmail,
          ]);
        }
        // 已经通过验证
        return Promise.reject({ notRealException: true });
      }
      // 已经通过验证
      return Promise.reject('更新失败');
    })
    .then((result) => {
      logger.debug('邮件发送及数据存储结果：', result);
      return res.json({
        code: 0,
        message: '更新用户信息成功并发送验证邮件成功！',
        sendMail: true, // 已发送邮件。前端根据该值进行判断
      });
    })
    .catch((e) => {
      logger.debug('e: ', e);
      if (e.notRealException) {
        return res.json({
          code: 0,
          message: '更新用户信息成功',
        });
      }
      const obj = {
        code: 1,
        message: '更新用户信息失败',
        e,
      };
      return res.json(obj);
    });
});


/**
 * 发布活动
 */
router.post('/publish', checkLogin, (req, res) => {
  logger.debug('req.body: ', req.body);
  if (!req.session.user.email.isValidated) {
    return res.json({
      code: 1,
      message: '请在个人信息中填写上您的邮箱信息后再发布活动',
    });
  }
  const title = req.body.title; // 标题
  const introduction = req.body.introduction; // 活动简介
  const teamInfo = req.body.teamInfo; // 团队现况
  const requirement = req.body.requirement; // 队员要求
  const deadline = req.body.deadline; // 截止日期
  const type = req.body.type; // 类型
  const datetime = new Date().getTime();
  const updatetime = new Date().getTime();
  const user = req.session.user;
  if (!title || !introduction || !teamInfo || !requirement || !deadline || !type) {
    return res.json({
      code: 1,
      message: '请填完所有信息后再发布',
    });
  }
  const publishInfo = {
    user,
    title,
    introduction,
    teamInfo,
    requirement,
    deadline,
    type,
    datetime,
    updatetime,
    joinedUsers: [],
  };
  NewsModel.insert(publishInfo)
    .exec()
    .then((result) => {
      logger.debug('result: ', result);
      return res.json({
        code: 0,
        message: '发布成功',
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '发布失败',
        });
      });
});


/**
 * 当前用户发布的所有活动
 */
router.get('/news', checkLogin, (req, res) => {
  const id = req.session.user._id;
  NewsModel.find({ 'user._id': id })
    .sort({ datetime: -1 })
    .exec()
    .then((result) => {
      logger.debug('result: ', result);
      return res.json({
        code: 0,
        data: {
          news: result,
        },
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '获取当前用户发布的所有活动失败',
        });
      });
});


/**
 * 当前用户加入的所有活动
 */
router.get('/joined_list', checkLogin, (req, res) => {
  const _id = req.session.user._id;
  const userid = [_id];
  logger.debug('userid: ', userid);
  NewsModel.find({ joinedUsers: { $all: userid } })
    .sort({ datetime: -1 })
    .exec()
    .then((result) => {
      logger.debug('result: ', result);
      return res.json({
        code: 0,
        data: {
          news: result,
        },
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '获取当前用户发布的所有活动失败',
        });
      });
});


/**
 * 加入某个活动
 */
router.post('/join', checkLogin, (req, res) => {
  const userinfo = req.session.user;
  const userid = userinfo._id;
  const _id = req.body._id;
  NewsModel.find({ _id })
    .exec()
    .then((result) => {
      // logger.debug('result: ', result);
      if (result.length === 0) {
        return Promise.reject({
          code: 1,
          message: '没有该活动',
        });
      }
      if (userid === result[0].user._id) {
        return Promise.reject({
          code: 1,
          message: '不能加入自己发布的活动',
        });
      }
      const joinedUsers = reduceDimension(result[0].joinedUsers);
      // const joinedUsers = result[0].joinedUsers;
      logger.debug('joinedUsers: ', joinedUsers);
      if (joinedUsers.indexOf(userid) !== -1) {
        return Promise.reject({
          code: 1,
          message: '您已经加入过该活动',
        });
      }
      logger.debug('update userid: ', userid);
      const promiseJoin = NewsModel.update({ _id }, { $push: { joinedUsers: userid } }).exec();
      // return NewsModel.update({ _id: '5831b155eab570a2b405a21c' },
      // { $push: { joinedUsers: 'aaaaa' } }).exec();

      // 发送邮件
      const url = `http://${req.host}:${port}`;
      const fromMail = config.mail.from;
      const email = result[0].user.email.value;
      const userdata = controlUserinfo(userinfo);
      const content = `<div>您好，用户${userdata.name.value}加入到您的活动。
        <p>性别：${userdata.gender.value}</p>
        <p>学院：${userdata.college.value}</p>
        <p>专业：${userdata.major.value}</p>
        <p>年级：${userdata.grade.value}</p>
        <p>电话：${userdata.phone.value}</p>
        <p>邮箱：${userdata.email.value}</p>
        <p>QQ：${userdata.qq.value}</p>
        <p>wechat：${userdata.wechat.value}</p>
        <p>个人简介：${userdata.introduction.value}</p>
        <p>项目经历：${userdata.projects.value}</p>
        <p><a href="${url}">进入网站查看活动详情</a></p>
        </div>`;
      const mailOptions = {
        from: `四川大学组队平台<${fromMail}>`, // 发件地址
        to: email, // 收件列表
        subject: '有新同学加入您的活动-四川大学组队平台', // 标题
        html: content, // html 内容
      };
      // 发送邮件
      const promiseSendMail = sendMail(mailOptions);
      return Promise.all([
        promiseSendMail,
        promiseJoin,
      ]);
    })
    .then((result) => {
      logger.debug('result: ', JSON.stringify(result));
      return res.json({
        code: 0,
        message: '加入活动成功',
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json(error);
      });
});


/**
 * 根据 _id 查看用户详情
 */
router.get('/userinfo/:id', checkLogin, (req, res) => {
  const id = req.params.id;
  logger.debug('id: ', id);
  UsersModel.find({ _id: id })
    .then((result) => {
      logger.debug('user: ', result);
      if (result.length === 0) {
        return Promise.reject({
          code: 1,
          message: '用户不存在',
        });
      }
      const userinfo = controlUserinfo(result[0]);
      return res.json({
        code: 0,
        data: { userinfo },
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '获取用户信息失败',
        });
      });
});


/**
 * 根据 number 查看用户详情
 * TODO 删除
 */
router.get('/userinfo/:number', checkLogin, (req, res) => {
  const number = req.params.number;
  UsersModel.find({ number })
    .then((result) => {
      logger.debug('user: ', result);
      if (result.length === 0) {
        req.session.destroy();
        return Promise.reject({
          code: 1,
          message: '用户不存在',
        });
      }
      const userInfo = {
        number: result[0].number,
        datetime: result[0].number,
        info: result[0].info,
      };
      return res.json({
        code: 0,
        data: {
          user: userInfo,
        },
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '获取个人信息失败',
        });
      });
});


/**
 * 更新用户信息
 */
router.post('/update', checkLogin, (req, res) => {
  const phone = req.body.phone;
  const wechat = req.body.wechat;
  const qq = req.body.qq;
  const introduction = req.body.introduction;
  const project = req.body.project;
  const number = req.session.user.number;
  const userUpdate = {
    phone,
    wechat,
    qq,
    introduction,
    project,
  };

  UsersModel.update({ number }, { $set: userUpdate })
    .then((result) => {
      logger.debug('result: ', result);
      return res.json({
        code: 0,
        message: '更新成功',
      });
    })
      .catch((error) => {
        logger.debug('error: ', error);
        return res.json({
          code: 1,
          error,
          message: '更新失败，请重试',
        });
      });
});


/**
 * 上传头像
 * @type {object}
 */
router.post('/avatar', (req, res) => {
  const number = req.session.user.number;
  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    const { path: tempPath, originalFilename } = files.imageFile[0];
    // const copyToPath = imagePath + originalFilename;
    // logger.debug('path: ', path);
    logger.debug('tempPath: ', tempPath);
    logger.debug('originalFilename: ', originalFilename);
    fs.readFile(tempPath, (errRead, data) => {
      if (errRead) {
        return res.json({
          code: 2,
          message: '上传头像失败！',
        });
      }
      // make copy of image to new location
      // const newPath = '/public/uploads/avatars0/' + originalFilename;
      const currentPath = path.dirname(__filename);
      const newFilename = uuid() + path.extname(originalFilename);
      logger.debug('newFilename: ', newFilename);
      const newPath = `${currentPath}/../public/uploads/avatars/${newFilename}`;
      logger.debug('currentPath: ', currentPath);
      logger.debug(newPath);
      // logger.debug(currentPath);
      fs.writeFile(newPath, data, (errWrite) => {
        // console.log('errWrite: ', errWrite);
        if (errWrite) {
          return res.json({
            code: 1,
            message: '上传头像失败！',
          });
        }
        // delete temp image
        fs.unlink(tempPath, () => {
          // res.send("File uploaded to: " + newPath);
          const userUpdate = {
            avatar: newFilename,
          };

          UsersModel.update({ number }, { $set: userUpdate })
            .then((result) => {
              logger.debug('result: ', result);
              // 更新 session
              req.session.user.avatar = userUpdate.avatar;
              return res.json({
                code: 0,
                message: '更新头像成功！',
              });
            })
              .catch((error) => {
                logger.debug('error: ', error);
                return res.json({
                  code: 1,
                  error,
                  message: '更新头像失败，请重试',
                });
              });
        });
      });
    });
  });
});


module.exports = router;
