requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto', 'lib'], function ($, lib) {
    var lib = new lib();
    var reqUrl = lib.getReq();
    var brand = {};
    $.extend(brand, {
        oData: {
            memberId: lib.getUrlParam('sId') ? lib.getUrlParam('sId') : $.cookie('maimaicn_s_id'),
            memberMainPageLocationId: lib.getUrlParam('memberMainPageLocationId'),
            flag:lib.getUrlParam('flag')
        },
        init: function () {
            var t = this;
            var str = "";
            if(sessionStorage.getItem('d')){
                $(".brand").append(sessionStorage.getItem('d'));
                return;
            }
            lib.ajx(reqUrl.ser + "/mainPageSource/getTrademarkList.action", t.oData, function (data) {
                if (data.infocode == "1") {
                    var picList = data.info.picList[0];
                    var brandList = data.info.brandList;
                    if (picList) {
                        str += '<div class="brand-ad"><a href="' + picList.linkUrl + '"><img src="' + reqUrl.imgPath + picList.imgAUrl + '"></a></div>';
                    }
                    str += '<div class="brandBox clearfix">';
                    $.each(brandList, function (k, v) {
                        str += '<a href="' + v.linkUrl + '"><img src="' + reqUrl.imgPath + v.imgUrl + '"></a>';
                    });
                    str += '</div>';
                    sessionStorage.setItem('d',str);
                    $(".brand").append(str)
                } else {
                    alert("请求失败")
                }
            }, function (err) {
                if (err) {
                    alert("请求失败")
                }
            })
        }
    });
    brand.init();
});
