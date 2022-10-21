/*
 * @Author: zhoujie 18326485422@163.com
 * @Date: 2022-09-26 19:19:28
 * @LastEditors: zhoujie 18326485422@163.com
 * @LastEditTime: 2022-10-21 12:02:14
 * @FilePath: \project-bigevent\assets\js\login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
$(function () {
  // 点击去注册
  $('#go2Reg').on('click', function () {
    $('.login-wrap').hide()
    $('.reg-wrap').show()
  })
  // 点击去登录
  $('#go2Login').on('click', function () {
    $('.reg-wrap').hide()
    $('.login-wrap').show()
  })
  // 需要从layui对象身上取到form
  const form = layui.form
  const layer = layui.layer
  // 通过form.verify()函数自定义校验规则
  form.verify({
    // 自定义一个叫做pwd的规则
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 确认密码框
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      //拿到密码框和再次确认密码作比较
      // 属性选择器:$('[name=xxx]').val()
      if ($('#password').val() !== value) {
        return '两次密码不一致，请重新输入'
      }
    }
  })

  // 说明一下:video里面的请求不用了,用新的http://big-event-vue-api-t.itheima.net

  // 原来的:Content-Type:'application/x-www-form-urlencoded' -> key1=value1&key2=value2
  // 现在的:Content-Type需要指定:'application/json' -> '{"key1":"value1","key2":"value2"}'

  // key1=value1&key2=value2 -> '{"key1":"value1","key2":"value2"}'

  // 监听注册表单的提交事件
  $('#formReg').on('submit', function (e) {
    // 阻止默认提交动作
    e.preventDefault()
    // 发起ajax请求
    // 经过分析:1、修改Content-Type 2、需要将参数转成json格式
    $.ajax({
      method: 'POST',
      url: '/api/reg',
      // url: '/api/reguser',
      // url: 'http://big-event-vue-api-t.itheima.net/api/reg',
      // contentType: 'application/json',
      // data:JSON.stringify({
      //   // 可以将对象转成json格式的字符串
      //   username:$('#formReg [name=username]').val(),
      //   password:$('#formReg [name=password]').val(),
      //   repassword:$('#formReg [name=repassword]').val(),
      // }),
      data: $(this).serialize(),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        layer.msg('注册成功');
        $('#go2Login').click()
      }
    })
  })

  // 监听注册表单的提交事件
  $('#formLogin').submit(function (e) {
    // 阻止表单默认提交行为
    e.preventDefault()
    $.ajax({
      method: 'POST',
      // url: 'http://big-event-vue-api-t.itheima.net/api/login',
      url:'/api/login',
      // contentType: 'application/json',
      data: $(this).serialize(),
      success(res) {
        if (res.code !== 0) return layer.msg(res.message)
        // 需要干什么
        // 跳转到主页
        // location.href = '/home.html'
        // token 意思是令牌的意思（下一次去请求有权限的接口的时候'带着')
        localStorage.setItem('big_news_token', res.token)
        // 固定写法：Bearer token字符串、Bearer译为持票人拿着token去请求
        location.href = '/home.html'
      }
    })
  })
})