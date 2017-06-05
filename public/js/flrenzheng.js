require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "uploadImg"], function($, lib ,uploadImg){
    uploadImg();
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    var fenlei = {flag: false};
    $.extend(fenlei, {
        init: function(){
            var _t = this;
            this.getTypeList();
            this.save();
            this.initPage();
            $(document).on('change', '#ui-type-list', function(){
                _t.getTypeContent($('#ui-type-list option:selected').data("id"));
            });
        },
        getTypeList: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "seller/toVerify.action", {}, function(data){
                if(data.infocode === "0"){
                    var html = "";
                    $.each(data.info, function(k, v) {
                        html += '<option data-id="'+ v.sellerVerifyTypeId +'">'+ v.sellerVerifyName +'</option>';
                    });
                    $("#ui-type-list").append(html);
                    _t.getTypeContent($('#ui-type-list option:selected').data("id"));
                }else{
                    alert(data.info);
                    if(data.infocode === "1") location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                }
            },function(){
                alert("授权类型请求失败");
            });
        },
        getTypeContent: function(sellerVerifyTypeId){
            var _t = this;
            common.js.ajx(reqUrl.ser + "seller/getItem.action",{sellerVerifyTypeId: sellerVerifyTypeId}, function(data){
                if(data.infocode === "0"){
                    $(".ui-img-type-tishi:not(.ui-undel)").remove();
                    var html = '';
                    $.each(data.info, function(k, v){
                        html += '<div class="ui-img-type-tishi">' + (k+1) + "、" + v.itemName + '</div>' +
                                '<div class="ui-img-type-tishi ui-upload-img"><div class="ui-t">上传图片</div><div class="ui-input ui-add-img-button"><div class="ui-add-button">' +
                                '<input name="'+ v.name +'_input" id="" data-width="640" data-target=".'+ v.name +'" type="file" accept="image/*" name="file1"/>' +
                                '</div></div><div class="clearfix"></div></div>';
                    });
                    $(".ui-shop-img.ui-title-input").append(html);
                    _t.flag = true;
                }
            },function(){
                alert("请求失败");
            });
        },
        save: function(){
            $(document).on("tap", ".ui-submit.button", function(){
                var data = {};
                data.sellerVerifyTypeId = $('#ui-type-list option:selected').data("id");
                $.each($("input[name$=_input]").next(), function(k, v){
                    data[$(v).attr("name")] = $(v).data("url");
                });
                
                common.js.ajx(reqUrl.ser + "seller/addVerifyInfo.action", data, function(data){
                    alert(data.info);
                    if(data.infocode === "0"){
                        location.href = "shenqing.html";
                    }else if(data.infocode === "1"){
                        location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                    }
                },function(){
                    alert("请求失败");
                });
            });
        },
        
        /*修改时 初始化页面*/
        initPage: function(){
            var _t = this;
            common.js.ajx(reqUrl.ser + "seller/toUpdateVerify.action", {}, function(data){
                if(data.infocode === "0"){
                    $.each($("#ui-type-list option"), function(k, v){
                        if(Number($(v).data('id')) === Number(data.info.sellerVerifyTypeId)){
                            $(v).attr("selected", "selected").change();
                            return false;
                        }
                    });
                    var timeInteral = setInterval(function(){
                        if(_t.flag){
                            clearInterval(timeInteral);
                            $.each(data.info.pictureList, function(k, v) {
                                if(v.imgPath){
                                    $("input[name="+ v.name +"_input]").after('<div name="'+ v.name +'" id="'+ v.name +'" class="'+ v.name +'" data-url="'+ v.imgPath +'"><img src="'+ reqUrl.imgPath + v.imgPath +'"></div>');                           
                                    $("input[name="+ v.name +"_input]").parent().addClass("ui-wc");
                                }
                            });
                        }
                    },100);
                            
                }
            },function(){
                console.log("initPage 请求失败");
            });
        }
    });
    fenlei.init();
    
});
