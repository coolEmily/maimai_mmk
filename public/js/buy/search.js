require.config({baseUrl: '/js/lib'});
require(['zepto', 'lib'], function($, lib) {
    lib = new lib();

    $(function(){

        initSkey();
        initEvent();
        initHot();
        doHistory();

        function initSkey(){

            var link = sessionStorage.getItem('linkUrl');
            var text = sessionStorage.getItem('text');

            if(link && text){
                $(".s-key").attr("data-url",link);
                $(".s-key").attr("placeholder",text);
            }
        }

        function initEvent(){
            $('.s-del').on('click',function(){
                $('.s-key').val('');
            });

            $(".s-key").focus(function(){
                $(this).val().length > 0 ? $(".s-del").show() : "";
            });
            $(".s-key").keyup(function(){
                $(this).val().length > 0 ? $(".s-del").show() : $(".s-del").hide();
            });
            $('.s-cancel').on('click',function(){
                history.go(-1);
            });

            $('.s-btn').on('click',function(){
                searchFun();
            });

            $("#searchForm").on("submit",function(){
                searchFun();
            });

            $(document).on('tap','#hot-tag > span,#history-tag > span',function(){
                console.log($(this).attr('keyword'));
                location.href = "/buyer/liebiao.html?goodsKeywords="+$(this).attr('keyword');
            });

            $('#his-clear').on('click',function(){
                if(confirm("是否清除历史记录")){
                    localStorage.removeItem('his');
                    location.reload();
                }
            });
        }

        function searchFun(){
            var keyWord = $(".s-key").val().trim();
            if(keyWord === "" && $(".s-key").attr("placeholder") === ""){
                alert("请输入搜索关键字");
                return;
            }else if(keyWord === "" && $(".s-key").attr("placeholder") !== ""){
                location.href = $(".s-key").attr("data-url");
                return;
            }
            doHistory(true,keyWord);
            location.href = "/buyer/liebiao.html?goodsKeywords="+keyWord;
        }

        function initHot(){
            lib.ajx(lib.getReq().ser + '/adPlan/getHomePageInfo.action', {}, function (data) {
                if (data.infocode === '0') {
                    var searchList = data.info.topMap.searchTextList;

                    for (var i in searchList) {
                        if(searchList[i].pictureUrl)

                        $("#hot-tag").append('<span keyword="'+searchList[i].pictureUrl+'">' + searchList[i].pictureUrl + '</span>');
                    }
                }
            });
        }

        function doHistory(isToAdd,keyword){
            var history = localStorage.getItem('his');
            if(history){
                var hisO = JSON.parse(history);
                var index = -1;

                if(isToAdd){  //添加前查询记录是否存在
                    hisO.forEach(function(v,i){
                        if(v === keyword ){
                            index = i;
                            return false
                        }
                    });

                    if(index != -1){  //记录存在则置后
                        hisO.splice(index,1);
                        hisO.push(keyword);
                    }else{
                        hisO.push(keyword); //新的记录
                    }
                    localStorage.setItem('his',JSON.stringify(hisO));

                }else{  //查询
                    var h = '';
                    hisO.forEach(function(v,i){
                        var temp = '<span keyword="'+v+'">'+v+'</span>';
                        h = temp + h;
                    });
                    $('#history-tag').append(h);
                    $('#history').show();
                }
            }else{
                if(isToAdd){
                    newHistory(keyword);
                }
            }
        }

        function newHistory(keyword){
            var hisO = [];
            hisO.push(keyword);
            localStorage.setItem('his',JSON.stringify(hisO));
        }

    });
});
