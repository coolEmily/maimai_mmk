/**
 * Created by liuhh on 2016/5/20.
 */
define(function(require){
    window.jiathis_config = {};
    var $ = require('zepto');

        function  wapShare(){
            this.isLoad = false;
        }
        wapShare.prototype.setting = jiathis_config;
        wapShare.prototype.loadScript = function(){
            //基于.fixed的修改 微信到wap分享
            $(".fixed").off().on("tap", function(e){
                var target = e.srcElement ? e.srcElement : e.target;
                if(target.className.indexOf("fixed") != -1){
                    $(".fixed").hide();
                }
            });
            if(this.isLoad) return;
            $("div.fixed").css("background-color","rgba(3,3,3,0.2)");
            $("div.fixed").css("opacity","1");
            $("div.fixed").empty().append('<!-- JiaThis Button BEGIN -->' +
                '<div class="share" style="position:fixed;bottom: 0;left:0;width:100%;height:60px;z-index：99;overflow:hidden;background-color:white;">' +
                '<div class="jiathis_style_m" style="margin:10px auto;"></div></div><!-- JiaThis Button END -->');
            var body=document.getElementsByTagName('body').item(0),
                script=document.createElement('script');
                script.src='http://v3.jiathis.com/code/jiathis_m.js';
                script.type='text/javascript';
                script.defer=true;
            body.appendChild(script);
            this.isLoad = true;
        };
        return wapShare;

});

