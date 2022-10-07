/*
 * @Author: zhoujie 18326485422@163.com
 * @Date: 2022-10-07 10:26:32
 * @LastEditors: zhoujie 18326485422@163.com
 * @LastEditTime: 2022-10-07 16:33:07
 * @FilePath: \project-bigevent\assets\js\article_cate.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEunc
 * 
 */
$(function () {
  const layer = layui.layer
  const form = layui.form
  // 加载分类列表
  loadCateList()
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg('获取分类列表失败')
        const html = template('tpl-cate', res)
        $('tbody').empty().append(html)
      }
    })
  }

  let index = undefined
  $('#btnAdd').on('click', function () {
    // 打开弹窗
    index = layer.open({
      type: 1,
      title: '添加分类名称',
      area: ['400px', '260px'],
      content: $('#addDialog').html()
    })
  })

  let isEdit = false //用来记录当前是什么状态

  // 需要通过代理的形式（你要监听的元素，是后来动态创建的）
  $('body').on('submit', '#addForm', function (e) {
    // 阻止默认提交动作
    e.preventDefault()

    // 需要判断当前是什么状态
    if (isEdit) {
      $.ajax({
        method: 'PUT',
        url: '/my/cate/info',
        data: $(this).serialize(),
        success(res) {
          if (res.code !== 0) return layer.msg('更新列表失败')
          layer.msg('更新列表成功')
          // 2、列表需要更新
          loadCateList()
        }
      })
    } else {
      $.ajax({
        method: 'POST',
        url: '/my/cate/add',
        // data: $(this).serialize(),
        data: form.val('addFormFilter'),
        success(res) {
          if (res.code !== 0) return layer.msg('添加分类失败')
          layer.msg('添加分类成功')
          // 2、列表需要更新
          loadCateList()
        }
      })
    }
    // 要记得把状态置为 默认值 false
    isEdit = false
    // 1、关闭弹窗
    layer.close(index)
    // 为防止异步操作，将其放到请求里面去
    // // 2、列表需要更新
    // loadCateList()
  })

  // 需要通过代理给 编辑 按钮添加点击事件
  $('tbody').on('click', '.btnEdit', function () {
    // console.log('修改了',$(this).attr('data-id'))
    // 用户点击修改按钮的时候，将状态转为 true
    isEdit = true
    index = layer.open({
      type: 1,
      title: '修改分类名称',
      area: ['400px', '260px'],
      content: $('#addDialog').html()
    })

    const id = $(this).attr('data-id')
    // 需要回显表单
    $.ajax({
      method: 'GET',
      url: `/my/cate/info?id=${id}`,
      success(res) {
        if (res.code !== 0) return layer.msg('获取分类详情失败')
        // 快速为表单进行赋值
        form.val('addFormFilter', res.data)
      }
    })
  })

  // 添加删除逻辑
  $('tbody').on('click', '.btnDelete', function () {
    const result = confirm('您确定要删除该分类吗？')
    const id = $(this).attr('data-id')
    if (result) {
      $.ajax({
        method: 'DELETE',
        url: `/my/cate/del?id=${id}`,
        success(res) {
          if (res.code !== 0) return layer.msg('删除分类详情失败')
          layer.msg('删除分类详情成功')
          // 重新加载列表
          loadCateList()
        }
      })
    }
  })
})