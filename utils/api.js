// const BASE_URL = 'http://106.15.235.233:8081'
// const BASE_URL = 'https://haojiajiao.cheguangjia.com'

const BASE_URL = 'https://www.laijiajiaosh.com'

// 资源路径
const RESOURCE_PERFIX = 'https://www.laijiajiaosh.com'

function request(url, params, method, onSuccess, onFail, onComplete, isPromise) {
  var token = wx.getStorageSync('token')
  wx.request({
    url: BASE_URL + url,
    data: params,
    header: {
      'Authorization': token || '',
      'content-type': 'application/json;charset=UTF-8',
    },
    method: method,
    success: function (res) {
      if (res.header.Authorization) {
        wx.setStorageSync('token', res.header.Authorization)
      }
      if (res.data.code === '200') {
        onSuccess(res.data)
      } else if (res.data.code == '401') {
        wx.removeStorageSync('token')
        wx.removeStorageSync('user_id')
        wx.removeStorageSync('user_name')
        wx.removeStorageSync('user_phone')
        wx.removeStorageSync('user_type')
        
        wx.showToast({
          title: '登录失效，请重新登录',
          icon: 'none',
          success: function () {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        })
      } else {
        
        if (res.data.msg === '您的身份信息还未审核通过，请至“我的”-“简历信息”中完善信息！') {
          wx.showModal({
            content: '您的身份信息还未审核通过，请至“我的”-“简历信息”中完善信息！',
            success: function(res) {
              if (res.confirm) { //点击确定
                wx.navigateTo({
                  url: '/pages/my/vitaInfo/vitaInfo'
                })
              } else { //点击否
              }
            }
          })      
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        if (isPromise) {
          console.log(333)
          onFail(res.data.msg)
        }
      }
    },
    fail: function (err) {
      onFail(err)
    },
    complete: function (res) {
      if (onComplete) onComplete(res)
    }
  })
}

function post(url, params, onSuccess, onFail, onComplete) {
  request(url, params, "POST", onSuccess, onFail, onComplete)
}

function postPromise(url, params) {
  return new Promise((resolve, reject) => {
    request(url, params, "POST", resolve, reject, () => { }, true)
  })
}

function get(url, onSuccess, onFail, onComplete) {
  request(url, {}, "GET", onSuccess, onFail, onComplete)
}

function getPromise(url, params) {
  return new Promise((resolve, reject) => {
    request(url, params, "GET", resolve, reject, () => { }, true)
  })
}

module.exports = {
  BASE_URL: BASE_URL,
  RESOURCE_PERFIX: RESOURCE_PERFIX,
  post: post,
  get: get,
  postPromise,
  getPromise
}


