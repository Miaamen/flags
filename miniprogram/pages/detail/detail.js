import * as echarts from "../../ec-canvas/echarts"

let doneValue = 0;
let waitValue = 100;
var option = {
  title: {
    text: doneValue + '%',//主标题文本
    left: 'center',
    top: 'center',
    textStyle: {
      fontSize: 16,
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

var date = new Date();
var curYear = date.getFullYear();

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
    cellList: [arr31, arr28, arr31, arr30, arr31, arr30, arr31, arr31, arr30, arr31, arr30, arr31],
    year: curYear
  },

  watch: {
    cellList() {
      console.log('cellList change')
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
    const _this = this;
    let temp = {};
    new Promise((resolve, reject) => {
      console.log('proporporp');
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        id = data.datasetId;
        console.log('jjjahhaha::::', data, data.datasetId)
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
            temp = res.data;
            resolve();
          }
        });
      }).then(() => {
        console.log('uuquququ:', this.data.currentList, this.data.currentList.type)
        this.dateCell(this.data.currentList.flagTime);
        const allDay = _this.differDay(this.data.currentList.startDate, this.data.currentList.deadline);
        doneValue = (Number(temp.times) / Number(allDay) * 100).toFixed(2);
        console.log('alll',temp.times, allDay, doneValue);
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
        wx.hideLoading();
      })
      .catch(() => {
        wx.hideLoading();
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
    const temp1 = (dayA + '').substring(0, 4) + '-' + (dayA + '').substring(4, 6) + '-' + (dayA + '').substring(6); 
    const temp2 = (dayB + '').substring(0, 4) + '-' + (dayB + '').substring(4, 6) + '-' + (dayB + '').substring(6); 
    var day1 = new Date(temp1);
    var day2 = new Date(temp2);
    var differDay = Math.abs(day1 - day2) / 1000 / 60 / 60 / 24;
    console.log('DDDDDDDD', differDay);
    return differDay;
  },

  /**
   * 日期打卡可视化
   */
  dateCell: function(list) {
    console.log('dateCell::', list);
    let tempArr = this.data.cellList;
    list.forEach(item => {
      if(item.date.substring(0, 4) == curYear) {
        const month = Number(item.date.substring(5, 7));
        const day = Number(item.date.substring(8));
        console.log('monthandday', month, day);
        tempArr[month - 1][day - 1] = 2;
        this.setData({
          cellList: tempArr
        })
        
        console.log('this.sash:', this.data.cellList);
      }
    })
  }

})