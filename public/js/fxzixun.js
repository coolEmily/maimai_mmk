/**
 * Created by liuhh on 2016/5/27.
 */
require.config({baseUrl:"/js/lib"});
require(['zepto','lib'],function($,libjs){
    var lib = new libjs(),
        pageNo = 0,
        pageSize = 10,
        isAll = false,
        reqUrl = lib.getReq();

    $(function(){
        getMaterialPage();
        initEvent();
        roll();

        function initEvent(){
            $(document).on('tap',".button",function(){
                shareToPlatform($(this).attr("mediaId"),$(this).attr("thumbMediaId"));
            });
        }
        function getMaterialPage(){
            lib.ajx(reqUrl.ser+ '/material/getMaterialPage.action',{pageNo:pageNo,pageSize:pageSize},function(data){
                if(data.infocode == "0"){
                    var appendHtml = '';
                    if(pageNo == 1){
                        $("#ziliao").empty();
                    }
                    if(data.info.length < pageSize)
                        isAll = true;
                    else
                        isAll = false;

                    for(var i =0; i< data.info.length; i++){
                        var tmpHtml = '<div class="zl_box"><div class="ziliao1"><div class="ziliao1_l"><img src='+data.info[i].picUrl+'/></div>'+
                            '<div class="ziliao1_r">'+data.info[i].title+'</div></div>' +
                            '<div class="button" mediaId="'+
                            data.info[i].mediaId +'" thumbMediaId="'+data.info[i].thumbMediaId +
                            '" >分享到公众号</div></div>';
                        appendHtml += tmpHtml;
                    }
                    $("#ziliao").append(appendHtml);
                }
                else if(data.infocode == "2"){
                    alert("页面大小和起始页不能为空");
                }
                else{
                    alert("获取数据异常");
                }
            },function(){alert("获取资讯分享列表失败");} );
        }

        function shareToPlatform(mediaId,thumbMediaId){
            lib.ajx(reqUrl.ser+ '/material/shareToPlatform.action',{mediaId:mediaId,thumbMediaId:thumbMediaId},function(data){
                if(data.infocode == "2"){
                    alert(data.info);
                    location = '/login/denglu.html?'+ lib.getBackUrl();
                }
                else if(data.infocode == "5"){
                    alert(data.info);
                    getAuthAddr();
                }
                else{
                    alert(data.info);
                }
            },function(){alert("分享到公众号失败");} );
        }
        function getAuthAddr(){
            location.href = reqUrl.ser+ '/material/getAuthAddr.action';
        }
        function roll(){
            $(window).scroll(function (){
                if(!isAll && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    pageNo++;
                    getMaterialPage();
                }
            });
        }
    });
});