/**
 * Created by yangfei on 2017/5/25.
 */
requirejs.config({baseUrl: '/js/lib'});
requirejs(['zepto','lib'], function ($,lib){
    var lib =new lib();
    var reqUrl = lib.getReq();
    $(function () {
        var shop={}
        $.extend(shop, {
            page:1, //页数
            rows:6, //每页几个
            loading : false,
            noMore:true,
            init: function () {
                this.activeMissVoteTypeId = lib.getUrlParam("activeMissVoteTypeId");
                this.activeMissVotePlayerId = lib.getUrlParam("activeMissVotePlayerId");
                this.getMissVoteGoodsListUrl = reqUrl.ser + "/missVote/getMissVoteGoodsList.action";
                //获取数据
                this.getMissVoteGoods();
                //分页
                this.roll();
                //购买
                this.btnclick();
                //购买须知
                this.buyerReading();
            },
            //请求数据
            getMissVoteGoods:function () {
                var _this =this;
                lib.ajx(_this.getMissVoteGoodsListUrl,{
                    activeMissVoteTypeId:_this.activeMissVoteTypeId,
                    activeMissVotePlayerId:_this.activeMissVotePlayerId,
                    page: _this.page,
                    rows: _this.rows
                },function (data) {
                    _this.loading = false;
                    if(!Object.keys(data.info).length){
                        _t.noMore = false;
                        return;
                    }
                    if(data.infocode == "0"){
                          _this.show(data);
                    }else {
                        alert(data.info);
                    }
                    var listStr = data.info.voteGoodsList;
                    if(listStr.length<_this.rows){
                        _this.noMore = false;
                    }
                },function (err) {
                    _this.loading = false;
                    if(err){
                        alert("网络错误");
                    }
                })
            },
            //页面展示
            show: function (data) {
                if(!data.info.voteGoodsList){
                    return
                }
                var text='';
                text="您正在为"+data.info.sortValue+data.info.playerName+"赠鲜花，购买以下商品可以增加鲜花数量";
                $('.message').html(text);
                var arr = data.info.voteGoodsList;
                $.each(arr,function (index ,value) {
                    var html='<li class="good" data-hrf="'+value.goodsId+'"><img src="'+reqUrl.imgPath+value.mainPictureJPG+'" ><p>'+value.chName+'</p><div class="price">￥<span>'+value.sellPrice.toFixed(2)+'</span></div><div class="flower">免费送'+value.giftFlowerNum+'朵鲜花</div><div class="btn"></div></li>';
                    $('.list').append(html)
                })
            },
            //分页
            roll:function(){
                var _this = this;
                $(window).scroll(function (){
                    if(!_this.loading && _this.noMore && $(window).scrollTop() > $(document).height() - $(window).height() - 10){
                        _this.loading = true;
                        _this.page++;
                        _this.getMissVoteGoods();
                    }
                });
            },
            //购买
            btnclick:function(){
                $(".list").on("click","li",function(){
                    console.log('ok')
                        var id=$(this).data("hrf");
                        window.location='/g?gId='+id;
                })
            },
            //购买须知
            buyerReading:function () {
                $("#xz").on("click", function () {
                    $('.xz_show').show();
                    $('.shade').css("display","block");
                });
                $(".x_btn").on("click", function () {
                    $('.xz_show').hide();
                    $('.shade').css("display","none");
                });
            }
        })
        shop.init();
    })
})
