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
    showCalen: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log('helloonshow');
    const flags = wx.cloud.database().collection('flags');
    const _this = this;
    wx.showLoading({
      title: '加载中',
    })
    flags.get({
      success(res) {
        _this.setData({
          flagList: res.data
        })
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
    this.setData({
      showCalen: true
    })
  },

  addFlag: function () {
    console.log('hello');
    wx.navigateTo({
      url: '../addFlag/addFlag',
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
    if(!e.currentTarget.dataset.done) {
      flags.doc(id).update({
        data: {
          done: true,
          times: _.inc(1)
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
    wx.navigateTo({
      url: '../detail/detail',
      events: {},
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { datasetId: e.currentTarget.dataset.id })
      }
    })
  }
})