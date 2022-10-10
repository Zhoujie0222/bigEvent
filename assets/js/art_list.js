$(function () {
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage
  // 定义美化时间的过滤器
  template.defaults.imports.formatTime = (time) => {
    let date = new Date(time)
    let y = date.getFullYear()
    let m = (date.getMonth() + 1 + '').padStart(2, '0')
    let d = (date.getDate() + '').padStart(2, '0')
    let h = (date.getHours() + '').padStart(2, '0')
    let mm = (date.getMinutes() + '').padStart(2, '0')
    let ss = (date.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${mm}:${ss}`
  }
  let qs = {
    pagenum: 1, //当前页码值（表示当前是第几页）
    pagesize: 2, //当前每页显示多少条
    cate_id: '', //当前选择的文章分类
    state: '', //当前文章所处的状态，可选值：已发布，操作 都是字符串类型
  }

  
  loadArticleList()
  // 加载文章列表
  function loadArticleList() {
    $.ajax({
      method: 'GET',
      url: `/my/article/list?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
      success(res) {
        if (res.code !== 0) return layer.msg('获取文章列表失败')
        // console.log(res)
        const str = template('tpl-list', res)
        // $('tbody').empty().html(str)
        $('tbody').empty().append(str)

        // 做分页效果：总数是必要条件
        renderPager(res.total)
      }
    })
  }

  loadCateList()
  // 初始化文章分类的方法
  function loadCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/cate/list',
      success(res) {
        if (res.code !== 0) return layer.msg('获取文章列表失败')
        // console.log(res)
        const str = template('tpl-cate', res)
        $('[name=cate_id]').html(str)
        form.render() //render渲染的意思
      }
    })
  }
  // 筛选
  $('#choose-form').on('submit', function (e) {
    e.preventDefault()
    // 只需要处理一下参数，再直接调用获取列表的方法
    // 不能加if判断 如果选的是所有分类 所有状态 qs.cate_id='' 此时进不来判断里面 还是保持上一次的值
    const cate_id = $('[name=cate_id]').val()
    qs.cate_id = cate_id
    // qs.cate_id = $('[name=cate_id]').val()
    const state = $('[name=state]').val()
    qs.state = state
    // qs.state = $('[name=state]').val()
    loadArticleList()
  })

  // 定义渲染分页的方法
  function renderPager(total) {
    // layerui 提供的分页组件 total pagenum:1 pagesize:2 这些条件加起来
    laypage.render({
      elem: 'pagerWrapper',  //分页容器的id
      // elem:document.getElementById('pagerWrapper'),
      count: total,  //总数据条数
      limit: qs.pagesize,  //每页显示几条数据
      curr: qs.pagenum, //设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // obj（当前分页的所有选项值）
      jump(obj, first) {
        // jump回调触发的时机：1、初次渲染分页组件的时候 2、主动切换页码值的时候
        // console.log(first)
        // console.log(obj.curr , obj.limit);
        // 把最新的页码值，赋值到qs这个查询参数对象中
        qs.pagenum = obj.curr
        qs.pagesize = obj.limit

        // 如果直接进行调用，会导致死循环的问题
        // loadArticleList()
        // 应该是用户主动切换页码值的时候去加载列表
        if (!first) {
          loadArticleList()
        }
        // if (typeof first === 'undefined') {
        //   loadArticleList()
        // }
      }
    })
  }

  // 通过代理的形式给 删除按钮绑定点击事件
  $('tbody').on('click', '.btnDelete', function () {
    const result = confirm('您确定要删除该文章吗?')
    let len = $('.btnDelete').length
    // console.log(len)
    if (result) {
      const id = $(this).attr('data-id')
      $.ajax({
        method: 'DELETE',
        url: `/my/article/info?id=${id}`,
        success(res) {
          if (res.code !== 0) return layer.msg('删除文章失败')
          layer.msg('删除文章成功')

          // 判断一下，如果当前是最后一条数据的话，需要将 pagenum -1
          // 获取删除按钮元素的个数
          if (len === 1) {
            // 如果当前都已经是第一页了，就不要减了，默认是第一页就好了
            qs.pagenum = qs.pagenum === 1 ? 1 : qs.pagenum - 1
          }
          loadArticleList()
        }
      })
    }
    // let len = $('.btnDelete').length
    // layer.confirm('您确定要删除该文章吗?', { icon: 3, title: '提示' }, function (index) {
    //   $.ajax({
    //     method: 'DELETE',
    //     url: `/my/article/info?id=${id}`,
    //     success(res) {
    //       if (res.code !== 0) return layer.msg('删除文章失败')
    //       layer.msg('删除文章成功')

    //       if (len === 1) {
    //         qs.pagenum = qs.pagenum === 1 ? 1 : pagenum - 1
    //       }
    //       loadArticleList() 
    //       layer.close(index)
    //     }
    //   })
    // })
  })
})