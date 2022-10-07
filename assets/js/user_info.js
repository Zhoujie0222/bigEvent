$(function () {
  // 入口函数
  const form = layui.form
  const layer = layui.layer
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称必须是1-6位的非空字符！'
      }
    }
  })

  // 初始化用户的基本信息,获取用户的相关信息
  const initInfo = () => {
    $.ajax({
      // method: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.code !== 0) return layer.msg('请求用户信息失败')
        console.log(res)
        // 调用form.val()快速位表单赋值
        // 1、给表单进行回显数据
        // form.val('你要指定的哪个表单','你要指定的哪个值')
        form.val('userForm',res.data)
      }
    })
  }
  initInfo()

  // 重置表单的数据
  $('#btnReset').on('click', function (e) {
    // 阻止一下默认的重置行为
    e.preventDefault()
    // 重新刷新用户信息
    initInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').submit(function (e) {
    e.preventDefault()

    // 把表单数据打印收集（快速获取表单数据）
    // $(this).serialize()-> key=value&key=value
    // form.val('userForm') -> {key:value,key:value}
    console.log(form.val('userForm'))  
    $.ajax({
      method: 'PUT',
      url: '/my/userinfo',
      data: form.val('userForm'), //问题：@-> %40 这里进行了转义操作（空格 -> %20)  email: "123456%40qq.com"
      success(res) {
        console.log(res)
        if (res.code !== 0) return layer.msg('更新用户信息失败')
        // 刷新一下整体页面
        // window.parent.a
        window.parent.getUserInfo()
        layer.msg('更新用户信息成功')
      }
    })
  })
})