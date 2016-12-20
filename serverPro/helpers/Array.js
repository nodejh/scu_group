/**
 * 二维数组转一维
 * @param  {Array} arr 二维数组
 * @return {Array}     一维数组
 */
function reduceDimension(arr) {
  return Array.prototype.concat.apply([], arr);
}


module.exports = {
  reduceDimension,
};
