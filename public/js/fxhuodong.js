/**
 * Created by liuhh on 2016/6/27.
 */
require.config({baseUrl:"/js/lib", urlArgs: "v0.0.1"});
require(['zepto','lib','newShare','wapshare'],function($,lib,newShare,wapshare){
    lib = new lib();
    wapshare  = new wapshare();
    var reqUrl = lib.getReq(),
        mId = $.cookie('member_memberId')?$.cookie('member_memberId'):"",
        mergeUrl = reqUrl.image+'/makePrintImg';
    $(function(){
        newShare = new newShare(getAllFreeSaleList);
        initEvent();

        function initEvent(){
            //单选
            $(document).on("tap","#pocket_pic > li",function(){
                $(this).addClass("cur").siblings().removeClass("cur");
                initWXShare($(this));
            });

            //二维码
            $("#createQR").on("click",function(){
                var acTarget = $('#pocket_pic > li.cur');
                if(!acTarget){
                    alert("无活动可生成");
                    return;
                }
                var gflag = acTarget.attr('gflag');

                if(gflag === "0"){
                    console.log(acTarget.attr('mImg'));
                    lib.onLoading();
                    getMergedPic(acTarget.attr('activeId'),acTarget.attr('mImg'),reqUrl.ser+'lingyuangou.html?acId='+acTarget.attr('activeId')+'&gId='+acTarget.attr('mainGoodsId')+'&mId='+mId);

                }else{
                    window.location = '/share/hechengtu.html?imgUrl='+acTarget.attr('mImg');
                }
            });

            //点击分享
            $("#shareBtn").on("tap",function(){
                var curLi=$("#pocket_pic li.cur");
                if(!curLi.length){
                    alert("无活动可分享");
                    return;
                }
                $("#fixed").css('display','block');
            });

            $("#fixed").on("tap", function (e) {

                if(lib.checkWeiXin())
                    $("#fixed").css('display','none');
                else{
                    var target = e.srcElement ? e.srcElement : e.target;
                    if(target.className.indexOf("fixed") != -1){
                        $("#fixed").hide();
                    }
                }
            });
        }
        function getAllFreeSaleList(){
            lib.ajx(reqUrl.ser+ '/freeSale/getAllFreeSaleList.action',{},function(data){
                if(data.infocode == "0"){
                    var appendHtml = '',
                        dataList = data.info;
                    for(var i =0; i< dataList.length; i++){
                        var tmpHtml = '<li mainGoodsId='+dataList[i].mainGoodsId+' activeId='+dataList[i].freeSaleId+
                            ' title='+dataList[i].flashSaleName+
                            ' dMsg="'+dataList[i].descMsg+
                            '" gFlag='+dataList[i].generateFlag+
                            ' mImg="'+dataList[i].memberImg+
                            '" dImg="'+dataList[i].descImg+
                            '" >' +
                            '<img src="'+reqUrl.imgPath+dataList[i].bannerImg+'" alt=""/>' +
                            '</li>';
                        appendHtml += tmpHtml;
                    }
                    $("#pocket_pic").append(appendHtml);
                    $("#pocket_pic li").eq(0).addClass("cur");
                    initWXShare($("#pocket_pic li").eq(0));
                }
                else if(data.infocode == "1") {
                    alert("登录超时 ");
                    window.location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                }
                else if(data.infocode == "2"){
                    alert("请设置默认底图");
                }
                else if(data.infocode == "3"){
                    alert("没有0元购活动");
                }else{
                    alert("系统错误");
                }
            },function(){alert("获取零元购活动列表失败");} );
        }

        function uploadForFreeSaleMemberImg(acId,imgPath){
            lib.ajx(reqUrl.ser+ '/freeSale/uploadForFreeSaleMemberImg.action',{freeSaleId:acId,imgPath:imgPath},function(data){
                if(data.infocode == "0"){
                    window.location = '/share/hechengtu.html?imgUrl='+imgPath;
                }
                else if(data.infocode == "1") {
                    alert("登录超时 ");
                    window.location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                }
                else if(data.infocode == "2"){
                    alert("参数有误");
                }
                else{
                    alert("系统错误");
                }
            },function(){alert("上传生成的图片失败");} );
        }

        function getMergedPic(acId,descUrl,qrUrl){
            $.ajax({
                type: "post",
                async: true,
                url: mergeUrl,
                data: {descUrl:descUrl,qrUrl:qrUrl},
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                dataType: "json",
                success: function (d) {
                    //console.log(d.path);
                    lib.offLoading();
                    uploadForFreeSaleMemberImg(acId, d.path);
                },
                error: function (e) {
                    alert("生成图片出错");
                    lib.offLoading();
                }
            });
        }

        //分享函数
        function initWXShare(obj){
            var objId=obj.attr("activeid"),
                goodsId = obj.attr("mainGoodsId");
            if(lib.checkWeiXin()){
                dataForWeixin.imgUrl = reqUrl.imgPath +$(obj).attr("dImg");
                dataForWeixin.title = "零元购 - 无需砍价既订即得|买买";
                dataForWeixin.desc =  "全新零元购物体验，无需砍价，既订即得";
                dataForWeixin.link =location.protocol+ '//' +location.host+'/buyer/lingyuangou.html?acId='+objId+'&gId='+goodsId+'&mId='+mId;
                newShare.shareConfig();
            }else{
                wapshare.setting.pic = reqUrl.imgPath+$(obj).attr("dImg");
                wapshare.setting.title ="零元购 - 无需砍价既订即得|买买";
                wapshare.setting.summary = "全新零元购物体验，无需砍价，既订即得";
                wapshare.setting.url =location.protocol+ '//' +location.host+'/buyer/lingyuangou.html?acId='+objId+'&gId='+goodsId+'&mId='+mId;
                wapshare.loadScript();
            }
        }
    });
});