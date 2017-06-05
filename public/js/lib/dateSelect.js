define(function(require){
    var $ = require("jquery");
    require("mobiscroll");
    var initDate = function(dateForm){
        var currYear = (new Date()).getFullYear();  
        var opt={};
        opt.date = {preset : 'date'};
        opt.datetime = {preset : 'datetime'};
        opt.time = {preset : 'time'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式 
            mode: 'scroller', //日期选择模式
            dateFormat: dateForm ? dateForm : "yyyy-mm-dd",
            lang: 'zh',
            showNow: true,
            nowText: "今天",
            startYear: currYear, //开始年份
            endYear: currYear + 100 //结束年份
        };
    
        $('input[class="ui-date"]').mobiscroll($.extend(opt['date'], opt['default']));
    };
    return initDate;
});
