// pages/Student/TeacherDetail/TeacherDetail.js

var http = require("../../../utils/api");
var util = require("../../../utils/util.js");
Page({
  data: {
    showTop: false,
    serviceHours: null,
    servicePersonNum: null,
    teacherForStudentServiceList: null,
    StudentAppraiseForTeacherList: null,
    collectFlag: false,
    RESOURCE_PERFIX: http.RESOURCE_PERFIX,
    formOrder: false,
    serviceTabIndex: 1,
    userinfo: {},
    labels: [], // 教员标签
    experienceList: [], // 家教经验
    certificateList: [], // 能力认证
    teachBranchs: [], // 可教科目
    teachAddress: [], // 授课区域
    week: ["一", "二", "三", "四", "五", "六", "日"],
    weekTimePeriod: [
      {
        name: "上午",
        period: "08:00 - 12:00"
      },
      {
        name: "下午",
        period: "12:00 - 18:00"
      },
      {
        name: "晚上",
        period: "18:00 - 23:00"
      }
    ],
    weekTime: [
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ],
      [
        {
          value: 0,
          checked: false
        },
        {
          value: 1,
          checked: false
        },
        {
          value: 2,
          checked: false
        }
      ]
    ]
  },

  toggleService: function(event) {
    var that = this;
    that.setData({
      serviceTabIndex: event.target.dataset.id
    });
  },

  onCollectTeacher() {
    http
      .postPromise("/teacher/connect", {
        teacherId: this.teacherId,
        studentId: wx.getStorageSync("user_id")
      })
      .then(data => {
        this.setData({ collectFlag: true });
        wx.showToast({
          title: data.msg,
          icon: "none"
        });
      });
  },

  /**
   * 获取简历信息
   */
  getUserinfo: function(teacherId) {
    var that = this;
    var params = {
      teacherId,
      studentId: wx.getStorageSync("user_id")
    };
    http.post(
      "/userInfo/queryUserInfosDetail",
      params,
      function(res) {
        var data = res.data;
        var _expirencePictures = [];
        var _certificatePictures = [];
        var _weekTime = [];
        if (data.expirencePictureList.length > 0) {
          data.expirencePictureList.forEach(function(item) {
            if (item.pictureUrl) {
              _expirencePictures = [];
              item.pictureUrl.split(",").forEach(function(p) {
                _expirencePictures.push(that.data.RESOURCE_PERFIX + p);
              });
            }
            item.pictureUrl = _expirencePictures;
          });
        }
        if (data.certificatePictureList.length > 0) {
          data.certificatePictureList.forEach(function(item) {
            if (item.pictureUrl) {
              _certificatePictures = [];
              item.pictureUrl.split(",").forEach(function(p) {
                _certificatePictures.push(that.data.RESOURCE_PERFIX + p);
              });
            }
            item.pictureUrl = _certificatePictures;
          });
        }

        if (data.teachTime) {
          var __teachTime = JSON.parse(data.teachTime);
          if (__teachTime.length <= 0) {
            return;
          }
          that.data.weekTime.forEach(function(item, index) {
            var _time = [];
            item.forEach(function(_item) {
              _item.checked = false;
              __teachTime.forEach(function(t) {
                if (index + 1 == t.week) {
                  t.time.split(",").forEach(function(__t) {
                    if (__t == _item.value) {
                      _item.checked = true;
                    }
                  });
                }
              });
              _time.push(_item);
            });
            _weekTime.push(_time);
            that.setData({
              weekTime: _weekTime
            });
          });
        }
        //console.log(data.baseInfo)
        that.setData({
          collectFlag: data.collectFlag,
          userinfo: data.baseInfo,
          labels: data.chooseTags,
          experienceList: data.expirencePictureList,
          certificateList: data.certificatePictureList,
          teachBranchs: data.teachBranchs,
          teachAddress: data.teachAddress,
          StudentAppraiseForTeacherList: data.StudentAppraiseForTeacherList.map(
            item => {
              item.appraiseTimeStr = util.formatTime(
                item.appraiseTime,
                "{y}-{m}-{d} {h}:{i}"
              );
              return item;
            }
          ),
          teacherForStudentServiceList: data.teacherForStudentServiceList.map(
            item => {
              item.orderStartStr = util.formatTime(
                item.orderStart,
                "{y}-{m}-{d} {h}:{i}"
              );
              return item;
            }
          ),
          serviceHours: data.serviceHours,
          servicePersonNum: data.servicePersonNum
        });
        that.canvasTap(
          "employRate",
          "#32BE78",
          0,
          data.baseInfo.employRate,
          10,
          20,
          20
        );

        that.canvasTap(
          "resumptionRate",
          "#4DB6F5",
          0,
          data.baseInfo.resumptionRate,
          10,
          20,
          20
        );
        that.canvasTap(
          "praiseRate",
          "#E50505",
          0,
          data.baseInfo.appraiseRate,
          10,
          20,
          20
        );
      },
      function(err) {
        wx.showToast({
          title: err.msg,
          icon: "none"
        });
      },
      function() {
        wx.hideLoading();
      }
    );
  },
  /**
   * 预览图片
   */
  previewImg: function(e) {
    //console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: e.currentTarget.dataset.urls,
      success: function(res) {
        //console.log(res)
      },
      fail: function(err) {
        //console.log(err)
      }
    });
  },
  canvasTap: function(id, color, start, end, time, w, h) {
    end = end ? Number(`${end}`.replace("%", "")) : 0;

    end = isNaN(end) ? 0 : end;

    var that = this;

    //圆环的绘制
    const ctx2 = wx.createCanvasContext(id);
    ctx2.beginPath();
    ctx2.setStrokeStyle("#cccccc");
    ctx2.arc(w, h, w - 2, 0, 2 * Math.PI);
    ctx2.setLineWidth("2");
    ctx2.setLineCap("butt");
    ctx2.stroke();

    //圆环的绘制
    var num = ((2 * Math.PI) / 100) * start - 0.5 * Math.PI;
    ctx2.beginPath();
    ctx2.arc(w, h, w - 2, -0.5 * Math.PI, num);
    ctx2.setStrokeStyle(color);
    ctx2.setLineWidth("2");
    ctx2.setLineCap("butt");
    ctx2.stroke();
    //开始绘制百分比数字
    ctx2.beginPath();
    ctx2.setFontSize(12);
    ctx2.setFillStyle(color);
    ctx2.setTextAlign("center");
    ctx2.setTextBaseline("middle");
    ctx2.fillText(start + "%", w, h);
    ctx2.draw();

    start++;
    if (start > end) {
      return false;
    }
    setTimeout(function() {
      that.canvasTap(id, color, start, end, time, w, h);
    }, time);
  },

  onToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({ showTop: false });
  },

  onPageScroll(e) {
    if (e.scrollTop > 0) {
      this.setData({
        showTop: true
      });
    } else {
      this.setData({
        showTop: false
      });
    }
  },

  onLoad: function(options) {
    this.teacherId = options.id;
    if (Number(options.form) === 1) {
      this.setData({
        formOrder: true
      });
    }
    this.getUserinfo(options.id);
  }
});
