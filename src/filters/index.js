export function timeShow(date){
    let _date = new Date(date);
    let _year = _date.getFullYear();
    let _month = ("0" + (_date.getMonth()+1)).slice(-2);
    let _day = ("0"+_date.getDate()).slice(-2);
    let _hour = ("0"+_date.getHours()).slice(-2);
    let _minute = ("0" + _date.getMinutes()).slice(-2);
    let _second = ("0" + _date.getSeconds()).slice(-2);
    
    let nowTime = new Date();
    let criticality = nowTime.getFullYear() + "-" + (nowTime.getMonth()+1) + "-" + nowTime.getDate() + " 00:00:00";
    let _time = +new Date(criticality);
    if(date >= _time){
        return '今天  ' + _hour + ":" + _minute + ":" + _second
    }else if(date < _time && date > _time-60*60*24*1000){
        return '昨天  ' + _hour + ":" + _minute + ":" + _second
    }else{
        return _year + "-" + _month + "-" + _day + " " + _hour + ":" + _minute + ":" + _second
    }
}

export function formatDate(date, fmt) {
    if (!date) {
      return '';
    }
  
    let _date = new Date(date);
    fmt  = fmt ? fmt : 'yyyy-MM-dd hh:mm:ss';
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': _date.getMonth() + 1,
        'd+': _date.getDate(),
        'h+': _date.getHours(),
        'm+': _date.getMinutes(),
        's+': _date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

export function formatPrice(price,type){
    let rex = /\d{1,3}(?=(\d{3})+$)/g;
    if(!price){
        return 0
    }
    if(type === 'none'){
        return String(price).replace(/^(-?)(\d+)((\.\d+)?)$/, function (s, s1, s2, s3) {
            return s1 + s2.replace(rex, '$&,') + s3;
          })
    }else{
        return String(price).replace(/^(-?)(\d+)((\.\d+)?)$/, function (s, s1, s2, s3) {
            return '￥' + s1 + s2.replace(rex, '$&,') + s3;
          })
    }
};
export function formatNum(num){
    let rex = /\d{1,3}(?=(\d{3})+$)/g;
    return String(num).replace(/^(-?)(\d+)$/, function (s, s1, s2) {
        return s1 + s2.replace(rex, '$&,');
      })
};
function padLeftZero(str) {
return ('00' + str).substr(str.length);
}