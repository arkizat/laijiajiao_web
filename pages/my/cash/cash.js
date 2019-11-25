var http = require('../../../utils/api.js')
Page({
  data: {
    isIPX: getApp().isIPX,
    cashOut: null,
    openId: null,
    disable: false
  },
  onLoad: function (options) {
    this.setData({
      money: options.money
    })
    // var that = this
    // http.post('/user/getOpenId', {code: wx.getStorageSync('code')}, function (res) {
    //   var openId = res.data.openid
    //   that.setData({
    //     openId: openid
    //   })
    // })
  },
  onShow () {
    this.setData({
      cashOut: null,
      openId: null,
      disable: false
    })
  },
  getMoney(e) {
    this.setData({
      cashOut: e.detail.value
    })
  },
  saveBtn(e) {
    console.log(e)
    // return
    var that = this
    if (this.data.cashOut === '' || !this.data.cashOut) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return
    }
    if (this.data.disable === true) return
    this.setData({
      disable: true
    })
    wx.showLoading({
      title: '提现中...'
    })
    wx.login({
      success(res1) {
        console.log(res1, 'res1res1')
        if (res1.code) {

          http.postPromise('/user/getOpenId', { code: res1.code }).then(data => {
            //this.login(data.data.openid, gender)
            
            http.post('/wxRedPack/sendRedPack', { teacherId: wx.getStorageSync('user_id'),  formId: e.detail.formId, cashOut: parseFloat(that.data.cashOut), openId: data.data.openid }, function (res) {
              that.setData({
                disable: false
              })
              if (res.data.success === false) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
                return
              }
              console.log(res.data.data.timeStamp, 'res.datares.data')
              wx.hideLoading()
              wx.sendBizRedPacket ({
                timeStamp: res.data.data.timeStamp, // 支付签名时间戳，
                nonceStr: res.data.data.nonceStr, // 支付签名随机串，不长于 32 位
                package: res.data.data.package, //扩展字段，由商户传入
                signType: res.data.data.signType, // 签名方式，
                paySign: res.data.data.paySign, // 支付签名
                success:function(res1){
                  wx.navigateTo({
                    url: './cashSuccess/cashSuccess?id=' + res.data.data.mchBillno + '&formId=' + e.detail.formId
                  })
                },
                fail:function(res){
                  console.log(res)
                },
                complete:function(res){}
            })
            }, function (err) {
              that.setData({
                disable: false
              })
            }, function () {
              that.setData({
                disable: false
              })
              // wx.hideLoading()
            })

          }).catch(err => {
            that.setData({
              disable: false
            })
            err && wx.showToast({
              title: err.msg,
              icon: 'none'
            })
          })
          
          return false

          // http.post('/wxRedPack/sendRedPack', { teacherId: wx.getStorageSync('user_id'), code: res1.code, cashOut: that.data.cashOut }, function (res) {
          //   console.log(res.data)
          //   var data = res.data
          //   if (res.code === '200') {
          //     console.log(data, '111111')
          //   } else {
          //     wx.showToast({
          //       title: res.msg,
          //       icon: 'none'
          //     })
          //   }
          // }, function (err) {
          //   console.log(err)
          // }, function () {
          //   wx.hideLoading()
          // })
          // wx.navigateTo({
          //   url: './cashSuccess/cashSuccess'
          // })
        }
      }
    })
    // 确认提现

  }
})