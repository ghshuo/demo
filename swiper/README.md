# Swiper �ƶ���tab�л�+��������Ӧ

�����Ҹ���һ���߶ȣ�����鿴Ч���� Ӧ�õ�ʵ����Ŀ�в������ø߶� �����Զ��ſ�

    <header class="favor-header-bar">
        <ul class="tabs">
            <li class="default"><a href="javascript:void(0);" id="btn1" hidefocus="true">��һҳ</a><span><img src="images/hot.png"></span></li>
            <li><a href="javascript:void(0);" id="btn2" hidefocus="true">�ڶ�ҳ</a></li>
            <li><a href="javascript:void(0);" id="btn3" hidefocus="true">����ҳ</a></li>
            <li><a href="javascript:void(0);" id="btn4" hidefocus="true">����ҳ</a></li>
        </ul>
    </header>

 <div class="swiper-container favor-list">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
               <div class="divHgight" style="background:red; height: 1000px">
                  <!-- ������� -->
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

  // ��ȥҳ����жϵ�һ��ҳ�����ݵĸ߶�  ��Ӹ�swiper-container
        var divHgight=$(".divHgight").eq(0).height();
        $(".swiper-container").height(divHgight);
        var mySwiper = new Swiper('.swiper-container', {
            autoHeight: true,
            onSlideChangeStart: function () {
              // ��ȡ��ȥ�Ǹ�ҳ�� ɾ���������ʽ
              $(".tabs .default").removeClass('default');
              $(".tabs li").eq(mySwiper.activeIndex).addClass('default');
              console.log('��' + ((mySwiper.activeIndex) + 1) + 'ҳ');
              // ��Ӧҳ��߶�����Ӧ  
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