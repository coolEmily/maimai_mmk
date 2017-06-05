/**
 * Created by liuhh on 2016/4/13.
 */
requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib','visitor-logs'], function ($,lib,vl) {
    lib = new lib();
    var addr = {
        reqUrl: lib.getReq().ser,
        getAddrList : function (){
            //console.log($.cookie("member_memberId"));
            lib.ajx(this.reqUrl+ "/receiveAddr/getAddrListInfo.action",{memberId:$.cookie("member_memberId"),page:1,rows:20},function(data){//
                if(data.infocode == "0"){
                    addr.setAddrList(data);
                }else{
                    $(".ui-address-item").remove();
                    //alert(data.info);
                }
            },function(){alert("收货地址获取失败!");});
        },
        setAddrList :function(addrData){
            var infCode = addrData.infocode;
            if(infCode == "0"){
                var list = addrData.info.addressList;
                var addrStr = "";
                $('.ui-address-item').empty();
                var sessionAddrId = (typeof sessionStorage.addressId != "undefined" ? sessionStorage.addressId : "");
                for (var i=0,j=list.length; i<j; i++){
                    var addrId = list[i].addressId,
                        addrItem = "",
                        addrDefault = list[i].isDefault == 1?'默认地址':"";
                    addrItem = '<div class="ui-address-item" data-chinaAreaId="'+ list[i].chinaAreaId +'" data.detailAddress="'+ list[i].detailAddress +'" data-receiverName="'+ list[i].receiverName +'" data-addr="'+ list[i].addressId +'" data-mobile="'+ list[i].mobile +'">'+
                        '<div class="ui-show-address">'+
                            '<div><span>收货电话:&nbsp;</span><span>' + list[i].mobile+'</span></div>'+
                            '<div><span>收货人:&nbsp;</span><span>'+list[i].receiverName+'</span></div>'+
                            '<div><span>收货地址:&nbsp;</span><span>' +list[i].detailAddress+'</span></div></div>'+
                        '<div class="ui-show-address-op">' +
                            '<div class="ui-addr-choose">'+addrDefault+'</div>'+
                        '<div class="delAddr" addrid="'+ list[i].addressId+'"></div>'+
                        '<div class="editAddr" addrid="'+ list[i].addressId+'"></div></div></div>';
                    if(list[i].isDefault == 1)   //默认地址置前
                        addrStr = addrItem + addrStr;
                    else{
                        addrStr += addrItem;
                    }
                }
                $("#ui-add-address").before(addrStr);
            }else if(infCode == "1"){
                $("#addr_null").show().siblings("#addrList").hide();
            }else{
                alert(addrData.info);
            }
        },
        delAddr : function (addrId){
            lib.ajx(this.reqUrl+ "/receiveAddr/deleteAddress.action",addrId,function(data){
                if(data.infocode == "4"){
                    addr.getAddrList();
                }else{
                    alert(data.info);
                }
            },function(){alert("删除地址失败!");});
        }

    };
    $(function(){
        addr.getAddrList();
        $("#ui-address-list").on("tap", ".editAddr", function (e){
            e.stopPropagation();
            console.log("edit addr");
            if(window.sessionStorage){
                sessionStorage.addr_edit_id = $(this).attr("addrid");//如果是修改地址，记录sessionStorage.addr_edit_id
                if(lib.getUrlParam("backUrl"))
                    window.location.href = "./bianji.html?backUrl=" + lib.getUrlParam("backUrl");
                else
                    window.location.href = "./bianji.html";
            }
        });

        $("#ui-address-list").on("tap", ".delAddr", function (e){
            e.stopPropagation();
            var isDel = confirm("您确定删除该地址");
            if(isDel){
                if(sessionStorage.addr_edit_id == $(this).attr("addrid")){//如果删除的地址为session保存过的地址则清楚，防止返回订单继续传地址ID
                    sessionStorage.removeItem("addr_edit_id");
                }
                addr.delAddr({"addressId" : $(this).attr("addrid")});
            }
        });

        $("#ui-add-address").on("tap click",function(e){
            sessionStorage.removeItem("addr_edit_id");//如果是新加地址，就删除sessionStorage.addr_edit_id
            if(lib.getUrlParam("backUrl"))
                window.location.href = "./bianji.html?backUrl=" + lib.getUrlParam("backUrl");
            else
                window.location.href = "./bianji.html";
                
        });
        
        $(document).on("tap", ".ui-address-item", function(){
            var _this = this;
            var data = {
                addressId: $(_this).attr("data-addr"),
                chinaAreaId: $(_this).attr("data-chinaAreaId"),
                receiverName: $(_this).attr("data-receiverName"),
                detailAddress: $(_this).attr("data-detailAddress"),
                mobile: $(_this).attr("data-mobile"),
                isDefault: 1
            };
            lib.ajx(lib.getReq().ser+'receiveAddr/updateAddress.action',data, function(data){
                if(data.infocode === '0'){
                    $('.ui-addr-choose').text('');
                    $(_this).find('.ui-addr-choose').text('默认地址');
                    if(lib.getUrlParam("backUrl"))
                        location.href = lib.getUrlParam("backUrl");
                }
            }, function(){
                console.log('请求失败');
            });
        });

    });
});