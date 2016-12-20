/**
 * 时间格式化
 * @param  {number} unixTimestamp 时间戳
 * @return {string}       2016.01.01 10:30:23         格式化后的时间
 */
function formatTime(unixTimestamp) {
  const date = new Date(unixTimestamp);
  // Hours part from the timestamp
  const hours = date.getHours();
  // Minutes part from the timestamp
  const minutes = `0${date.getMinutes()}`;
  // Seconds part from the timestamp
  const seconds = `0${date.getSeconds()}`;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Will display time in 10:30:23 format
  return `${year}.${month}.${day} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
}


/**
 * 日期格式化
 * @param  {number} unixTimestamp 时间戳
 * @return {string}                格式化后的时间
 */
function formatDate(unixTimestamp) {
  const date = new Date(unixTimestamp);
  // Hours part from the timestamp
  // const hours = date.getHours();
  // Minutes part from the timestamp
  // const minutes = `0${date.getMinutes()}`;
  // Seconds part from the timestamp
  // const seconds = `0${date.getSeconds()}`;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Will display time in 10:30:23 format
  return `${year}年${month}月${day}日`;
}


module.exports = {
  formatTime,
  formatDate,
};
