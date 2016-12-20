const express = require('express');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
const UserModel = require('./../models/user');
const ReleaseModel = require('./../models/release');
const checkLogin = require('./../middlewares/check').checkLogin;
const log4js = require('./../config/log4js');


const logger = log4js.getLogger('/routes/index');
const router = new express.Router();
const imagePath = './../public/uploads/avatars/';

/**
 * 用户主页
 */
router.get('/', checkLogin, (req, res) => {
  const user = req.session.user;
  res.json({
    code: 0,
    data: {
      user,
    },
  });
});


/**
 * 用户个人信息
 */
router.get('/userinfo', checkLogin, (req, res) => {
  const user = req.session.user;
  const number = user.number;

  UserModel.find({ number })
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
        // eslint-disable-next-line
        id: result[0]._id,
        number: result[0].number,
        datetime: result[0].number,
        info: result[0].info,
        phone: result[0].phone,
        wechat: result[0].wechat,
        qq: result[0].qq,
        introduction: result[0].introduction,
        project: result[0].project,
        avatar: result[0].avatar,
      };
      return res.json({
        code: 0,
        data: {
          userInfo,
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
 * 发布活动
 */
router.post('/publish', checkLogin, (req, res) => {
  logger.debug('req.body: ', req.body);
  const title = req.body.title; // 标题
  const introduction = req.body.introduction; // 活动简介
  const teamInfo = req.body.team_info; // 团队现况
  const requirement = req.body.requirement; // 队员要求
  const deadline = req.body.deadline; // 截止日期
  const type = req.body.type; // 类型
  const datetime = new Date().getTime();
  const updatetime = new Date().getTime();
  const number = req.session.user.number;
  const username = req.session.user.info.name;
  if (!title || !introduction || !teamInfo || !requirement || !deadline || !type) {
    return res.json({
      code: 1,
      message: '请填完所有信息后再发布',
    });
  }
  const publishInfo = {
    username,
    number,
    title,
    introduction,
    team_info: teamInfo,
    requirement,
    deadline,
    type,
    datetime,
    updatetime,
    joined_users: [],
  };
  ReleaseModel.insert(publishInfo)
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
router.get('/release', checkLogin, (req, res) => {
  const number = req.session.user.number;
  ReleaseModel.find({ number })
    .sort({ datetime: -1 })
    .exec()
    .then((result) => {
      logger.debug('result: ', result);
      return res.json({
        code: 0,
        data: {
          release: result,
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
  const number = req.session.user.number.toString();
  const id = req.body.id;
  ReleaseModel.find({ _id: id })
    .then((result) => {
      logger.debug('result: ', result);
      if (result.length === 0) {
        return Promise.reject({
          code: 1,
          message: '没有该活动',
        });
      }
      if (number === result[0].number) {
        return Promise.reject({
          code: 1,
          message: '不能加入自己发布的活动',
        });
      }
      const joinedUsers = result[0].joined_users;
      if (joinedUsers.indexOf(number) !== -1) {
        return Promise.reject({
          code: 1,
          message: '您已经加入过该活动',
        });
      }
      logger.debug('number: ', number);
      logger.debug('joinedUsers: ', joinedUsers);
      joinedUsers.push(number);
      logger.debug('joinedUsers: ', joinedUsers);
      const newRelease = {
        number: result[0].number,
        title: result[0].title,
        introduction: result[0].introduction,
        team_info: result[0].team_info,
        requirement: result[0].requirement,
        deadline: result[0].deadline,
        type: result[0].type,
        datetime: result[0].datetime,
        joined_users: joinedUsers,
        updatetime: new Date().getTime(),
      };
      return ReleaseModel.update({ _id: id }, { $set: newRelease });
    })
    .then((result) => {
      logger.debug('result: ', result);
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
  UserModel.find({ _id: id })
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
 * 根据 number 查看用户详情
 */
router.get('/userinfo/:number', checkLogin, (req, res) => {
  const number = req.params.number;
  UserModel.find({ number })
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

  UserModel.update({ number }, { $set: userUpdate })
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


router.post('/avatar', (req, res) => {
  const number = req.session.user.number;
  let form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {

    let {path: tempPath, originalFilename} = files.imageFile[0];
    let copyToPath = imagePath + originalFilename;
    // logger.debug('path: ', path);
    logger.debug('tempPath: ', tempPath);
    logger.debug('originalFilename: ', originalFilename);
    fs.readFile(tempPath, (err, data) => {
      if (err) {
        return res.json({
          code: 2,
          message: '上传头像失败！',
        })
      }
      // make copy of image to new location
      // const newPath = '/public/uploads/avatars0/' + originalFilename;
      const currentPath = path.dirname(__filename);
      const time = new Date().getTime();
      const newFilename = `${time}_${originalFilename}`;
      const newPath = `${currentPath}/../public/uploads/avatars/${newFilename}`;
      logger.debug('currentPath: ', currentPath);
      logger.debug(newPath);
      // logger.debug(currentPath);
      fs.writeFile(newPath, data, (err) => {
        console.log('err: ', err);
        if (err) {
          return res.json({
            code: 1,
            message: '上传头像失败！',
          })
        }
        // delete temp image
        fs.unlink(tempPath, () => {
          // res.send("File uploaded to: " + newPath);
          const userUpdate = {
            avatar: newFilename,
          };

          UserModel.update({ number }, { $set: userUpdate })
            .then((result) => {
              logger.debug('result: ', result);
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
  })
});


module.exports = router;
