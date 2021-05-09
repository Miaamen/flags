var db_util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command;

var date = new Date();
var curYear = date.getFullYear();
var curMonth = date.getMonth();
var curDay = date.getDate();

var todayY = curYear;
var todayM = curMonth;

var mm = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

var firstDayOfMonth = new Date(curYear, curMonth, 1);
var lastDayOfMonth = new Date(curYear, curMonth + 1, 0);
var blank = firstDayOfMonth.getDay();

var nowDate = Number(db_util.toNumberDate(db_util.getLocalTime(new Date().getTime(), 'date')));

const flags = wx.cloud.database().collection('flags');
const loginTime = wx.cloud.database().collection('loginTime');
const weekData = wx.cloud.database().collection('weekData');
// pages/flags/flags.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flagList: [],
    showDone: false,
    showDetail: false,
    currentList: {},
    showCalen: false,
    month: 1,
    year: 2021,
    day: 1,
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    date: [],
    todayString: '',
    choosed: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const todayLogin = 20210428;
    // db_util.changeFlag();
    const todayDate = db_util.getTimeString(curYear, mm[curMonth], curDay).substring(5);
    this.setData({
      month: mm[curMonth],
      year: curYear,
      todayString: todayDate
    })
    this.showDate(curYear, curMonth);
    new Promise((resovle, reject) => {
      loginTime.get({
        success(res) {
          console.log('lognjjj:', res.data, res.data[0].lastLogin, nowDate, res.data[0].lastLogin == nowDate)
          if (res.data.length < 1) {
            console.log('lognjjsssj:', res.data);
            weekData.add({
              data: {
                week: [0, 0, 0, 0, 0, 0, 0],
                flag: true
              }
            });
            loginTime.add({
              data: {
                lastLogin: 20210427
              }
            });
            flags.where({
              done: true
            })
            .update({
              data: {
                done: false
              }
            });
          } else if (res.data[0].lastLogin != nowDate) {
            flags.where({
              done: true
            })
            .update({
              data: {
                done: false 
              }
            });
            loginTime.where({
              lastLogin: _.lte(nowDate)
            })
            .update({
              data: {
                lastLogin: nowDate
              }
            })
          }
        }
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
    // flags.get({
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })
    const _this = this;
    wx.showLoading({
      title: '加载中',
    })
    console.log('noewhhh:', nowDate)
    flags.where({
      startDate: _.lte(nowDate),
      deadline: _.gte(nowDate)
    })
      .get({
        success(res) {
          _this.setData({
            flagList: res.data
          })
          console.log('hhhhhhasdgddddddd:', res);
          _this.showWeekData(res.data.length);
          wx.hideLoading();
        }
      })
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

  },

  /**
   * 展示日历
   */
  showCalendar: function ()  {
    console.log('showCalendar');
    let tempCalen = this.data.showCalen
    this.setData({
      showCalen: !tempCalen
    })
  },

  addFlag: function () {
    console.log('hello');
    wx.navigateTo({
      url: '../usually/usually',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        // acceptDataFromOpenedPage: function (data) {
        //   console.log(data)
        // },
        // someEvent: function (data) {
        //   console.log(data)
        // }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  },
  doneFlag: function (e) {
    const id = e.currentTarget.dataset.id;
    const flags = wx.cloud.database().collection('flags');
    const _this = this;
    const _ = wx.cloud.database().command
    const todayDate = db_util.getLocalTime(new Date().getTime(), 'date');
    const todayTime = db_util.getLocalTime(new Date().getTime(), 'time');
    if(!e.currentTarget.dataset.done) {
      flags.doc(id).update({
        data: {
          done: true,
          times: _.inc(1),
          flagTime: _.push({
            each: [{
              date: todayDate,
              time: todayTime
            }],
            position: 1
          })
        }
      }).then(res => {
        flags.doc(id).get({
          success: function (res) {
            _this.setData({
              currentList: res.data,
              showDone: true
            })
            _this.onShow();
          }
        });
      }).catch(err => {
        console.log('error', err);
      });                                                                    
    } else {
      flags.doc(id).get({
        success: function (res) {
          _this.setData({
            currentList: res.data,
            showDetail: true
          })
        }
      });
    }
  },
  closeDone: function (e) {
    if(e.currentTarget.dataset.type == 'detail') {
      this.setData({
        showDetail: false
      })
    }
    this.setData({
      showDone: false
    })
  },
  showDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.currentList
    wx.navigateTo({
      url: '../detail/detail',
      events: {},
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { datasetId: id, datasetList: list })
      }
    })
  },

  showWeekData: function (allNum) {
    let weekOfToday = 0;
    let doneNum = 0;

    new Promise((resovle, reject) => {
      console.log(111)
      flags.where({
        done: true
      })
        .get({
          success: function (res) {
            console.log(222)
            // res.data 是包含以上定义的两条记录的数组
            doneNum = res.data.length;
            resovle();
          }
        });
    }).then(() => {
      console.log(444)
      weekOfToday = Number((doneNum / allNum).toFixed(2));
      console.log('weekOfTodayweekOfTodayweekOfToday', weekOfToday);
      weekData.where({
        flag: true
      })
        .update({
          data: {
            week: _.push(weekOfToday)
          }
        })
    }).catch((e) => {
      console.log(444, e)
    })
  },

  /**
   * 跳转到某天
   */
  chooseDate: function (e) {
    const day = e.currentTarget.dataset.day;
    this.setData({
      choosed: day
    })
    const todayDate = Number(db_util.toNumberDate(db_util.getTimeString(curYear, mm[curMonth], day)));
    const todayString = (db_util.getTimeString(curYear, mm[curMonth], day)).substring(5);
    const _this = this;
    console.log('nowDatenowDate', nowDate, typeof nowDate, todayDate, typeof todayDate);
    db.collection('flags').where({
      // flagTime: _.elemMatch({
      //   date: todayDate
      // })
      // todayDate: 20210427
      // deadline: 20210426
      // startDate: 20210427
      deadline: _.gte(todayDate),
      startDate: _.lte(todayDate)
    }).get({
      success: function (res) {
        console.log('uuuuu:', res);
        _this.setData({
          flagList: res.data,
          showCalen: false,
          todayString: todayString
        })
      }
    });
  },

  /**
   * 显示年月
   */
  showDate: function (year, month) {
    curYear = year;
    curMonth = month;

    let firstDayOfMonth = new Date(curYear, curMonth, 1);
    let lastDayOfMonth = new Date(curYear, curMonth + 1, 0);
    let blank = firstDayOfMonth.getDay();

    let i = 0;

    let d = new Date().getDate();
    let curr = 0;

    if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11) {
      i = 31;
    } else if (month === 3 || month === 5 || month === 8 || month === 10) {
      i = 30;
    } else if ((year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0)) {
      i = 29;
    } else {
      i = 28;
    }

    let blanks = [];
    let days = [];
    for (let j = 0; j < blank; j++) {
      blanks.push(' ');
    }

    for (let j = 1; j <= i; j++) {
      days.push(j);
      if (j === d && curMonth == todayM && curYear == todayY) {
        curr = j;
        this.setData({
          currDay: j
        })
      }
    }
    this.setData({
      date: blanks.concat(days)
    })
  },

  prev: function () {
    //如果当前月份是1月份的话，上一个月就是去年的最后一个月
    if (curMonth === 0) {
      console.log('ififif');
      let tempY = this.data.year;
      this.setData({
        year: tempY - 1,
        month: 12
      });
      this.showDate(curYear - 1, 11);
    } else {
      console.log('elseelseelse');
      this.setData({
        month: mm[curMonth - 1]
      });
      this.showDate(curYear, curMonth - 1);
    }
  },

  next: function () {
    console.log('nextnext');
    //如果当前月份是12月份的话，下一个月就是明年的第一个月
    if (curMonth === 11) {
      let tempY = this.data.year;
      this.setData({
        year: tempY + 1,
        month: 1
      });
      this.showDate(curYear + 1, 0);
    } else {
      this.setData({
        month: mm[curMonth + 1]
      });
      this.showDate(curYear, curMonth + 1);
    }
  }
})