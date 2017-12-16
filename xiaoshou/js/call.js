/*
 *外呼登录信息
 * @param username  用户名
 * @param companyname 公司名
 * @param path      来源
 * @param securityinfo 密码
 * @param usercode
 */
var hqpassword, hqseatid, hqdomain, hqcompanyid, hqusername, callId;
(function () {
  var username = sessionStorage.getItem("salesId");
  // var username = '17785111035';
  var companyname = "江苏智恒";
  var path = '';
  var securityinfo = '';
  var usercode = 'B7DAF2EF30F6A8CE9D50615ECABB90134D9ADC5A0325FDFDBF29E53DCD04F3DA6B095913FD7CAD9ACA8CEA1C3E3B9B318EAA168BD256A4B584B91A323227111D5CB6FD4BDE2C20E1DC91CD8AE0EC6556';
  var url = '/call-web/companyUsers/doLoginNew.html';
  $.ajax({
    type: 'get',
    url: url,
    data: {
      'companyname': companyname,
      'username': username,
      'path': path,
      'securityinfo': securityinfo,
      'usercode': usercode
    },
    success: function (data) {
      hqpassword = data.password;
      hqseatid = data.seatid;
      hqdomain = data.domain;
      hqcompanyid = data.companyid;
      callss();
    }
  });
}())
//var ua=null;
/********************************************想fs发送注册请求的方法 begin************************************************************/
function callss() {
  //封装注册（签入）SIP的参数和地址。
  var uri = '' + hqseatid + '@' + hqdomain + '';//待传入
  var myStunServers = [];
  config = {
    uri: uri,
    wsServers: "wss:/yy.91callcenter.cn:17443",
    authorizationUser: hqseatid,//待传入
    password: hqpassword,//待传入
    userAgentString: "SIP.js/0.7.0 BB",
    iceCheckingTimeout: 500,
    rel100: SIP.C.supported.SUPPORTED,
    registerExpires: 60,
    traceSip: true
  };
  //1、默认创建一个userAgent,建立连接
  ua = new SIP.UA(config);

  var isRegistered = ua.isRegistered();

  ua.on('registered', function () {
    isRegistered = ua.isRegistered();
  });

  setTimeout(function () {
    //判断sip是否注册成功
    if (!isRegistered) {
      //console.log(isRegistered);
      var url = 'https://' + hqseatid + '@' + hqdomain + ''; //待传入
      $.messager.confirm("操作提示", "软电话未注册成功，请点确定，在新打开的页面中点击高级，再点击继续前往！", function (r) {
        if (r) {
          window.open(url);
        }
      });
    }
  }, 3000);

  //坐席签出
  ua.on('unregistered', function () {

  });

  //收到一个会话
  ua.on('invite', function (session) {
    playSound('di');
    //调用呼叫功能
    createNewSessionUI(session.remoteIdentity.uri, session);
  });

  //收到一个消息---极少用到
  ua.on('message', function (message) {
    if (!sessionUIs[message.remoteIdentity.uri]) {
      createNewSessionUI(message.remoteIdentity.uri, null, message);
    }
  });
}



/********************************************想fs发送注册请求的方法 end************************************************************/


/*
 * 外呼成员信息
 * @param prodNumList
 * @param token
 * @param web
**/

$("#web").click(function () {
  var url = "/assist/task/webCallProdList";
  var os = "web";
  var request = {
    param: {
      "prodNumList": prodNumList
    },
    common_param: {
      "token": token,
      "os": "web"
    }
  };
  $.ajax({
    type: 'post',
    url: url,
    data: { 'request': JSON.stringify(request) },
    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
    success: function (data) {
      if (data.error.code == 1) {
        $('#myModal').modal('show');
        $("#listTable").empty();
        $.each(data.data.prodList, function (i, item) {
          var b = [];
          b[3] = item.PROD_SPEC_NAME;
          b[4] = item.SPEAK_RIGHT;
          b[5] = item.ACC_NBR;
          b[6] = item.CUST_NAME;
          b[7] = item.IS_ACTIVE;
          b[8] = item.IS_MAIN_CARD;
          for (var i = 0; i < b.length; i++) {
            if (b[i] == null) {
              b[i] = "";
            }
          }
          switch (item.USER_STATUS) { //用户状态
            case 0:
              b[1] = '正常';
              break;
            case 1:
              b[1] = '单停';
              break;
            case 2:
              b[1] = '双停';
              break;
            case 3:
              b[1] = '已拆机';
              break;
            default:
              break;
          }
          switch (item.IS_ACTIVE) { //是否活跃
            case 0:
              b[2] = '低';
              break;
            case 1:
              b[2] = '一般';
              break;
            case 2:
              b[2] = '高';
              break;
            case 3:
              b[2] = '较高';
              break;
            default:
              break;
          }
          switch (item.IS_MAIN_CARD) {
            case 0:
              b[8] = '副卡';
              break;
            case 1:
              b[8] = '主卡';
              break;
            default:
              break;
          }
          var listTableStr = '<tr>' +
            '<th>' + b[5] + '</th>' +
            '<th>' + b[6] + '</th>' +
            '<th>' + b[1] + '</th>' +
            '<th>' + b[3] + '</th>' +
            '<th>' + b[2] + '</th>' +
            '<th>' + b[8] + '</th>' +
            '<th>' + b[4] + '</th>' +
            '<th><button type="button" class="btn btn-success" onclick="webcall(' + b[5] + ')" name="but">拨打电话</button></th>' +
            '<th><button type="button" class="btn btn-success" onclick="phonecall(' + b[5] + ')" name="but">拨打电话</button></th>' +
            '</tr>';
          $("#listTable").append(listTableStr);
        });
      }
    }
  })
})
$("#myModalClose").click(function () {
  $("#outbound").val("");
})


/********************************************手机外呼statr*****************************************************************/
/**
 *    手机外呼
 * @param companyid  公司id
 * @param seatid    sip坐席号
 * @param phone   拨打的手机号码
 * @param domain  公司domain
**/

// 输入手机号进行拨打
$("#phoneOutbound").click(function () {
  var webOutbound = $("#outbound").val();
  if (webOutbound == null || webOutbound == "") {
    alert("手机号不能为空！");
    return;
  }
  var reg = /^1[34578]\d{9}$/;
  if (!reg.test($.trim(webOutbound))) {
    alert("请输入正确的手机号！");
    return;
  }
  var phone = webOutbound;
  var url = '/call-web/dataCall/TranstoFixedPhone.html';
  $.ajax({
    type: 'get',
    url: url,
    data: { 'phone': phone, 'seatid': hqseatid, 'domain': hqdomain, 'companyid': hqcompanyid },
    success: function (data) {
      callId = data.callID;
      GetTransStation();
      $("#webmodald").html("手机外呼");
      $("#webContent").html("正在呼叫中请稍后~~");
      $('#myModal').modal('hide');
      $('#mycall').modal({ backdrop: 'static', keyboard: false });  // 点击遮罩层不关闭模态框
    }
  });
})

// 从成员信息中获取手机号
function phonecall(getphone) {
  var phone = getphone;
  var url = '/call-web/dataCall/TranstoFixedPhone.html';
  $.ajax({
    type: 'get',
    url: url,
    data: { 'phone': phone, 'seatid': hqseatid, 'domain': hqdomain, 'companyid': hqcompanyid },
    success: function (data) {
      callId = data.callID;
      $("#webmodald").html("手机外呼");
      $("#webContent").html("正在呼叫中请稍后~~");
      $('#myModal').modal('hide');
      $('#mycall').modal({ backdrop: 'static', keyboard: false });
      GetTransStation();
    }
  });
}

// 手机外呼查询接通状态
function GetTransStation() {
  var url = "/call-web/dataCall/GetTransStation.html";
  $.ajax({
    type: 'get',
    url: url,
    data: { 'callID': callId, 'seatid': hqseatid, 'domain': hqdomain, 'companyid': hqcompanyid },
    success: function (data) {
      $("#webContent").html('<div class="callPhone">正在通话中</div><input type="text" id="txt" value="0时0分0秒">');
      timedCount();
    }
  });
}

/********************************************手机外呼end*****************************************************************/

/**
 *   web 外呼
 * @param companyid  公司id
 * @param seatid    sip坐席号
 * @param phone   拨打的手机号码
 * @param domain  公司domain
**/
var uril;
function webcall(geturi) {
  uril = geturi;
  speechInviteSubmit();
}

$("#webOutbound").click(function () {
  var webOutbound = $("#outbound").val();
  if (webOutbound == null || webOutbound == "") {
    alert("外呼手机号不能为空！");
    return;
  }
  var reg = /^1[34578]\d{9}$/;
  if (!reg.test($.trim(webOutbound))) {
    alert("请输入正确的手机号！");
    return;
  }
  uril = webOutbound;
  var uri = webOutbound;
  setCookie("call_uri", uri);
  $("#bye2").show();
  $("#bye").hide();
  speechInviteSubmit();
})

/**
 *  外呼反馈   web外呼  通话结束之后调用
 *  参数登录信息中获取
 * @param companyid  公司id
 * @param seatid    sip坐席号
 * @param phone   拨打的手机号码
 * @param source  固定传GZ
 */

function recordingRecord() {
  var url = '/call-web/dataCall/callBackDetailByPhone.html';
  $.ajax({
    type: 'get',
    url: url,
    data: { 'companyid': hqcompanyid, 'seatid': hqseatid, 'phone': uril, 'source': "GZ" },
    success: function (data) {
    }
  });
}



//获取指定名称的cookie的值  函数向客户端发送一个 HTTP
function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
/********************************************拨打电话调用的方法************************************************************/
//拨号号码的输入框
//<input class="callTxt" type="text" autocomplete="off" placeholder="输入呼出的电话号码" id="ua-uri"/>

/*uriInput参数的值*/  //：document.getElementById('ua-uri')

/**拨打电话调用改方法。
 *
 * @param e
 * @param uriInput   拨打号码输入框
 */

function speechInviteSubmit() {
  callType = "speech";
  var uri = uril;
  if (!uri)
    return;


  var callUri = uri;
  var uriString = uri.toString();   // 把手机号number转化成string类型;
  if (uriString.length == 11) {
    callUri = "0" + callUri;
  }

  var options = {
    media: {
      constraints: {
        audio: true,
        video: false
      }
    }
  };
  var session = ua.invite(callUri, options);
  createNewSessionUI(uri, session, null); //调用呼叫中方法

}
/********************************************拨打电话调用的方法 end************************************************************/

/********************************************呼叫中方法************************************************************/

var sessionUIs = {};
var config;
var inorout;
var uriString;
var sessionUI = {};
var first = null;

/**
 *
 * @param uri	电话号码
 * @param session
 * @param message	判断挂断示闲
 */
function createNewSessionUI(uri, session, message) {
  var messageNode;
  $('#myModal').modal('hide');
  $("#outbound").val("");
  //弹出提示框
  // $('#mycall').modal('show');
  $('#mycall').modal({ backdrop: 'static', keyboard: false });
  $("#webmodald").html("WEB外呼");
  $("#webContent").html("正在呼叫中,请稍后~~");
  // alert("显示模态框");
  // recordingRecord();
  // $("#loginMask").show();
  //$('#dlg').window('open');
  // $(".interlinkage").show();
  uri = session ? session.remoteIdentity.uri : SIP.Utils.normalizeTarget(uri,
    ua.configuration.hostport_params);
  var displayName = (session && session.remoteIdentity.displayName)
    || uri.user;

  if (!uri) {
    return;
  }

  sessionUI.session = session;
  sessionUI.bye = document.getElementById('bye');
  sessionUI.bye2 = document.getElementById('bye2');
  sessionUI.byeVideo2 = document.getElementById('byeVideo2');
  sessionUI.video = document.getElementById('right_video');
  sessionUI.messageForm = document.getElementById("messagesForm");
  sessionUI.messageInput = document.getElementById("messageInput");
  sessionUI.renderHint = {
    remote: sessionUI.video
  };
  sessionUI.dtmf1 = document.getElementById("dtmf1");
  sessionUI.dtmf2 = document.getElementById("dtmf2");
  sessionUI.dtmf3 = document.getElementById("dtmf3");
  sessionUI.dtmf4 = document.getElementById("dtmf4");
  sessionUI.dtmf5 = document.getElementById("dtmf5");
  sessionUI.dtmf6 = document.getElementById("dtmf6");
  sessionUI.dtmf7 = document.getElementById("dtmf7");
  sessionUI.dtmf8 = document.getElementById("dtmf8");
  sessionUI.dtmf9 = document.getElementById("dtmf9");
  sessionUI.dtmfx = document.getElementById("dtmf11");
  sessionUI.dtmf0 = document.getElementById("dtmf12");
  sessionUI.dtmfJ = document.getElementById("dtmf13");
  sessionUI.accpet = document.getElementById("accpet");
  sessionUI.accpetVideo = document.getElementById("accpetVideo");
  sessionUI.cancel = document.getElementById("cancel");
  sessionUI.unhold = document.getElementById("unhold_id");
  sessionUI.hold2 = document.getElementById("hold_id2");
  sessionUI.unhold2 = document.getElementById("unhold_id2");
  sessionUI.statusHold = document.getElementById("status_hold");
  sessionUI.statusUnhold = document.getElementById("status_unhold");
  sessionUI.mute = document.getElementById("mute_id");
  sessionUI.unmute = document.getElementById("unmute_id");
  sessionUI.refer = document.getElementById("refer");
  sessionUI.refer2 = document.getElementById("refer2");
  sessionUI.ua_uri = document.getElementById("ua-uri");
  //sessionUI.showTime = new showTime("showTime");

  sessionUI.submitRefer = document.getElementById("submitRefer");
  sessionUI.x_uuid = "";

  sessionUIs[uri] = sessionUI;
  //首次进入绑定事件
  if (first == null) {  //一次进去 给挂断按钮添加事件
    // alert("第一次进去");
    //接通后坐席挂断通话
    sessionUI.bye.addEventListener('click', function () {
      var session = sessionUI.session;
      if (!session) {
        return;
      } else if (session.startTime) {
        // Connected
        session.bye();
      }
    }, false);


    //未接通后坐席挂断通话
    sessionUI.bye2.addEventListener('click', function () {
      var session = sessionUI.session;

      if (!session) {
        // voiceHide();
        return;
      } else if (session.startTime) { // Connected
        session.bye();
        // voiceHide();
      } else if (session.cancel) { // Outbound
        session.cancel();
        // clearInterval(sendPlaySound$);//关闭回铃音
        //clearInterval(receivePlaySound$);// 关闭振铃
        // voiceHide();
        $("a[name='status']").removeClass("active");

      }
    }, false);




  }
  first = 1;

  //电话接通中
  if (session && !session.accept) {
    // sendPlaySound$ = setInterval("playSound('dudu')", 2000);//打开回铃音
    var jsonStr = "{states:4}";
    // alert("正在呼叫中，请稍后。。。");
    // $(".mid-call").html("正在呼叫中，请稍后。。。")
  } else if (!session) {
    // clearInterval(sendPlaySound$);//关闭回铃音
    //clearInterval(receivePlaySound$);// 关闭振铃
    $("a[name='status']").removeClass("active");

  } else {

  }

  //如果在会话中，开始调用   整个通话流程：响铃、接通、挂断
  if (session) {
    setUpListeners(session);
  }

  /**
   * 整个通话流程：响铃、接通、挂断
   * */
  function setUpListeners(session) {

    session.on('progress', function (response) {
      sessionUI.x_uuid = response.getHeader("X_uuid");
    });

    //接通电话
    session.on('accepted', function (response) {
      // clearInterval(sendPlaySound$);//关闭回铃音
      //clearInterval(receivePlaySound$);// 关闭振铃
      if (inorout == 1) {
        sessionUI.x_uuid = response.getHeader("X_uuid");
      }
      //正在接电话
      if (session.request.body.indexOf("m=video") != -1) {
        $("#right_video").show();

      } else {//电话接通，开始计时，弹框内容需要你们自己修改
        uriString = session.remoteIdentity.uri.toString().replace("sip:", "");
        uriString = uriString.substring(0, uriString.indexOf("@"));
        if (uriString.length == 12 && /^01/.test(uriString)) {
          uriString = uriString.substring(1);//接通的号码
        }
        $("#right_video").show();
        $("#webContent").html('<div class="callPhone">正在和' + uriString + '通话</div><input type="text" id="txt" value="0时0分0秒">');
        $("#bye").show();
        $("#bye2").hide();
        timedCount();
        // alert(".......通话进行中" + uriString);

      }
      //打电话挂断可用
      $('#bye').removeClass("nodrop");//让挂断电话按钮可用
      $('#bye').addClass("on");
      // alert("......电话按钮可用");
      // session.mediaHandler.render(sessionUI.renderHint);
    });

    session.mediaHandler.on('addStream', function () {
      session.mediaHandler.render(sessionUI.renderHint);
    });

    /**
     *
     *正常挂断电话
     */
    session.on('bye', function () {
      recordingRecord();
      delete sessionUI.session;
      if (session.request.body.indexOf("m=video") != -1) {
        $("#right_video").hide();
      } else {
        //停止计时器
        clearAll();
        // $("#loginMask").hide();
        // $(".putThrough").hide();
        $("#right_video").hide();
        //挂断会话隐藏弹屏
        if (inorout == 1) {
          // $("#loginMask").hide();
          // $(".putThrough").hide();
        }
      }
      $("#bye2").show();
      $("#bye").hide();
      // $("#bye").addClass("nodrop");//把挂断电话按钮置为不可用


      /********************挂电话回写操作****************************/

      /***********************挂电话回写操作******************************/
    });


    /**
     *
     * 客户拒接
     */
    session.on('failed', function () {
      delete sessionUI.session;
      //clearInterval(receivePlaySound$);// 关闭振铃
      // alert("......客户拒接");

      //挂断会话隐藏弹屏
      //$('#dlg').dialog('close');
      // $("#loginMask").hide();
      // $(".interlinkage").hide();
      if (session.request.body.indexOf("m=video") != -1) {
        $("#right_video").hide();
      } else {
        //sessionUI.showTime.stop();
        clearAll();
        $("#right_video").hide();
      }
      /*****************挂电话回写操作***********************/


      /****************挂电话回写操作结束********************************/



    });

    session.on('refer', session.followRefer(onReferred));

    function onReferred(request, newSession) {

      attachMediaStream(remoteVideo, newSession.mediaHandler
        .getRemoteStreams()[0]);
    }
  }
  sessionUI.session = session;
}
/********************************************呼叫中方法 end************************************************************/


/****************呼叫中方法 stats**********/
/*
 *秒表计时
 */
var c = 0
var t;
function timedCount() {
  var temptextmin = document.getElementById('txt');
  hour = parseInt(c / 3600);// 小时数
  min = parseInt(c / 60);// 分钟数
  if (min >= 60) {
    min = min % 60
  }
  lastsecs = c % 60;
  temptextmin.value = hour + "时" + min + "分" + lastsecs + "秒"
  c = c + 1
  t = setTimeout("timedCount()", 1000)
}
//停止计时器
function stopCount() {
  clearTimeout(t)

}
//重置秒表计时器
function clearAll() {
  c = 0
  document.getElementById('txt').value = "0时" + "0分" + "0秒"
  clearTimeout(t)

}
$("#bye2").click(function () {
  clearAll();
})