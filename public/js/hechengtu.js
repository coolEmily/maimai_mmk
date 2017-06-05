/**
 * Created by liuhh on 2016/6/28.
 */
require.config({baseUrl:"/js/lib"});
require(['zepto','lib'],function($,lib) {
        lib = new lib();
    var reqUrl = lib.getReq();
        //mergeUrl = 'http://192.168.0.29:8080/mmk_image/';
    $(function(){
        if(lib.getUrlParam("imgUrl").trim() === ""){
            alert("参数有误");
        }else{
            var imgUrl = reqUrl.imgPath+ lib.getUrlParam("imgUrl");
            $('#qrImg').attr('src',imgUrl);
        }
    });
    }
);
