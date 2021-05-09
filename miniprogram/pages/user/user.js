var db_util = require('../../utils/util.js');

// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  getUserInfo: function (e) {
    console.log('e.detail.nickName', e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)
    let userInfo = {
      name: e.detail.userInfo.nickName,
      img: e.detail.userInfo.avatarUrl,
      openid: ''
    }
    console.log(e, e.detail)
    
    new Promise((resolve, reject) => {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          userInfo.openid = res.result.openid;
          console.log('[云函数] [login] user openid: ', res, res.result.openid);
          wx.setStorage({
            key: 'userInfo',
            data: userInfo,
          });
          resolve()
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    })
    .then(() => {
      wx.switchTab({
        url: '../flags/flags',
        events: {},
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          console.log('sssuuusss')
        },
        fail: function (err) {
          console.log('aasssuuusss')
        }
      })
    })
    
  }
})