/**
 * 控制用户信息的显示和隐藏
 * @param  {object} userinfo 原始用户信息
 * @return {object}          处理后的用户信息
 */
function controlUserinfo(userinfo) {
  const obj = userinfo;
  // 设置字符串显示或隐藏
  if (obj.studentID && !obj.studentID.show) {
    obj.studentID.value = obj.studentID.value.replace(/./g, '*');
  }
  if (obj.name && !obj.name.show) {
    obj.name.value = `${obj.name.value.substr(0, 1)}同学`;
  }
  if (obj.gender && !obj.gender.show) {
    obj.gender.value = obj.gender.value.replace(/./g, '*');
  }
  if (obj.type && !obj.type.show) {
    obj.type.value = obj.type.value.replace(/./g, '*');
  }
  if (obj.state && !obj.state.show) {
    obj.state.value = obj.state.value.replace(/./g, '*');
  }
  if (obj.college && !obj.college.show) {
    obj.college.value = obj.college.value.replace(/./g, '*');
  }
  if (obj.major && !obj.major.show) {
    obj.major.value = obj.major.value.replace(/./g, '*');
  }
  if (obj.grade && !obj.grade.show) {
    obj.grade.value = obj.grade.value.replace(/./g, '*');
  }
  if (obj.phone && !obj.phone.show) {
    obj.phone.value = obj.phone.value.replace(/./g, '*');
  }
  if (obj.wechat && !obj.wechat.show) {
    obj.wechat.value = obj.wechat.value.replace(/./g, '*');
  }
  if (obj.email && !obj.email.show) {
    obj.email.value = obj.email.value.replace(/./g, '*');
  }
  if (obj.qq && !obj.qq.show) {
    obj.qq.value = obj.qq.value.replace(/./g, '*');
  }
  if (obj.introduction && !obj.introduction.show) {
    obj.introduction.value = '保密';
  }
  if (obj.projects && !obj.projects.show) {
    obj.projects.value = '保密';
  }
  // 删除密码等敏感信息
  delete obj.password;
  delete obj.passwordLib;
  return obj;
}


module.exports = controlUserinfo;
