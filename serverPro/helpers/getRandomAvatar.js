const avatarArr = [
  'avatar1.png',
  'avatar2.png',
  'avatar3.png',
  'avatar4.png',
  'avatar5.png',
  'avatar6.png',
  'avatar7.png',
  'avatar8.png',
  'avatar9.png',
  'avatar10.png',
  'avatar11.png',
  'avatar12.png',
  'avatar13.png',
];

/**
 * 生成随机数
 * @param  {Number} [min=0]  最小值
 * @param  {Number} [max=13] 最大值
 * @return {Number}          随机数
 */
const randomNumber = (min = 0, max = 12) => {
  const number = parseInt(((Math.random() * ((max - min) + 1)) + min), 10);
  return number;
};


/**
 * 获取随机avatar
 * @param  {Number} [number=0] 索引
 * @return {String}            图片链接
 */
const getRandomAvatar = () => {
  const avatar = avatarArr[randomNumber()];
  return avatar;
};


module.exports = getRandomAvatar;
