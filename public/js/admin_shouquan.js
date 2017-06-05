require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "uploadImg", "dateSelect"], function($, lib, uploadImg, dateSelect){
    uploadImg();
    dateSelect();
    lib = new lib();
    var common = {"js": lib, "tools": lib}, reqUrl = lib.getReq();
    (function(){
        var shouquan = {};
        $.extend(shouquan, {
            init: function(){
                var _t = this;
                _t.initDateB();
                _t.initData();
                _t.save();
                //_t.initTypeList(); 类型
            },
            initDateB: function(){
               $(".ui-date-limit").tap(function(){
                   $(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active");
               });
            },
            save: function(){
                $(".ui-submit.button").tap(function(){
                    var data = {};
                    $("input[name=sellerTrademarkVerifyPictureId]").val() ? data.sellerTrademarkVerifyPictureId=$("input[name=sellerTrademarkVerifyPictureId]").val(): "";
                    data.trdemarkVerifyName = $("input[name=trdemarkVerifyName]").val().trim();
                    //data.classId = $("select[name=classId]").data("id");
                    data.trademarkPictureA = $("div[name=trademarkPictureA]").data("url");
                    data.trademarkPictureB = $("div[name=trademarkPictureB]").data("url");
                    data.trademarkPictureC = $("div[name=trademarkPictureC]").data("url");
                    data.trademarkPictureD = $("div[name=trademarkPictureD]").data("url");
                    data.trademarkPictureE = $("div[name=trademarkPictureE]").data("url");
                    data.trademarkPictureF = $("div[name=trademarkPictureF]").data("url");
                    data.effectiveDate = $("input[name=effectiveDate]").val().trim();
                    if("" === data.trdemarkVerifyName){
                        alert("请填写品牌中文名");
                        return;
                    }
                    if((!data.trademarkPictureA || "" === data.trademarkPictureA ) && (!data.trademarkPictureB || "" === data.trademarkPictureB )&& 
                        (!data.trademarkPictureC || "" === data.trademarkPictureC ) && (!data.trademarkPictureD || "" === data.trademarkPictureD ) &&
                        (!data.trademarkPictureE || "" === data.trademarkPictureE ) && (!data.trademarkPictureF || "" === data.trademarkPictureF )){
                        alert("请上传至少一张照片");
                        return;
                    }
                    var dateReg = /^(\d{4})-(\d{2})-(\d{2})$/;
                    if(!dateReg.test(data.effectiveDate)){
                        alert("请按日期格式正确的输入,例如:2016-04-16");
                        return;
                    }
                    common.js.ajx(reqUrl.ser + "seller/addOrUpdate.action", data, function(data){
                       if(data.infocode === "0"){
                           alert(data.info);
                           location.href = "shouquanzt.html";
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
            },
            initTypeList: function(){
                common.js.ajx(reqUrl.ser + "seller/getClassTop.action", {}, function(data){
                    if(data.infocode === "0"){
                        var html = "";
                        $.each(data.info, function(k, v) {
                       	    html += "<option data-id='"+ v.classId +"'>"+ v.className +"</option>";
                        });
                        $(".ui-type-list select").append(html);
                   }else if(data.infocode === "1"){
                       alert(data.info);
                       location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                   }else{
                       alert(data.info);
                   }
                },function(){
                    alert("数据获取失败");
                });
            },
            initData: function(){
                var id = common.tools.getUrlParam("id");
                common.tools.getUrlParam("et") === "0" ? $(".ui-submit.button").remove() : ""; 
                if(!id || "" === id) return;
                common.js.ajx(reqUrl.ser + "seller/toUpdateOrLook.action", {id: id}, function(data){
                    if(data.infocode === "0"){
                        var d = data.info;
                        $.each(d, function(k, v) {
                        	if(["trademarkPictureA", "trademarkPictureB", "trademarkPictureC", "trademarkPictureD", "trademarkPictureE", "trademarkPictureF"].indexOf(k) > -1){
                        	    $("input[name=" + k + "_input]").parent().addClass("ui-wc");
                                $("input[name=" + k + "_input]").after('<div name="' + k +'" class="' + k +'" id="' + k +'" data-url="'+ v +'"><img src="' + lib.getReq().imgPath + v +'"></div>');
                        	}else if(["trdemarkVerifyName", "effectiveDate", 'sellerTrademarkVerifyPictureId'].indexOf(k) > -1){
                        	    $("input[name=" + k + "]").val(v);
                        	}else{
                        	    
                        	}
                        });
                   }else if(data.infocode === "1"){
                       alert(data.info);
                       location.href = "/login/denglu.html?backUrl=" + common.tools.getBackUrl();
                   }else{
                       alert(data.info);
                   }
                },function(){
                    alert("数据获取失败");
                });
                
            }
            
        });
        shouquan.init();
    })();
});
