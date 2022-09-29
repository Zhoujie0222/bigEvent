// 每次发起真正的请求之后，都会经过的地方
$.ajaxPrefilter(function (config) {
  // 将key=value形式的数据，转成json格式的字符串
  const format2Json = (source) => {
    let target = {}
    source.split('&').forEach(item => {
      let kv = item.split('=')
      target[kv[0]] = kv[1]
    })
    return JSON.stringify(target)
  }

  // 在此处将基准地址拼接一下
  config.url = 'http://big-event-vue-api-t.itheima.net' + config.url

  // 统一设置请求头 Content-Type
  config.contentType = 'application/json'

  // 统一设置请求的参数 - post 请求
  config.data = format2Json(config.data)
})