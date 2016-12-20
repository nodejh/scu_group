const http = require('http');
const url = require('url');
const crypto = require('crypto');
const config = require('./config/wechat');


// Web 服务器端口
const port = 3333;


/**
 *  对字符串进行sha1加密
 * @param  {string} str 需要加密的字符串
 * @return {string}     加密后的字符串
 */
function sha1(str) {
  const md5sum = crypto.createHash('sha1');
  md5sum.update(str);
  const ciphertext = md5sum.digest('hex');
  return ciphertext;
}

/**
 * 验证服务器的有效性
 * @param  {object} req http 请求
 * @param  {object} res http 响应
 * @return {object}     验证结果
 */
function checkSignature(req, res) {
  const query = url.parse(req.url, true).query;
  console.log('Request URL: ', req.url);
  console.log('query: ', query);
  const signature = query.signature;
  const timestamp = query.timestamp;
  const nonce = query.nonce;
  // const echostr = query.echostr;
  const tmpArr = [ signature, timestamp, nonce];
  const tmpStr = sha1(tmpArr.sort().join(''));
  // 验证排序并加密后的字符串与 signature 是否相等
  if (tmpStr === signature) {
    console.log('Success');
    res.end(0);
  } else {
    console.log('Failed');
    res.end('false');
  }
}


const server = http.createServer(checkSignature)
server.listen(port, () => {
  console.log(`Server is runnig ar port ${port}`);
  console.log('Start validate');
});
