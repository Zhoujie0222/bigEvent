/*
 * @Author: zhoujie 18326485422@163.com
 * @Date: 2022-09-29 15:51:45
 * @LastEditors: zhoujie 18326485422@163.com
 * @LastEditTime: 2022-10-06 15:31:56
 * @FilePath: \project-bigevent\assets\js\baseApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 每次发起真正的请求之后，都会经过的地方
$.ajaxPrefilter(function (config) {
  // 将key=value形式的数据，转成json格式的字符串
  const format2Json = (source) => {
    let target = {}
    source.split('&').forEach(item => {
      let kv = item.split('=')
      // target[kv[0]] = kv[1]
       // 对value值（kv[1]）进行解码操作 decodeURLComponent()
      target[kv[0]] = decodeURIComponent( kv[1])
    })
    return JSON.stringify(target)
  }


  // 在此处将基准地址拼接一下
  config.url = 'http://big-event-vue-api-t.itheima.net' + config.url

  // 统一设置请求头 Content-Type
  config.contentType = 'application/json'

  // 统一设置请求的参数 - post 请求
  config.data = config.data && format2Json(config.data)

  // 统一设置请求头(有条件的添加)
  // 请求路径中有/my 这样字符串的需要添加
  // indexOf startsWith endsWith includes 包含包括的意思
  if (config.url.includes('/my')) {
    // 经过调试，headers 属性是自定义的属性
    config.headers = {
      Authorization:localStorage.getItem('big_news_token') || ''
    }
  } 

  //统一添加错误回调 或 complete 回调 
  config.error = function(err){
    if (
      err.responseJSON?.code === 1 &&
      err.responseJSON?.message === '身份认证失败！'
    ) {
        // 进此处的话，可以认为请求有误了
        // localStorage.removeItem('big_news_token')
        localStorage.clear()
        location.href = '/login.html'
      }   
    }
})