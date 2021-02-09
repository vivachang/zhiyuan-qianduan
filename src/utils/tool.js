import ajaxUrl from '@/ajaxUrl/index.js'
import axios from 'axios';
import Qs from 'qs'
// let OSS = require('ali-oss');
// var OSSconfig={         //阿里 OSS 验证参数
//     Region: 'oss-cn-shenzhen',
//     BucketName: 'dexunzhenggu',
//     AccessKeyId:"",
//     AccessKeySecret:"",
//     SecurityToken:""
// }
export function getNameByOptions(num, options) {
    if (options instanceof Array) {
        let name = '';
        num = parseInt(num);
        options.some(item => {
            if (item.value === num) {
                name = item.label;
            }
        });
        return name;
    } else {
        return options[num];
    }
}

// 解析?后的参数(包含query、hash)
export function urlParamsParse(param) {
    let paramsStr;
    let params = {};
    try {
        paramsStr = location.href.split('?').slice(-1)[0].split('&');
    } catch (error) {
        return '';
    }
    paramsStr.reduce((total, item) => {
        const it = item.split('=');

        total[it[0]] = it[1];
        return total;
    }, params);

    if (param) {
        return params[param];
    } else {
        return params;
    }
}
// 格式化数据大小
export function formatDataSize(size) {
    const format = (num) => {
        if (num / parseInt(num) === 1) {
            return num;
        } else {
            const decimalLength = num.toString().split('.')[1].length;
            return num.toFixed(decimalLength > 3 ? 3 : decimalLength);
        }
    };
    if (size / 1024 / 1024 < 1) {
        return format(size / 1024) + 'KB';
    } else {
        return format(size / 1024 / 1024) + 'MB';
    }
};

//拖动dom元素
export function moveDom(el) {
    var parent = el.parentNode,     //容器
        defaultX = 0,       //圆点的初始位置-X坐标
        defaultY = 0,       //圆点的初始位置-Y坐标
        boxWidth = 0,       //容器宽度
        boxHeight = 0;      //容器高度
    el.onmousedown = function (e) {

        var startX = e.clientX,      // 鼠标按下时的位置-X坐标
            startY = e.clientY,      // 鼠标按下时的位置-Y坐标
            maxX = 0,                //圆点可移动的最大位置-X坐标
            maxY = 0;                //圆点可移动的最大位置-Y坐标
        //确保图片加载出来后再获取容器宽高
        boxWidth = parent.clientWidth;
        boxHeight = parent.clientHeight;
        // 圆点最大移动范围为 容器宽度/高度 - 圆点宽度/高度
        maxX = boxWidth - el.clientWidth;
        maxY = boxHeight - el.clientHeight;
        // 鼠标按下  获取圆点当前位置
        defaultX = el.offsetLeft;
        defaultY = el.offsetTop;
        document.onmousemove = function (e) {
            el.style.left = (defaultX + e.clientX - startX) + 'px';
            el.style.top = (defaultY + e.clientY - startY) + 'px';
            // 限制圆点范围，超出后初始化
            if (el.offsetLeft < 0) {
                el.style.left = '0px';
            }
            if (el.offsetTop < 0) {
                el.style.top = '0px';
            }
            if (el.offsetLeft >= maxX) {
                el.style.left = maxX + 'px';
            }
            if (el.offsetTop > maxY) {
                el.style.top = maxY + 'px';
            }
        }
    }
    document.onmouseup = function (e) {
        document.onmousemove = null;
    }
};
//获取元素相对于 已定位祖先元素的位置(转换成百分比后返回)
export function getDomCoordinates(el) {
    var parent = el.parentNode;
    return {
        left: ((el.offsetLeft / parent.clientWidth) * 100).toFixed(2) + '%',
        top: ((el.offsetTop / parent.clientHeight) * 100).toFixed(2) + '%'
    }
}
// 全屏
export function fullScreen() {
    var el = document.documentElement,
        rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
        wscript;

    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
            wscript.SendKeys("{F11}");
        }
    }
}
//退出全屏
export function exitFullScreen() {
    var el = document,
        cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
        wscript;

    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
        return;
    }

    if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}

// 上传文件到服务器
export function uploadFile(file, type = 0) {
    const data = new FormData();
    data.append('file', file);
    data.append('type', type);
    return new Promise((resolve, reject) => {
        axios.post(ajaxUrl.uploadFile, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            console.log(err);
            alert('上传文件错误');
            reject(err);
        });
    });
}

// 权限路由筛选
export function filterRouter(allRouter, roleList) {
    // let mockAllRouter = JSON.parse(JSON.stringify(allRouter));
    let result = allRouter.filter((itemRouter, index) => {
        if (itemRouter.children) {
            let childResult = itemRouter.children.filter((childItem, idx) => {
                if (childItem.meta.role) {
                    let hasItemRole = childItem.meta.role.some((itemRole) => {
                        return roleList.includes(itemRole);
                    });
                    if (hasItemRole) {
                        return childItem
                    }
                } else {
                    return childItem
                }
            });
            if (childResult.length > 0) {
                itemRouter.children = childResult;
                return itemRouter;
            }
        } else {
            return itemRouter
        }
    })
    return result
}

// 导出文件流
export function exportFile(url, data) {
    return axios({
        method: 'get',
        url: url,
        params: data,
        responseType: 'blob',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });
}
// 创建折线图数据(将后台返回的数据格式转换成 折线图所需的数据格式) 

// 单个监测点，可展示多个维度(如 甲醛/温度等)数据 -- 按百分比展示
export function recomDataChooseTypes(chartFilter, allDatas, markLine) { //需要展示的维度、所有数据
    let config = {
        xAxis: [],
        minY: 0.01,
        series: [],
        legend: []
    };
    let checkObj = {
        formaldehyde: '甲醛',
        PM25: 'PM2.5',
        TVOC: 'TVOC',
        CO2: 'CO2',
        temperature: '温度',
        humidity: '湿度'
    };
    let maxData = {
        formaldehyde: 0.1,
        PM25: 75,
        TVOC: 0.6,
        CO2: 1000,
        temperature: 60,
        humidity: 32
    }
    chartFilter.map((chartItem) => {
        let _name = checkObj[chartItem], dataItems = [];
        config.legend.push(_name);
        // let mockData = [];
        allDatas.map((item) => {
            if (chartFilter.length > 1) {
                // 按百分比展示
                dataItems.push((item[chartItem] / maxData[chartItem]).toFixed(3))
            } else {
                dataItems.push(item[chartItem])
            }
            // if(chartItem==='temperature'){
            //     // mockData.push(item[chartItem]);
            //     dataItems.push((item[chartItem] / maxData[chartItem]).toFixed(3)*100)
            // }else{
            //     dataItems.push((item[chartItem] / maxData[chartItem]).toFixed(3)*100)
            // }
        });
        let _series = {};
        if (chartItem === 'formaldehyde' || chartItem === 'TVOC') {       //如果是甲醛或者tovc  则展示参考线
            _series = {
                name: _name,
                type: 'line',
                data: dataItems,
                markLine: {
                    symbol: 'none',
                    silent: true,
                    label: {
                        show: true,
                        position: chartItem === 'formaldehyde' ? 'start' : 'end',
                        distance: 3,
                        formatter: function (params) {
                            if (chartFilter.length > 1) {
                                if (chartItem === 'formaldehyde') {
                                    return `${checkObj[params.name]}参考线：${(params.value * maxData[chartItem]).toFixed(3)}`
                                } else {
                                    return `${checkObj[params.name]}参考线：${(params.value * maxData[chartItem]).toFixed(3)}`
                                }

                            } else {
                                return `${checkObj[params.name]}参考线：${params.value}`
                            }
                        }
                    },
                    lineStyle: {
                        color: '#ddab53',
                        width: 2,
                    },
                    data: [
                        {
                            yAxis: chartFilter.length > 1 ? markLine[chartItem] / maxData[chartItem] : markLine[chartItem],
                            name: chartItem
                        }
                    ]
                }
            };
            if (chartFilter.length > 1) {
                config.minY = markLine[chartItem] / maxData[chartItem];
            } else {
                config.minY = markLine[chartItem];
            }
        } else {
            _series = { name: _name, type: 'line', data: dataItems };
        }
        config.series.push(_series);
        // console.log(mockData,dataItems)
    });


    allDatas.map((item) => {
        config.xAxis.push(item.timestamp);
    });
    return config

};
// 任意个数监测点，可根据 维度 切换展示(仅显示一个维度) 数据
export function recomDataChangeTypes(type, idList, dataList) { //维度、监测点id列表、监测点数据列表(二维数组--与监测点id列表对应)
    let config = {
        xAxis: [],
        series: [],
        legend: []
    },
        maxItem = {
            length: 0,
            idx: 0
        },
        lengthList = [];

    dataList.map((dataItem, idx) => {
        config.legend.push(idList[idx]);
        if (maxItem.length < dataItem.length) {
            maxItem.length = dataItem.length;
            maxItem.idx = idx;
        }
        lengthList.push(dataItem.length);
    });
    config.legend.map((item, idx) => {
        let responseItem = dataList[idx].map((resItem) => { return resItem[type] });
        config.series.push({ name: item, type: 'line', data: [] });
        // if(responseItem.length < maxItem.length){
        //     let diffLength = maxItem.length-responseItem.length;
        //     let fillArr = new Array(diffLength).fill('0');
        //     responseItem = [...fillArr,...responseItem]
        // };
        config.series[idx].data = responseItem;
    });
    let xAxisList = [];
    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].length != 0) {
            xAxisList = dataList[i];
            break;
        }
    }
    config.xAxis = xAxisList.map((item) => { return item.timestamp });
    return config;
}