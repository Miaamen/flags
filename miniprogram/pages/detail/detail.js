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
  console.log(width, height, canvas)
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}
// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentList: {},
    ec: {
      onInit: initChart
    }
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
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      id = data.datasetId
    })

    const flags = wx.cloud.database().collection('flags');
    const _this = this;
    flags.doc(id).get({
      success: function (res) {
        _this.setData({
          currentList: res.data
        })
        wx.hideLoading()
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

  }
})