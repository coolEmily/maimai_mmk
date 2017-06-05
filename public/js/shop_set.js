require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "uploadImg"], function($, lib ,uploadImg){
    uploadImg();
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var shopSet = {};
    $.extend(shopSet, {
        init: function(){
            var _t = this;
            _t.getShopInfo();
            _t.saveShopInfo();
            _t.inputOnFoucs();
            
            $(document).on("touchend", ".ui-delete-image-button", function(e){
               e.preventDefault();
               $(this).parent().children("div").remove();
               $(this).parent().removeClass("ui-wc");
            });
        },
        getShopInfo: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "/member/getMemberStoreInfo.action", {}, function(data){
                if(data.infocode === '0'){
                    var info = data.info;
                    var h ="";
                    if(info.list_memberGoods.length === 0){
                        _t.goodsBaseListInfo();
                    }else{
                        $.each(info.list_memberGoods, function(k, v){
                            h += '<option value="'+ v.goodsId +'">'+ v.chName +'</option>';
                        });
                        $("select[name=mallPictureAURL]").html(h);
                        $("select[name=mallPictureBURL]").html(h);
                    }
                        
                    
                    $.each(info, function(k, v){
                       if(['mallName', 'mallPictureAURL', 'mallPictureBURL'].indexOf(k) > -1){
                           if('mallName' === k){
                               $('input[name=' + k +']').val(v);
                           }else{
                               setTimeout(function(){
                                   $('select[name=' + k +']').val(v);
                               },100);
                           }
                           
                           
                       }else if(['playPicture', 'mallPictureA', 'mallPictureB'].indexOf(k) > -1 && v){
                           $("input[name=" + k + "_input]").parent().addClass("ui-wc");
                           $("input[name=" + k + "_input]").after('<div name="' + k +'" class="' + k +'" id="' + k +'" data-url="'+ v +'"><img src="' + reqUrl.imgPath + v +'"></div>');
                       }else if(['nickName', 'mobile', 'weixinNumber'].indexOf(k) > -1){
                           $("[name=" + k + "]").text(v);
                       }else if(k === 'memberPicture'){
                           $("img[name=memberPicture]").attr("src", (v ? reqUrl.imgPath +　v : "/images/default.png"));
                       }
                    });
                }else if(data.infocode === '3'){
                    $("[name=mobile]").text($.cookie('member_loginName'));
                    $("[name=nickName]").text($.cookie('member_loginName'));
                    $("[name=weixinNumber]").text("");
                    _t.goodsBaseListInfo();
                }else{
                    _t.goodsBaseListInfo();
                    alert(data.info);
                    if(data.infocode === '2'){
                        location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                }
            },function(){
               alert("请求失败，请刷新页面重试"); 
            });
        },
        saveShopInfo: function(){
            $(document).on("tap", "#saveShopInfo", function(){
                var data = {};
                data.mallName = $("input[name=mallName]").val().trim();
                if(data.mallName === ""){
                    alert("请输入店铺名称");
                    return;
                }
                data.mallPictureAURL = $("select[name=mallPictureAURL] option:selected").val();
                data.mallPictureBURL = $("select[name=mallPictureBURL] option:selected").val();
                data.playPicture = $("div[name=playPicture]").data('url');
                data.mallPictureA = $("div[name=mallPictureA]").data('url');
                data.mallPictureB = $("div[name=mallPictureB]").data('url');
                
                common.js.ajx(reqUrl.ser + "member/updateMemberStoreInfo.action", data, function(data){
                    if(data.infocode === '2'){
                        location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                    alert(data.info);
                    location.href = "/mjzhongxin.html";
                },function(){
                   alert("请求失败，请刷新页面重试"); 
                });
                
            });
        },
        inputOnFoucs: function(){
            $(document).on('focus', 'input', function(){
               $(this).css("border", "none"); 
            });
        },
        //获取商品列表
        goodsBaseListInfo: function(){
            common.js.ajx(reqUrl.ser+"goodsBase/goodsBaseListInfo.action", {page: 1, rows: 30}, function(data){
                if(data.infocode === "0"){
                    var h ="";
                    $.each(data.info.list_goodsBase, function(k, v){
                        h += '<option value="'+ v.goodsId +'">'+ v.chName +'</option>';
                    });
                    $("select[name=mallPictureAURL]").html(h);
                    $("select[name=mallPictureBURL]").html(h);
                }
            },function(){
               alert("请求失败，请刷新页面重试"); 
            });
        }
    });
    shopSet.init();
});
