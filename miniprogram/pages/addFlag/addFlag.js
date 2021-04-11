// pages/addFlag/addFlag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    type: '',
    viewId: 0,
    nowDateString: '',
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowDate = new Date();
    var year = nowDate.getFullYear(), month = nowDate.getMonth() + 1, day = nowDate.getDate();
    this.setData({
      nowDateString: `${year}-${month}-${day}`,
      date: `${year}-${month}-${day}`
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

  },
  changeValue: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  selectType: function (e) {
    console.log('eeee', e);
    this.setData({
      viewId: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.type
    })
    console.log('hhh', this.data.viewId);
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  addFlag: function () {
    new Promise((resolve, reject) => {
      const date = new Date().toLocaleDateString();
      console.log('datedate', date);
      const flags = wx.cloud.database().collection('flags');
      flags.add({
        data: {
          name: this.data.title,
          type: this.data.type ? this.data.type : 'study',
          deadline: this.data.date,
          done: false,
          times: 0,
          startDate: date
        }
      })
      resolve();
    }).then(() => {
      wx.navigateBack({
        delta: 1
      })
    });
  }
})