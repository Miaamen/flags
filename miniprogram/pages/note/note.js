var db_util = require('../../utils/util.js');

var date = new Date();
var curYear = date.getFullYear();
var curMonth = date.getMonth();
var curDay = date.getDate();

var todayY = curYear;
var todayM = curMonth;

var mm = [1, 2, 3, 4 ,5, 6, 7, 8, 9, 10, 11, 12];

var firstDayOfMonth = new Date(curYear, curMonth, 1);
var lastDayOfMonth = new Date(curYear, curMonth + 1, 0);
var blank = firstDayOfMonth.getDay();

const db = wx.cloud.database();
const _ = db.command;

// pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    month: todayY,
    year: todayM,
    day: 1,
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    date: [],
    choosed: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    this.setData({
      month: mm[curMonth],
      year: curYear,
      day: curDay
    })
    this.showDate(curYear, curMonth);

    const todayDate = db_util.getTimeString(curYear, mm[curMonth], curDay);
    
    db.collection('flags').where({
      flagTime: _.elemMatch({
        date: todayDate
      })
    }).get({
      success: function (res) {
        _this.setData({
          list: res.data
        })
      }
    });
    
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

  },

  /**
   * 显示年月
   */
  showDate: function (year, month) {
    console.log('showDataSHOWDATA');
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
      date: blanks.concat(days),
    })

    // const todayDate = db_util.getTimeString(year, month, curDay);
    // console.log('tttttt:', todayDate);
    // const _this = this;
    // db.collection('flags').where({
    //   flagTime: _.elemMatch({
    //     date: todayDate
    //   })
    // }).get({
    //   success: function (res) {
    //     console.log('sususuus', res.data);
    //     _this.setData({
    //       list: res.data
    //     })
    //   }
    // });
  },

  prev: function () {
    console.log('prevprev', curMonth);
    //如果当前月份是1月份的话，上一个月就是去年的最后一个月
    if (curMonth === 0) {
      let tempY = this.data.year;
      this.setData({
        year: tempY - 1,
        month: 12
      });
      this.showDate(curYear - 1, 11);
    } else {
      this.setData({
        month: mm[curMonth - 1]
      });
      this.showDate(curYear, curMonth - 1);
    }
  },

  next: function () {
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
  },

  /**
   * 跳转到某天
   */
  chooseDate: function(e) {
    console.log('choose:', e.currentTarget.dataset.day, curYear, mm[curMonth]);
    const day = e.currentTarget.dataset.day;
    this.setData({
      choosed: day
    })
    const todayDate = db_util.getTimeString(curYear, mm[curMonth], day);
    const _this = this;
    db.collection('flags').where({
      flagTime: _.elemMatch({
        date: todayDate
      })
    }).get({
      success: function (res) {
        _this.setData({
          list: res.data,
          year: curYear,
          month: mm[curMonth],
          day: day
        })
      }
    });
  }
})