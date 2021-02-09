export default {
    checkUsername(rule, value, callback){   //验证用户名 -- 只支持字母、字母和数字组合，首位必须为字母
        let reg =  /^[a-zA-Z][a-zA-Z0-9]+$/;
        if(!reg.test(value)){
            callback(new Error('只支持字母、字母和数字组合，首位必须为字母'))
        }else if(value.length<6 || value.length>20){
            callback(new Error('最小6位，最大20位'));
        }else{
            callback();
        }
    },
    checkPassword(rule, value, callback){   //
        let reg = /^[a-zA-Z0-9]{6,20}$/;
        if(!reg.test(value)){
            callback(new Error('密码只能是数字、字母,长度在6-20之间'));
        }else{
            callback();
        }
    },
    checkNumber(rule, value, callback){     //验证数字
        if(value !== ""){
            if(isNaN(value)){
                callback(new Error("只能为数字"));
                return false;
            }else{
                callback();
                return true;
            }
        }
    },
    checkMoney(rule, value, callback){   //验证价格 -- 只能是数字，且小数点后边不能超过两位数
        let str = String(value).split('.')[1] || '';
        if(isNaN(value)){
            callback(new Error("请输入正确的价格"))
        }else if(str.length > 2){
            callback(new Error("小数点后最多两位"))
        }else{
            callback()
        }
    },
    checkCode(rule, value, callback){       //验证字母
        if(value == ""){
            callback(new Error('请输入分类code'));
        }else{
            var _reg = new RegExp("^[a-zA-Z]+$");
            if(!_reg.test(value)){
                callback(new Error('分类code只能为字母'));
            }else{
                callback();
            }
        }
    },
    checkPhone(rule, value, callback){      //验证手机号码
        if(value !== ""){
            let _reg = new RegExp("^[1][0-9]{10}$");
            if(!_reg.test(value)){
                callback(new Error("请输入合规的手机号码"))
            }else{
                callback()
            }
        }
    },
    // 验证汉字
    checkChinese(rule, value, callback) {
        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
            callback(new Error('只能是中文'));
        } else {
            callback();
        }
    },
    notSymbol(rule,value,callback){
        let _reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        if(!_reg.test(value)){
            callback(new Error("只能输入汉字、数字、大小写字母"))
        }else{
            callback()
        }
    },
    // 匹配文章 包含汉字、中文标点符号
    checkText(rule, value, callback) {
        if (/[\u4e00-\u9fa5]/.text(value)) {
            callback();
        } else {
            callback(new Error('只能包含汉字、中文标点符号'));
        }
    },
    // 甲醛 数值范围 0.000 - 0.300  三位小数
    checkFormaldehyde(rule, value, callback){
        let str = String(value).split('.')[1] || '';
        if(value > 0.3 || value < 0){
            callback(new Error('最大0.3，最小0'));
        }else if(str.length > 3){
            callback(new Error('小数点后最多3位'));
        }else{
            callback();
        }
    },
    // 甲醛 数值范围 0.000 - 0.300  
    _checkFormaldehyde(rule, value, callback){
        let str = String(value).split('.')[1] || '';
        if(value > 0.3 || value < 0){
            callback(new Error('最大0.3，最小0'));
        }else{
            callback();
        }
    },
    // TOVC 数值范围 0.000 - 1.000  三位小数
    checkTVOC(rule, value, callback){
        let str = String(value).split('.')[1] || '';
        if(value > 1 || value < 0){
            callback(new Error('最大 1，最小 0'));
        }else if(str.length > 3){
            callback(new Error('小数点后最多3位'));
        }else{
            callback();
        }
    },
    // TOVC 数值范围 0.000 - 1.000  三位小数
    _checkTVOC(rule, value, callback){
        let str = String(value).split('.')[1] || '';
        if(value > 1 || value < 0){
            callback(new Error('最大 1，最小 0'));
        }else{
            callback();
        }
    },
    // PM2.5 数值范围 0.000 - 100.000  三位小数
    checkPM25(rule, value, callback){
        let str = String(value).split('.')[1] || '';
        if(value > 100 || value < 0){
            callback(new Error('最大 100，最小 0'));
        }else{
            callback();
        }
    },
    // CO2 数值范围 0.00 - 1500.00  两位小数
    checkCO2(rule, value, callback){
        let str = String(value).split('.')[1] || '';
        if(value > 1500 || value < 0){
            callback(new Error('最大 100，最小 0'));
        }else{
            callback();
        }
    },
    // 温度 数值范围 -50.0 - 50.0  一位小数
    checkTemperature(rule, value, callback){
        let str = String(value).split('.')[1] || '';
        if(value > 50 || value < -50){
            callback(new Error('最大 50，最小 -50'));
        }else{
            callback();
        }
    },
    // 湿度 数值范围 0 - 100  整数
    checkHumidity(rule, value, callback){
        let str = String(value).split('.')[1] || '';
        if(value > 100 || value < 0){
            callback(new Error('最大 100，最小 0'));
        }else if(str.length > 0){
            callback(new Error('只能为整数'));
        }else{
            callback();
        }
    },
    checkDecimal(value){
        let str = String(value).split('.')[1] || '';
        if(isNaN(value)){
            return false
        }else if(str.length > 2){
            return false
        }else{
            return true
        }
    }
}