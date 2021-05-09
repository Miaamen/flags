const db = wx.cloud.database();

/**
 * 每日更新状态
 */
function changeFlag(_this) {
  const flags = db.collection('flags');
  console.log('flagsflagsflags:', flags);
  flags.get({
    success(res) {
      _this.setData({
        flagList: res.data
      })
      wx.hideLoading();
    }
  })
}

/** 
 * 时间戳转日期 格式2017-01-20 00:00:00
 */
function getLocalTime(ns, flag) {
  //needTime是整数，否则要parseInt转换  
  var time = new Date(parseInt(ns) * 1); //根据情况*1000
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  if(flag === 'date') {
    return y + '-' + add0(m) + '-' + add0(d);
  } else {
    return add0(h) + ':' + add0(mm);
  }
}

/** 
 * 日期 格式2017-01-20
 */
function getTimeString(y, m, d) {
  return y + '-' + add0(m) + '-' + add0(d);
}

/**
 * 小于10的补零操作
 */
function add0(m) {
  return m < 10 ? '0' + m : m;
}

/**
 * 2020-01-01 转为时间戳
 */
function toDate(date) {
  date = date.replace(/-/g, '/');
  let time = new Date(date);
  return time;
}

/**
 * 2020-01-01 转为时间戳
 */
function toNumberDate(date) {
  date = date.replace(/-/g, '');
  return date;
}

/**
 * 获取今天和前七天的日期
 */
function getSevent() {
  var date1 = getLocalTime(new Date().getTime(), 'date');
  var date2 = getLocalTime(new Date().getTime() - (7 * 24 * 60 * 60 * 1000), 'date');
  return toNumberDate(date2) + '~' + toNumberDate(date1);
}

/**
 * 看两个日期相差多少天
 */
function howDate(date1, date2) {
  // date1 = date1.substring(0, 4) + '-' + date1.substring(4, 6) + '-' + date1.substring(6);
  // date2 = date2.substring(0, 4) + '-' + date2.substring(4, 6) + '-' + date2.substring(6);
  var temp1 = new Date(date1).getTime();
  var temp2 = new Date(date2).getTime();
  console.log(date1, date2)
  return (temp1 - temp2) / (24 * 60 * 60 * 1000);
}

function getUserProfile() {
  console.log(12344321)
  wx.getUserProfile({
    desc: '用于完善个人资料',
    success: function (res) {
      var userInfo = res.userInfo
      // console.log('userInfo==>', userInfo)
      wx.setStorageSync('storage_info', userInfo);//本地标记
    },
    fail() {
      console.log("用户拒绝授权")
    }
  })
}

// 通过module.exports方式提供给外部调用
module.exports = {
  getLocalTime: getLocalTime,
  getTimeString: getTimeString,
  toDate: toDate,
  toNumberDate: toNumberDate,
  changeFlag: changeFlag,
  add0: add0,
  getSevent: getSevent,
  howDate: howDate,
  getUserProfile: getUserProfile
}



    // "pages/flags/flags",
    // "pages/note/note",

    // "pages/addFlag/addFlag",
    // "pages/detail/detail",

// "tabBar": {
//   "color": "#bfbfbf",
//     "selectedColor": "#be8dbd",
//       "borderStyle": "black",
//         "list": [
//           {
//             "selectedIconPath": "images/flagselect.png",
//             "iconPath": "images/flag.png",
//             "pagePath": "pages/flags/flags",
//             "text": "Flag"
//           },
//           {
//             "selectedIconPath": "images/noteselect.png",
//             "iconPath": "images/note.png",
//             "pagePath": "pages/note/note",
//             "text": "记录"
//           },
//           {
//             "selectedIconPath": "images/myselect.png",
//             "iconPath": "images/my.png",
//             "pagePath": "pages/my/my",
//             "text": "我的"
//           }
//         ]
// }