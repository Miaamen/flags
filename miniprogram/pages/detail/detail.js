import * as echarts from "../../ec-canvas/echarts"

let doneValue = 0;
let waitValue = 100;
var option = {
  title: {
    text: doneValue + '%',//主标题文本
    left: 'center',
    top: 'center',
    textStyle: {
      fontSize: 20,
      color: '#454c5c',
      align: 'center'
    }
  },
  series: [
    {
      name: '打卡数据',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 30,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: [
        { value: doneValue, name: '已经打卡' },
        { value: waitValue, name: '没有打卡' }
      ],
      color: [
        '#cfb5e2',
        '#faf2ff'
      ]
    }
  ]
};
var chart;
function initChart(canvas, width, height) {
  console.log('herehere', width, height, canvas)
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}

let arr31 = Array(31).fill(1);
let arr30 = Array(30).fill(1);
let arr28 = Array(28).fill(1);

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentList: {},
    ec: {
      onInit: initChart
    },
    cellList: [arr31, arr28, arr31, arr30, arr31, arr30, arr31, arr31, arr30, arr31, arr30, arr31]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const eventChannel = this.getOpenerEventChannel()
    let id = ''
    const _this = this;
    let temp = {};
    new Promise((resolve, reject) => {
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        id = data.datasetId
      })
      resolve();
    }).then(() => {
      console.log('ididid', id);
      const flags = wx.cloud.database().collection('flags');
      new Promise((resolve, reject) => {
        flags.doc(id).get({
          success: function (res) {
            _this.setData({
              currentList: res.data
            })
            temp = res.data
            console.log('hhhhhhhhhhhhhhhhh', res.data)
            wx.hideLoading();
            resolve();
          }
        });
      }).then(() => {
        const allDay = _this.differDay('2021-03-22', '2021-05-01');
        doneValue = Number(temp.times) / Number(allDay) * 100;
        console.log('alll',typeof(temp.times), typeof(allDay), doneValue);
        let option = {
          title: {
            text: doneValue + '%',//主标题文本
          },
          series: [
            {
              data: [
                { value: doneValue, name: '已经打卡' },
                { value: 100, name: '没有打卡' }
              ]
            }
          ]
        };
        chart.setOption(option);
      })
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
   * 日期相差
   */
  differDay: function (dayA, dayB) {
    var day1 = new Date(dayA);
    var day2 = new Date(dayB);
    var differDay = Math.abs(day1 - day2) / 1000 / 60 / 60 / 24;
    console.log('DDDDDDDD', differDay);
    return differDay;
  },

})