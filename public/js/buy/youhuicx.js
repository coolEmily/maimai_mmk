require.config({baseUrl: '/js/lib',urlArgs: "v0.0.1"});
require(['zepto', 'lib'], function($, lib){
    lib = new lib();
    var noMore = true;
    var rows = 6,
        page = 1;
    var youhui = {};
    $(function(){
        $.extend(youhui,{
            init:function(){
                var _t = this;
                _t.getPromotion(rows,page);
                _t.roll();
            },
            getPromotion:function(){
                lib.ajx(lib.getReq().ser + "/information/getInformationWapList.action",{'page':page,'rows':rows,infoId:1},function(data){
                    var list = data.info.map_list;
                    if(data.infocode === '0'){
                        var htmlStr = "";
                        for(var i=0; i<list.length; i++){                                
                            htmlStr = '<div class="youh_con">'+ 
                                            '<div class="youh_time">'+list[i].auditTime+'</div>'+ 
                                            '<div class="youh_c">'+ 
                                                '<a href="'+list[i].textContent+'">'+ 
                                                    '<h2>'+list[i].infoName+'</h2>'+ 
                                                    '<div class="youh_img"><img src="'+lib.getReq().imgPath+list[i].videoImg+'" /></div>'+ 
                                                    '<div class="youh_more">查看详情<span class="more"><img src="/images/buy/xiaox_icon3.png" /></span></div>'+ 
                                                '</a>'+ 
                                            '</div>'+        
                                        '</div>';
                            $(".youh").append(htmlStr);
                        }  
                        if(list.length<rows){
                            noMore = false;
                        }
                    }
                },function(){
                    alert("系统错误");
                });
            },
            roll:function(){
                var _t = this;
                $(window).scroll(function (){
                    if(noMore &&　$(window).scrollTop() > $(document).height() - $(window).height() - 10){                        
                        _t.getPromotion(rows,page++);                        
                    }
                });
            }
        });
    });
    youhui.init();
});