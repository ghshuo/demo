/**
 * Created by hsgeng on 2016/12/14.
 */
// 兼容IE8以下浏览器input不能识别placeholder属性提示   
if (navigator.appName == "Microsoft Internet Explorer" && (navigator.appVersion.match(/7./i) == "7." || navigator.appVersion.match(/8./i) == "8." || navigator.appVersion.match(/6./i) == "6." || navigator.appVersion.match(/5./i) == "5.")) {
	// 账号
	if ($("#userid").val() == null || $("#userid").val() == "") {
		document.getElementById("userSpan").style.display = "block";
	}
	$("#userid").mouseover(function () {
		document.getElementById("userSpan").style.display = "none";             //当input获取焦点时，label隐藏

	})
	$("#userid").mouseout (function () {
		if (document.getElementById("userid").value == "") {
			document.getElementById("userSpan").style.display = "block";        //当input失去焦点时，如果input框中有内容则label隐藏，如果没有内容则label显示
		} else {
			document.getElementById("userSpan").style.display = "none";
		};         //当input获取焦点时，label隐藏

	})
	// 密码
	if ($("#pwd").val() == null || $("#pwd").val() == "") {
		document.getElementById("pwdSpan").style.display = "block";
	}
	$("#pwd").mouseover(function () {
		document.getElementById("pwdSpan").style.display = "none";             //当input获取焦点时，label隐藏

	})
	$("#pwd").mouseout(function () {
		if (document.getElementById("pwd").value == "") {
			document.getElementById("pwdSpan").style.display = "block";        //当input失去焦点时，如果input框中有内容则label隐藏，如果没有内容则label显示
		} else {
			document.getElementById("pwdSpan").style.display = "none";
		};         //当input获取焦点时，label隐藏

	})
}


/**********************公告信息 start***********************/

/**
 *公告信息获取
 */

(function(){
	var url = "/assist/notice/noticeList";
	$.post(url,function(data){
		if(data.error.code==1){
			var jsondata = data.data.noticeList;
			$.each(jsondata,function(i,item){
				var noticeStr='<li>'+item.CONTENT+'</li>';
				$("#announcement ul").append(noticeStr);
			})
		}
	})
})();




/**
 *公告信息滚动
 */
var wait = 60;
var area = document.getElementById('announcement');
var con1 = document.getElementById('con1');
var con2 = document.getElementById('con2');
var speed = 50;
area.scrollTop = 0;
con2.innerHTML = con1.innerHTML;
function scrollUp(){
	if(area.scrollTop >= con1.scrollHeight) {
		area.scrollTop = 0;
	}else{
		area.scrollTop ++;
	}
}
var myScroll = setInterval("scrollUp()",speed);
area.onmouseover = function(){
	clearInterval(myScroll);
}
area.onmouseout = function(){
	myScroll = setInterval("scrollUp()",speed);
}

/**********************公告信息 end***********************/

/**
 *登录
 *  type=1是手机号登录  2是账号登录
 * 	"token":token, "os":"web" 这个两个每次调用接口必传的参数
 */
function order(typel) {
	var type = typel;
	var url = "/assist/user/login";
	var username = $("#userid").val();
	if (username == "" || username == null) {
		alert("请输入手机号或工号！");
		return;
	}
	var paws = $('#pwd').val();
	if (paws == "" || paws == null) {
		alert("请输入密码！");
		return;
	}
	var password = $.md5(paws); //对密码进行md5加密
	var token = "";
	var os = "web";
	var request = {
		param: {
			"username": username,
			"password": password,
			"type": type
		},
		common_param: {         //token和os是每个接口都必须传的参数
			"token": token,
			"os": "web"
		}
	};
	$.ajax({
		type: 'post',
		url: url,
		data: { 'request': JSON.stringify(request) },
		contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
		success: function (date) {
			if (date.error.code == 0) {
				alert(date.error.message);
				location.replace("login.html");
			} else if (date.error.code == 1) {
				var token = date.error.token;
				var salesId = date.data.salesId;
				var hqregionId = date.data.regionId;
				var hqName = date.data.regionName;
				sessionStorage.setItem("token", token);  //储存token 和salesId
				sessionStorage.setItem("salesId", salesId);
				sessionStorage.setItem("hqregionId", hqregionId);
				sessionStorage.setItem("hqName", hqName);
				window.location.href = 'index.html';
			}
		}
	});
}


/********************************忘记密码，进行修改********************************************/

// 弹出模态框

$(".forgetPpassword").click(function(){
	$('#myLogin').modal('show');
})

/*
 *获取验证码
 *
 */
function validateInfo(btn) {
	var url = "/assist/user/sendVerificationCodeSms";
	var salesId= $("#hqPhone").val();
	if(salesId==""||salesId==null){
		alert("工号不能为空，请填写业务员手机号码！");
		return;
	}
	var token = "";
	var os = "web";
	var request = {
		param: {
			"salesId": salesId
		},
		common_param: {         //token和os是每个接口都必须传的参数
			"token": token,
			"os": "web"
		}
	};
	$.ajax({
		type: 'post',
		url: url,
		data: { 'request': JSON.stringify(request) },
		contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
		success: function (date) {
			if (date.error.code == 1) {
				buttonTime(btn);
			}else{
				alert(date.error.message);
			}
		}
	});
}

/**
 * 修改密码
 * @param   code 验证码
 * @param   salesId   工号对应的手机号
 * @param   newPwd 密码
 */

$("#forgetPwdUpdatePwd").click(function(){
	var url = "/assist/user/forgetPwdUpdatePwd";
	var salesId = $("#hqPhone").val();
	if (salesId == "" || salesId == null) {
		alert("请输入手机号或工号！");
		return;
	}
	var code = $('#verification').val();
	if (code == "" || code == null) {
		alert("请输入验证码！");
		return;
	}
	var changePwd = $('#changePwd').val();
	if (changePwd == "" || changePwd == null) {
		alert("请输入新密码！");
		return;
	}
	var newPwd = $.md5(changePwd); //对密码进行md5加密
	var token = "";
	var os = "web";
	var request = {
		param: {
			"salesId": salesId,
			"code": code,
			"newPwd": newPwd
		},
		common_param: {         //token和os是每个接口都必须传的参数
			"token": token,
			"os": "web"
		}
	};
	$.ajax({
		type: 'post',
		url: url,
		data: { 'request': JSON.stringify(request) },
		contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
		success: function (date) {
			if (date.error.code == 1) {
				$('#myLogin').modal('hide');
				alert("恭喜您，密码修改成功，请重新登录！");
				window.location.href = 'login.html';
			}else{
				alert(date.error.message);
			}
		}
	});
})

/**
 * 
 * 获取验证码倒计时
 */
function buttonTime(btn) {
	if (wait == 0) {
		btn.removeAttribute("disabled");
		btn.value = "获取";
		wait = 60;
	} else {
		btn.setAttribute("disabled", true);
		btn.value =wait +"s";
		wait--;
		setTimeout(function () {
			buttonTime(btn);
		}, 1000)
	}
}