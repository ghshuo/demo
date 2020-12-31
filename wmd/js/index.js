//自适应
var phoneWidth = parseInt(window.screen.width);
var phoneHeight = parseInt(window.screen.height);
var phoneScale = phoneWidth / 750;//除以的值按手机的物理分辨率
var ua = navigator.userAgent;
if (/Android (\d+\.\d+)/.test(ua)) {
    var version = parseFloat(RegExp.$1);
    // andriod 2.3
    if (version > 2.3) {
        var pp = phoneScale / 2;
        document.write('<meta name="viewport" content="width=device-width,initial-scale=' + phoneScale + ',minimum-scale=' + phoneScale + ',maximum-scale=' + phoneScale + ',user-scalable=no">');
        // andriod 2.3以上
    } else {
        document.write('<meta name="viewport" content="width=device-width,user-scalable=no">');
    }
    // 其他系统
} else {
    document.write('<meta name="viewport" content="width=device-width, initial-scale=' + phoneScale + ',minimum-scale=' + phoneScale + ',maximum-scale =' + phoneScale + ',user-scalable=no">');
}
var arr = "2020-05-02 12:20:00".split(/[- :]/); //改这里
var box = document.getElementsByClassName('textCon')[0];

function init() {
    var width = box.offsetWidth;
    console.log(width)
    var count = parseInt(width / 50 * 5);
    console.log(count)
    for (var i = 0; i < count; i++) {
        var size = parseInt(ran(60, 120) / 10);
        var ele = document.createElement('div');
        ele.classList.add('item');
        ele.style.width = size + 'px';
        ele.style.height = size + 'px';
        ele.style.left = ran(0, 95) + '%';
        ele.style.top = ran(20, 80) + '%';
        ele.style.animationDelay = ran(0, 30) / 10 + 's';
        box.appendChild(ele);
    }
}

function ran(min, max) {
    min = parseInt(min);
    max = parseInt(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timer_start() {
    var start_time = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    var duration = parseInt(new Date() - start_time) / 1000;
    var seconds = parseInt(duration % 60);
    if (seconds < 10)
        seconds = "0" + seconds;
    duration = parseInt(duration / 60);
    var minutes = duration % 60;
    if (minutes < 10)
        minutes = "0" + minutes;
    duration = parseInt(duration / 60);
    var hours = duration % 24;
    if (hours < 10)
        hours = "0" + hours;
    duration = parseInt(duration / 24);
    var days = duration;
    document.getElementsByClassName('days-number')[0].innerHTML = ("" + days);
    document.getElementsByClassName('seconds')[0].innerHTML = (hours + " 时 " + minutes + " 分 " + seconds + " 秒");
}
window.setInterval(timer_start, 1000);
timer_start();
init();

$('.heart').on('click', function () {
    $('.textCon').hide();
    $('.page_two').show();
    $('.page_two').fireworks({
        sound: false,
        opacity: 0.9,
        width: '100%',
        height: '100%'
    });
    typeWrite();
})

var myWords = '我有许多的不足，甚至还有些直男癌，可能并不是你理想中的男生，年龄的增长是谁都会经历，有的人生命长度一样，但是宽度不同，我的宽度要变成双向八车道。对我来说，不是在最美好的时光遇见了你，而是遇见你后都是最美好的时光！如果可以，希望我能陪你去你喜欢的地方，只想弥补错过你的青春。愿你每天都有一个好心情，美丽的烟花为你绽放！';
var x = 0;
var speed = 150;
var current = 0;
function typeWrite() {
    $('.type_words').html(myWords.substring(0, x++) + '_');
    var timer = setTimeout("typeWrite()", speed);
    if (x == myWords.length) {
        x = myWords.length;
        clearTimeout(timer)
    }
}


(function ($) {

    $.fn.fullImages = function (fisher) {

        var fisher = $.extend({
            ImgWidth: null,
            ImgHeight: null,
            autoplay: null,
            fadeTime: null
        },
            fisher)

        var count = $(this).find("img").length;
        var nValue = 0;
        var oValue = 0;
        var _this = $(this);

        _this.find("img:eq(0)").fadeIn("slow");

        var setIntervalImg = setInterval(function () {

            nValue++
            if (nValue == count) {
                nValue = 0;
            }
            _this.find(" img:eq(" + (nValue) + ")").fadeIn(fisher.fadeTime);
            _this.find(" img:eq(" + (oValue) + ")").fadeOut(fisher.fadeTime);
            oValue = nValue % count;

        },
            fisher.autoplay);

        resizeFun();
        $(window).resize(function (e) {
            resizeFun();
        });

        function resizeFun() {

            /*轮播图全屏*/
            var imgH = fisher.ImgHeight;
            var imgW = fisher.ImgWidth;
            var hValue = imgH / imgW;
            var wValue = imgW / imgH;

            if ($(window).width() / $(window).height() < wValue) {

                _this.find("img").css("width", $(window).height() * wValue);
                _this.find("img").css("margin-left", -(($(window).height() * wValue) - $(window).width()) / 2);
                _this.find("img").css("height", $(window).height());

            } else {

                _this.find("img").css("width", $(window).width());
                _this.find("img").css("margin-left", 0);
                _this.find("img").css("height", $(window).width() * hValue);

            }

        }

    };

}(jQuery));