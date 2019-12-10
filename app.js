const mtjwxsdk = require("./utils/mtj-wx-sdk.js");
const http = require('./utils/api')

App({
  globalData: {
    weekData: null
  },

  onShow() {
    /* wx.login({
      success: (result) => {
        http.postPromise('/user/getUserIdentity', { code: result.code }).then(data => {
          
        })
      },
    }); */
  },

  onLaunch: function (options) {
    //console.log("[onLaunch] 本次场景值:", options.scene)
    // 获取手机信息

    let sysModel = wx.getSystemInfoSync().model;
    if (sysModel.indexOf('iPhone X') != -1) {
      this.isIPX = true;
    }

    var token = wx.getStorageSync('token')
    var userName = wx.getStorageSync('user_name')
    var userType = wx.getStorageSync('user_type') || 1
    if (token) {
      if (userName == null || userName == '') {
        wx.reLaunch({
          url: userType === 1 ? '/pages/Student/LoginInfo/LoginInfo' : '/pages/editUserinfo/editUserinfo',
        })
      } else {
        if (userType === 1) {
          wx.reLaunch({
            url: '/pages/Student/index/index',
          })
        } else {
          wx.switchTab({
            url: '/pages/home/index/index',
          })
        }
      }
    } else {
      /* wx.reLaunch({
        url: userType === 1 ? '/pages/Student/Login/Login' : '/pages/login/login',
      }) */
    }
    // wx.reLaunch({
    //   url: '/pages/discount/index'
    // })
  },
  isIPX: false
})