define(function(){
			var rem_position={
				obj:{},
				flag:false,
				fn:function(){},
				//初始化
				init:function(){
					//通过传参的flag来判断是否有分页
					this.flag=arguments[0];
					this.obj=arguments[1] || {};
					this.socll();
					if(history.state){
						if(!(this.flag)){
							this.refsh();
						}
					}
				},
				//当页面重新加载时
				refsh:function(){
					var self=this;
						if(history.state){
							 //  *******加载函数*************
								 self.fn(history.state);
							 var height=history.state.scrollTop1;
							var time=setInterval(function(){
								$(window).scrollTop(height);
							 if($(window).scrollTop()>=height-10 && $(window).scrollTop()<=height+10 ){
							 	clearInterval(time);
							 }
 						 },200);
 							//*******************************
						}else{
							var stateObj={'scrollTop1': $(window).scrollTop()};
							for(var i in self.obj){
								stateObj[i]=self.obj[i];
							}
						console.log(1);
							history.pushState(stateObj, '', '');
								self.fn(history.state);
						}
				},
				//监控位置
				socll:function(){
						var self=this;
					 var stateObj;
				 $(window).on("scroll",function () {
							if(self.flag){
								stateObj={'scrollTop1': $(window).scrollTop()};
								for(var i in self.obj){
									stateObj[i]=self.obj[i];
								}
								history.replaceState(stateObj, '', '');
							}else{
								stateObj={'scrollTop1': $(window).scrollTop()};
								history.replaceState(stateObj, '', '');
							}
				 });
			 },
			 //更改属性
				replace:function(obj){
					this.obj=obj;
				},
				//加载函数
				renderPage:function(fn){
						this.fn=fn;
						if(history.state){
							this.refsh();
						}
				},
			};
		return rem_position;
});
