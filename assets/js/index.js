/*
 * @Author: zhoujie 18326485422@163.com
 * @Date: 2022-09-29 16:12:58
 * @LastEditors: zhoujie 18326485422@163.com
 * @LastEditTime: 2022-10-07 09:24:37
 * @FilePath: \project-bigevent\assets\js\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let layer = layui.layer
$(function () {
  // 调用 getUserInfo 获取用户基本信息
  // 目的：确保dom渲染完毕之后去请求数据
  getUserInfo()
})

// var const 的区别
// 由var声明的变量会默认存在 window 全局变量上，但是 let/const 不会
// var 和function 关键字 声明的变量都存在window全局变量身上
// var a = 100

function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization:localStorage.getItem('big_news_token') || ''
    // },
    success(res) {
      console.log(res)
      if (res.code !== 0) return layer.msg(res.message)
      // 按需渲染头像
      renderAvatar(res)
    }
    // error(err) {
    //   console.log(err)
    //   if (err.responseJSON?.code === 1 && err.responseJSON?.message === '身份认证失败！') {
    //     // 进此处的话，可以认为请求有误了
    //     // localStorage.removeItem('big_news_token')
    //     localStorage.clear()
    //     location.href = '/login.html'
    //   }   
    // }
  })
}

const renderAvatar = (res) => {
  if (res.data.user_pic) {
    $('.text-avatar').hide()
    $('.user-box img').attr('src', res.data.user_pic).show()
  } else {
    $('.layui-nav-img').hide()
    // 取nickname 和 username
    // 显示文字头像，取username属性的第一个字母
    const name = res.data.nickname || res.data.username
    const char = res.data.username.charAt(0).toUpperCase()
    $('.text-avatar').css('display','flex').html(char).show()
  }
  $('.text').html(`欢迎&nbsp;&nbsp;${res.data.username}`)
}

// 实现退出操作
// 1、页面需要跳转到登录页
// 2、token需要移除
// 3、来一个确认提示框
$('#btnLogout').on('click', function () {
  // layer.confirm
  // const result = confirm('您确定要退出吗？')
  // if (result) {
  //   // 1、token需要移除
  //   localStorage.removeItem('big_news_token')
  //   // localStorage.clear()
  //   // 2、页面需要跳转到登录页
  //   location.href = '/login.html'
  // }

  layer.confirm(
    '您确定要退出吗？',
    { icon: 3, title: '提示' },
    function (index) {
      localStorage.removeItem('big_news_token')
      location.href = '/login.html'
      // close 是固定写法，关闭弹窗的时候
      layer.close(index)
    }
  )
})