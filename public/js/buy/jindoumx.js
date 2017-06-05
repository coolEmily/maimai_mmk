require.config({baseUrl: '/js/lib'});
require(['zepto','lib',],function($,lib){
    lib = new lib();

    $(function(){
        var pageNo = 1,
            count = 15,
            pageType = 0,
            isAll = false,
            paramO = {},
            htmlType = window.location.pathname.indexOf("jindoumxview") > -1? 1: 0;

        //0-获赠金豆 1-赠送金豆 2-办卡金豆 3-兑换金豆 4-总单兑换返回 5-线下激活 6-分享申请成功 7-其它 8-子单兑换返回
        var mxTypeNameArr = ['获赠金豆','赠送金豆','办卡金豆','兑换商品金豆','','线下激活','分享申请','其他'];
        var mxType = lib.getUrlParam('type')?lib.getUrlParam('type'): '0';
        var mxTypeArr = ['0','1','3','6']; //对应页面显示时间范围选择
        var mySet = new Set(mxTypeArr);

        init();

        function init(){
            initPage();
        }

        function initPage(){
            if(htmlType === 1){
                pageType = 0;
                paramO = {};
            }else{
                initTitle();
                paramO = {
                    itemType: lib.getUrlParam('type')?lib.getUrlParam('type'): 0,
                    page: pageNo,
                    rows: count
                };
                if(!mySet.has(mxType)){
                    pageType = 1;
                }else{
                    //时间范围 分页
                    pageType = 2;
                    $('#date-con').show();
                    paramO.timeScope = 0;
                    initTimeEvent();

                }
                roll();
            }
            getData();
        }

        function initTitle(){
            var title = mxTypeNameArr[parseInt(mxType)];
            $('title,#mx-title').html(title);
            document.title = title;
            if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
                var j = document.createElement('iframe');
                j.src = '/favicon.ico';
                j.style.display = 'none';
                j.onload = function() {
                    setTimeout(function(){
                        j.remove();
                    }, 9);
                }
                document.body.appendChild(j);
            }
        }

        function initTimeEvent(){
            $('#date-con > li').on('click',function(){
                if($(this).hasClass('active')){
                    return;
                }
                $(this).addClass('active').siblings().removeClass('active');
                var dateType = $(this).index();
                pageNo = 1,
                paramO.page = pageNo;
                paramO.rows = count;
                paramO.timeScope = dateType;

                getData();

            });
        }

        function getData(){
            lib.ajx(lib.getReq().ser +'/memberTotalMessage/getVirtualMoneyItems.action',paramO,function(data){

                    if(data.infocode === '0' ){
                        if(pageType === 0){
                            initPageView(data.info);
                        }else{
                            initPageMx(data.info);
                        }
                    }else if(data.infocode === '2'){
                        location = '/buyer/login/dlzc.html?backUrl='+ lib.getBackUrl();
                    }else{
                        alert(data.info);
                    }
            },function(){
                alert("请求失败，请检查网络连接");
            })
        }

        //处理 金豆明细 jindoumxview.html
        function initPageView(data){
            var h ='',
                list = data.virtualMoneyList;
            $('#jdou-numbers').html(data.virtualMoneyBalance);

            for(var i =0; i< list.length; i++){
                var numStr = '';
                if(list[i].number > 0){
                    numStr = '<div class="jdou-changes ui-transr-999"><div class="">+'+list[i].number+'</div></div>';
                }else if(list[i].number === 0){
                    numStr = '<div class="jdou-changes zero ui-transr-999"><div class="">'+list[i].number+'</div></div>';
                }else{
                    numStr = '<div class="jdou-changes reduce ui-transr-999"><div class="">'+list[i].number+'</div></div>';
                }

                var hrefStr = '/buyer/home/bean/jindoumxdate.html?type='+list[i].itemType;
                var tH = '<a class="jdou-item " href="'+hrefStr+'">' +
                            '<div class="jdou-icon"><img src="/images/buy/jindou_icon.png" alt=""></div>'+
                            '<div class="jdou-detail"><div class="jdou-desc-overview">'+list[i].name+'</div></div>'+
                            numStr +
                        '</a>';
                h += tH;

            }
            $('#jdou-list').html(h);
        }
        //处理 金豆明细详情 jindoumxdate.html
        function initPageMx(data){
            var h ='';
            var list = data.recordList;
            for(var i =0; i< list.length; i++){
                var flag = list[i].addFlag?"+":"-";
                var color = list[i].addFlag? '':'reduce';
                var tH = '<div class="jdou-item">'+
                    '<div class="jdou-icon"><img src="/images/buy/jindou_icon.png" alt=""></div>'+
                    '<div class="jdou-detail"><div class="jdou-desc">'+list[i].itemName+'</div><div class="jdou-date">'+list[i].operateTime+'</div></div>'+
                    '<div class="jdou-changes '+color+'">'+flag+list[i].virtualMoneyNum+'</div>'+
                    '</div>';
                h +=tH;
            }
            isAll = list.length < count ? true:false;
            if(pageNo ===1 && list.length === 0){
                $('#jdou-list').html('');
                $('#jindoumx-empty').show();
                return;
            }
            $('#jindoumx-empty').hide();
            if(pageNo ===1){
                $('#jdou-list').html(h);
            }else{
                $('#jdou-list').append(h);
            }

        }

        function roll(){
            $(window).scroll(function (){
                if(!isAll && ($(window).scrollTop() > $(document).height() - $(window).height() - 10)){
                    paramO.page = ++ pageNo;
                    getData();
                }
            });
        }
    });
});
