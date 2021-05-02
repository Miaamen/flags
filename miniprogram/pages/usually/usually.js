let usedList = [
  {
    type: 'flower',
    text: '浇花'
  },
  {
    type: 'getup',
    text: '早起'
  },
  {
    type: 'ball',
    text: '打球'
  },
  {
    type: 'breakfast',
    text: '吃早餐'
  },
  {
    type: 'stopsmoking',
    text: '戒烟'
  },
  {
    type: 'contect',
    text: '问好父母'
  },
  {
    type: 'key',
    text: '带钥匙'
  },
  {
    type: 'dog',
    text: '遛狗'
  },
  {
    type: 'cooking',
    text: '练习厨艺'
  },
  {
    type: 'makeup',
    text: '化妆'
  },
  {
    type: 'cat',
    text: '梳毛'
  },
  {
    type: 'feeding',
    text: '喂奶'
  },
  {
    type: 'writer',
    text: '写作'
  },
  {
    type: 'idea',
    text: '反思自己'
  },
  {
    type: 'painter',
    text: '画画'
  },
  {
    type: 'apple',
    text: '吃水果'
  },
  {
    type: 'money',
    text: '记账'
  },
  {
    type: 'grinning',
    text: '刷牙'
  },
  {
    type: 'flushed',
    text: '转眼'
  },
  {
    type: 'bin',
    text: '垃圾分类'
  }
]

// pages/usually/usually.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usedList: usedList
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

  userCreate: function () {
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
  addUsuallyFlag: function (e) {
    const type = e.currentTarget.dataset.item.type;
    const title = e.currentTarget.dataset.item.text;
    
  }
})