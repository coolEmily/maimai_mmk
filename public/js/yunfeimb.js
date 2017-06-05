/**
 * Created by liuhh on 2016/4/28.
 */
require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib', "visitor-logs"], function($, libjs ,vl){
    var lib = new libjs(),
        reqUrl = lib.getReq(),
        common = {"js": lib, "tools": lib};
    $(function(){
        var postage = {};
        $.extend(postage, {
            init: function(){
                var _t = this;
                _t.dealPara();
                _t.addPostage(); /*添加指定区域*/
                _t.delPostage(); /*删除指定区域*/
                _t.getPriceList(); //获取当前商品的运费信息
                _t.inputKeyup();
                _t.savePostage();
                _t.getAreaInfo(); //获取地区列表
                _t.chooseArea();
                _t.showAreaLsit();
                $("input").attr("disabled","disabled");
                $(".ui-del-op").hide();
                $(".ui-add-button:not(.on)").trigger("tap"); //减少改动，这里触发到可编辑状态。由之前须点击修改运费按钮才能编辑转为进入页面即可编辑
            },
            dealPara: function(){
                var _this = this;
                $(".type-name").val(lib.getUrlParam("typename"));
                _this.typeInfo[0] = lib.getUrlParam("typeid");
                if(this.typeInfo[0]){ //修改
                    _this.typeInfo[0] = lib.getUrlParam("typeid");
                    _this.typeInfo[1] = lib.getUrlParam("typename");
                }
                else{ //增加
                    $('#default-postage-set .ui-title').attr('areaid',"4000000");
                    $("title").html("增加运费模板");
                    $(".nav span").html("增加运费模板");
                    $(".ui-add-button").html("增加运费");
                }
            },
            addPostage: function(){
                var _t = this;
                $(document).on("tap", ".ui-add-button.on", function(){
                    $(this).before(_t.defaultHtml);
                });

                $(document).on("tap", ".ui-add-button:not(.on)", function(){
                    $(this).text('+添加指定地区运费').addClass("on");
                    $(".ui-update-op").show();
                    $("input").removeAttr("disabled");
                    $(".ui-del-op").show();
                    $(".ui-show-area-list").addClass("active");
                });
            },
            delPostage: function(){
                var _this = this;
                $(document).on("tap", ".ui-del-op", function(){
                    var delPost = $(this).parent().children('.ui-title').attr('areaid');
                    if(delPost){
                        delPost.split(',');
                        for(var i = 0;i < delPost.length; i++){
                            var index = _this.usedArea.indexOf(delPost[i]);
                            _this.usedArea.splice(index,1);
                        }
                    }
                    $(this).parent().remove();
                });
            },
            savePostage: function(){
                var _this = this;
                $(document).on("tap", ".ui-update-op", function(){
                    if($(".ui-area-list").hasClass("fadeInR")){
                        //完成地区选择
                        var tmpid = '',tmpName ='';
                        $(".ui-area-list .ui-first.active").each(function(){
                            var areaid = $(this).attr('areaid');
                            tmpid += _this.areaDict[parseInt(areaid)-1];
                            tmpid +=',';
                            tmpName += $(this).text();
                            tmpName +=',';
                        });
                        $(".ui-area-list .ui-first:not(.active)").next('li').find('.ui-second.active').each(function(){
                            tmpid +=$(this).attr('areaid');
                            tmpid +=',';
                            tmpName += $(this).text();
                            tmpName +=',';
                        });
                        //console.log(tmpName);
                        _this.curPostage.attr('areaid',tmpid.slice(0,tmpid.length -1));
                        _this.curPostage.children('span.ui-designated-area').text(tmpName.slice(0,tmpName.length -1));
                        $(".ui-area-list").addClass("fadeOutR").removeClass("fadeInR");
                        $(".ui-area-list").hide();

                    }else{
                        //验证信息是否填写完整后并保存
                        if(_this.validateName()&&_this.validateTitle() && _this.validateBody()){
                            _this.savePriceList();
                            $("input").attr("disabled","disabled");
                            $(this).hide();
                            $(".ui-add-button").text("修改运费").removeClass("on");
                            $(".ui-del-op").hide();
                            //$(".ui-show-area-list").removeClass("active");
                        }
                    }
                });
            },
            defaultHtml: '<div class="ui-postage-set"> <div class="ui-title ui-transr-999 ui-show-area-list active">指定地区<span class="ui-designated-area"></span></div> <div class="ui-base-set"> <div> <div>商品数目（以内）</div> <div>件</div> <div><input class="bNum" type="tel" value="0"></div> </div> <div> <div>运费</div> <div>元</div> <div><input class="bNumP" type="tel" value="0"></div> </div> </div> <div class="ui-base-set"> <div> <div>新增商品（以上）</div> <div>件</div> <div class=""><input class="gNum" type="tel" value="0"></div> </div> <div> <div>运费增加</div> <div>元</div> <div><input class="gNumP" type="tel" value="0"></div> </div> </div> <div class="ui-del-op"></div> </div>',
            inputKeyup: function(){
                $(document).on("keyup", "input:not(.type-name)", function(){
                    $(this).val($(this).val().replace(/\D/gi,''));
                });
            },
            chooseArea: function(){
                var _this =this;
                $(document).on("tap", ".ui-choose-area li[class^=ui-]:not(.deactive)", function(){
                    $(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active");
                    if($(this).hasClass("ui-first")){
                        $(this).hasClass("active") ? $(this).next().find("li").addClass("active") : $(this).next().find("li").removeClass("active");

                        if($(this).hasClass("active")){
                            $(this).next('li').find('.ui-second').each(function(){
                                if(_this.usedArea.indexOf($(this).attr('areaid')) == -1)
                                    _this.usedArea.push($(this).attr('areaid'));
                            });
                        }
                        else{
                            $(this).next('li').find('.ui-second').each(function(){
                                var index = _this.usedArea.indexOf($(this).attr('areaid'));
                                _this.usedArea.splice(index,1);
                            });
                        }
                    }else{
                        $(this).parent().children(".ui-second.active").length === $(this).parent().children(".ui-second").length ? $(this).parent().parent().prev().addClass("active") : $(this).parent().parent().prev().removeClass("active");

                        if($(this).hasClass("active"))
                            _this.usedArea.push($(this).attr('areaid'));
                        else{
                            var index = _this.usedArea.indexOf($(this).attr('areaid'));
                            _this.usedArea.splice(index,1);
                        }
                    }
                });

            },
            showAreaLsit: function(){
                var _this = this;
                $(document).on("tap", ".ui-show-area-list.active", function(){
                    $(".ui-area-list").addClass("fadeInR");
                    $(".ui-area-list").show();
                    _this.curPostage = $(this);
                    //更新地区列表状态
                    if(_this.usedArea){
                        for(var i = 0; i<_this.usedArea.length; i++){   //1.已设置的不可选
                            var selector = '.ui-area-list .ui-second[areaid="'+_this.usedArea[i]+'"]';
                            $(selector).removeClass("active").addClass("deactive");
                        }

                        var myareaids = _this.curPostage.attr('areaid')?_this.curPostage.attr('areaid').split(','):[];
                        for(var i = 0; i<myareaids.length; i++){    //2.自身的可以取消选定
                            var selector = '.ui-area-list .ui-second[areaid="'+myareaids[i]+'"]';
                            $(selector).removeClass("deactive").addClass("active");
                        }

                        var selFirst = '.ui-area-list .ui-first';   //3.反选大区
                        $(selFirst).each(function(){
                            if($(this).next('li').find('.deactive').length > 0)
                                $(this).removeClass("active").addClass("deactive");
                            else
                                $(this).removeClass("active deactive");
                            var selSecond = $(this).next('li').children('ul');
                            if(selSecond.find('.active').length == selSecond.children('li').length)
                                $(this).addClass("active");
                        });
                    }

                });
            },
            getPriceList: function(){
                var _this = this;
                if(!lib.getUrlParam("typeid"))
                    return;
                common.js.ajx(reqUrl.ser + "price/getPriceList.action", {"deliveryPriceTypeId":lib.getUrlParam("typeid")}, function(data){
                    if(data.infocode == "0"){
                        $('#default-postage-set .ui-title').attr('areaid',data.info[0].chinaAreaIdArr);
                        $('#default-postage-set .bNum').val(data.info[0].baseNum);
                        $('#default-postage-set .bNumP').val(data.info[0].basePrice);
                        $('#default-postage-set .gNum').val(data.info[0].addNum);
                        $('#default-postage-set .gNumP').val(data.info[0].addPrice);

                        var position = $('.ui-body .ui-add-button');
                        for(var i = 1; i < data.info.length;i++){
                            var postageHtml ='<div class="ui-postage-set">';
                            var infoHtml ='<div class="ui-title ui-transr-999 ui-show-area-list active" areaid="'+data.info[i].chinaAreaIdArr+'">指定地区<span class="ui-designated-area">'+ data.info[i].chinaAreaNameArr+'</span></div>'+
                                '<div class="ui-base-set"><div><div>商品数目（以内）</div><div>件</div>'+
                                '<div><input class="bNum" type="tel" value='+data.info[i].baseNum +' ></div>'+
                                '</div><div><div>运费</div><div>元</div><div><input class="bNumP" type="tel" value='+data.info[i].basePrice +' ></div>'+
                                '</div></div><div class="ui-base-set"><div><div>新增商品（以上）</div><div>件</div><div class=""><input class="gNum" type="tel" value='+data.info[i].addNum+' ></div>'+
                                '</div><div><div>运费增加</div><div>元</div><div><input class="gNumP" type="tel" value='+data.info[i].addPrice+' ></div>'+
                                '</div></div><div class="ui-del-op" style="display: none;"></div></div>';
                            postageHtml+= infoHtml;
                            postageHtml +='</div>';
                            position.before(postageHtml);

                            //记录已选用的地区 chinaAreaId
                            var areaIdsArr = data.info[i].chinaAreaIdArr.split(',');
                            for(var j = 0;j < areaIdsArr.length;j++){
                                _this.usedArea.push(areaIdsArr[j]);
                            }
                        }
                    }
                    else if(data.infocode == "2"){
                        alert("会员未登录");
                        location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                    }
                    else if(data.infocode == "3"){
                        alert("无对应的运费信息");
                    }
                    else{
                        alert("系统错误");
                    }
                },function(){});
            },
            savePriceList: function(){
                var priceList ={"deliveryPriceTypeId":lib.getUrlParam("typeid"),"deliveryPriceTypeName":$(".type-name").val().trim(),"chinaAreaIds":[],"baseNums":[],"basePrices":[],"addNums":[],"addPrices":[]};
                $('.ui-postage-set').each(function(){
                    var areaIdsArr = $(this).children('.ui-title').attr('areaid').split(',');
                    var bNum = $(this).find('.bNum').val();
                    var bNumP = $(this).find('.bNumP').val();
                    var gNum = $(this).find('.gNum').val();
                    var gNumP = $(this).find('.gNumP').val();
                    for(var j = 0;j < areaIdsArr.length;j++){
                        priceList.chinaAreaIds.push(parseInt(areaIdsArr[j]));
                        priceList.baseNums.push(bNum);
                        priceList.basePrices.push(bNumP);
                        priceList.addNums.push(gNum);
                        priceList.addPrices.push(gNumP);
                    }
                });
                $.ajax({
                    type: "get",
                    async:false,
                    url: reqUrl.ser + "price/saveAllPriceInfo.action",
                    data:priceList,
                    traditional:true,
                    dataType : "jsonp",
                    jsonp: "jsonpCallback",
                    success: function(data){
                        if(data.infocode == "0" ||data.infocode == "4"){
                            location = "/admin/yunfei.html";
                        }
                        else if(data.infocode == "2"){
                            alert(data.info);
                            location = "/login/denglu.html?backUrl=" + lib.getBackUrl();
                        }
                        else{
                            alert(data.info);
                        }
                    },
                    error: function(e){
                    }
                });
            },
            getAreaInfo: function(){
                var _this =this;
                common.js.ajx(reqUrl.ser + "price/getAreaInfo.action", {}, function(data){
                    if(data.infocode == "0"){
                        var areaList = $('.ui-area-list > .ui-body'),
                            infoList = data.info;
                        for(var i = 0; i < infoList.length; i++){
                            var areaHtml = '<div class="ui-choose-area"><ul><li class="ui-first" areaid="'+(i+1)+'">' + _this.district[i+1]+'</li><li><ul>';
                            var distObj = infoList[i][i+1];
                            var areaArr = '';
                            for(var j = 0; j < distObj.length; j++){
                                var item = '<li class="ui-second" areaid="'+distObj[j].chinaAreaId+'">'+distObj[j].areaName + '</li>';
                                areaHtml +=item;
                                areaArr += distObj[j].chinaAreaId;
                                areaArr += ',';
                            }
                            areaHtml += '</ul></li></ul></div>';
                            areaList.append(areaHtml);
                            _this.areaDict[i] = areaArr.slice(0,areaArr.length -1);
                        }
                    }
                    else{
                        alert("系统错误");
                    }
                },function(){
                    alert("请求失败");
                });
            },
            validateName: function(){
                if($(".type-name").val().trim() === ''){
                    alert("模板名称为空");
                    return false;
                }
                return true;
            },
            validateTitle: function(){
                var isValidate = true;
                $(".ui-postage-set .ui-title").each(function(){
                    if($(this).attr('areaid') === undefined ||$(this).attr('areaid') === ''){
                        alert("请选择指定地区");
                        isValidate = false;
                        return isValidate;
                    }
                });
                return isValidate;
            },
            validateBody: function(){
                var isValidate = true;
                $(".ui-postage-set input").each(function(){
                    if($(this).val() === ''){
                        alert("请输入合理的数");
                        $(this).focus();
                        isValidate = false;
                        return isValidate;
                    }
                });
                return isValidate;
            },
            usedArea: [],//存放已设置的地区
            district: {'1':'华东','2':'华北','3':'华中','4':'华南','5':'东北','6':'西北','7':'西南','8':'其他地区'}, //大区
            curPostage:{},//当前修改的运费节点对象
            areaDict:[], //大区分组
            typeInfo:[]
        });
        postage.init();
    });
});