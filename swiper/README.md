# Swiper 移动端tab切换+滑动自适应
这个是基于Swiper库做的
内容我给了一个高度，方便查看效果， 应用到实际项目中不用设置高度 内容自动撑开

    <header class="favor-header-bar">
        <ul class="tabs">
            <li class="default"><a href="javascript:void(0);" id="btn1" hidefocus="true">第一页</a><span><img src="images/hot.png"></span></li>
            <li><a href="javascript:void(0);" id="btn2" hidefocus="true">第二页</a></li>
            <li><a href="javascript:void(0);" id="btn3" hidefocus="true">第三页</a></li>
            <li><a href="javascript:void(0);" id="btn4" hidefocus="true">第四页</a></li>
        </ul>
    </header>
    
    
    <div class="swiper-container favor-list">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
               <div class="divHgight" style="background:red; height: 1000px">
                  <!-- 添加内容 -->
               </div>
            </div>
            <div class="swiper-slide margin19">
              <div class="divHgight" style="background:#ccc; height: 500px">
              </div>
            </div>
            <div class="swiper-slide">
               <div class="divHgight" style="background:rgb(204, 204, 204); height: 600px;">
               </div>                                
            </div>
            <div class="swiper-slide">
               <div class="divHgight" style="background: #805d5d; height: 300px;">
               </div>
            </div>
        </div>
   </div>





	 // 进去页面就判断第一个页面内容的高度  添加给swiper-container
        var divHgight=$(".divHgight").eq(0).height();
        $(".swiper-container").height(divHgight);
        var mySwiper = new Swiper('.swiper-container', {
            autoHeight: true,
            onSlideChangeStart: function () {
              // 获取进去那个页面 删除和添加样式
              $(".tabs .default").removeClass('default');
              $(".tabs li").eq(mySwiper.activeIndex).addClass('default');
              console.log('第' + ((mySwiper.activeIndex) + 1) + '页');
              // 对应页面高度自适应  
              var activeHight = $(".divHgight").eq(mySwiper.activeIndex).height();
              $(".swiper-slide").eq(mySwiper.activeIndex).height(activeHight);
              console.log(activeHight);
              $(".swiper-container").height(activeHight);
              
            }
        });
	
	
	 $(".swiper-slide-active").css("height", "auto");
        $(".tabs li").on('click', function (e) {
          e.preventDefault();
          $(".tabs .default").removeClass('default');
          $(this).addClass('default');
          // console.log($(this).index());
          mySwiper.swipeTo($(this).index());
        });
        $(".tabs li").click(function (e) {
          e.preventDefault();
        });
