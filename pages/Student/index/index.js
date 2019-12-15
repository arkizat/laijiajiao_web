// pages/Student/index/index.js

const http = require('../../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectList: [],
    showTop: false,
    teacherList: [],
    total: 0,
    RESOURCE_PERFIX:http.RESOURCE_PERFIX
  },


  onToTop() {
    this.selectComponent('#pageLayout').onToTop()
    this.setData({ showTop: false })
  },

  onShowTop(e) {
    this.setData({ showTop: e.detail })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.postPromise('/StudentDemand/homepageInfo').then(data => {
      this.setData({
        subjectList: data.data
      })
    })

    http.postPromise('/userInfo/queryAllTeacherInfosByStudents', {}).then(data => {
      this.setData({
        teacherList: data.data.dataList.slice(0, 2).map(item => {
          if (item.teachBrance) {
            item.teachBrance = JSON.parse(item.teachBrance)
            item.teachBranchSlave = item.teachBrance.map(item => item.teachBranchName).join(',')
          }
          return item
        }), total: data.data.total
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})