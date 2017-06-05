require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "uploadImg"], function($, lib ,uploadImg){
    uploadImg();
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var std = {};
        $.extend(std, {
            init: function(){
               var _t = this;
               _t.save();
               _t.toShopVerify();
            },
            toShopVerify: function(){
                common.js.ajx(reqUrl.ser+"seller/toShopVerify.action", {}, function(data){
                    if(data.infocode === "0"){
                        $.each(data.info, function(k, v){
                            if(k.indexOf("PictureA") === -1){
                                $("input[name="+ k +"]").val(v);
                            }else{
                                if("" !== v){
                                    $("input[name="+ k +"_input]").after('<div name="'+ k +'" id="'+ k +'" class="'+ k +'" data-url="'+ v +'"><img src="'+ reqUrl.imgPath + v +'"></div>').parent().addClass("ui-wc");
                                }
                                
                            }
                            
                        });
                    }else{
                        alert(data.info);
                        if(data.infocode === '1') location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                },function(){
                    
                });
            },
            save: function(){
               $(document).on("tap", ".ui-submit.button", function(){
                    var data = {};
                    data.name = $("input[name=name]").val().trim();
                    data.businessLicense = $("input[name=yyzz]").val().trim();
                    data.titlePicture = $("div[name=titlePicture]").data("url");
                    data.licensePicture = $("div[name=licensePicture]").data("url");
                    data.livePictureA = $("div[name=livePictureA]").data("url");
                    data.livePictureB = $("div[name=livePictureB]").data("url");
                    data.livePictureC = $("div[name=livePictureC]").data("url");
                    data.livePictureD = $("div[name=livePictureD]").data("url");
                    if("" === data.name){
                        alert("请填写真实门店名称");
                        return;
                    }
                    if("" === data.businessLicense){
                        alert("请填写真实营业执照号码");
                        return;
                    }
                    if(!data.titlePicture　|| "" === data.titlePicture){
                        alert("请上传门店外面照片");
                        return;
                    }
                    if((!data.livePictureA || "" === data.livePictureA ) && (!data.livePictureB || "" === data.livePictureB )&& 
                        (!data.livePictureC || "" === data.livePictureC) && (!data.livePictureD ||"" === data.livePictureD)){
                        alert("请上传至少一张门店内营业现场照片");
                        return;
                    }
                    if(!data.licensePicture || "" === data.licensePicture){
                        alert("门店内悬挂营业执照照片");
                        return;
                    }
                    common.js.ajx(reqUrl.ser + "seller/addVerifyInfo.action", data, function(data){
                        if(data.infocode === "0"){
                            $(".main.ui-body").hide();
                            $(".ui-nothing-find").show();
                            $(".ui-submit.button").hide();
                        }else if(data.infocode === "1"){
                            alert(data.info);
                            location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                        }else{
                            alert(data.info);
                        }
                    },function(){
                        alert("提交失败");
                    });
                    
               });
            }
        });
        std.init();
    })();
});