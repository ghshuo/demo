//每次都要传给后台的     是从登录之后获取的token  os 
var hqtaskId,
	token = sessionStorage.getItem("token"),
	salesId = sessionStorage.getItem("salesId"),
	hqtaskId = sessionStorage.getItem("hqtaskId"),
	os = "web",
	pageNumber,
	nextPag,
	totalPage;
//右侧当前所有工单
$(function () {
	youce(); 	//进入页面就获取左侧的当前菜单
	FillSheng();

})
function youce() {
	//每次点击二次按钮时 让下拉框选择第一个
	$("#selectAge option:first").prop("selected", 'selected');
	$("#selectAge1 option:first").prop("selected", 'selected');
	youc();
}

/*****************两级联动*******/
var city = [
	[],
	["业务竣工", "营销成功", "接触成功", "其他"],
	["营销失败", "联系失败", "其他"],
	["联系延迟", "营销延迟", "其他"],
]
function getCity() {
	//获得省份下拉框的对象    
	var sltProvince = document.form1.province;
	//获得城市下拉框的对象    
	var sltCity = document.form1.city;
	//得到对应省份的城市数组    
	var provinceCity = city[sltProvince.selectedIndex - 1];
	//清空城市下拉框，仅留提示选项    
	sltCity.length = 1;
	//将城市数组中的值填充到城市下拉框中    
	for (var i = 0; i < provinceCity.length; i++) {
		sltCity[i + 1] = new Option(provinceCity[i], provinceCity[i]);
	}
}

/***********用户归属三级联动*******/
$("#prefecture").change(function () {
	$("#shi option:first").prop("selected", 'selected');
	$("#qu option:first").prop("selected", 'selected');
	if ($("#prefecture").val() == "") {
		$("#county").html("");
		$("#substation").html("");
		return;
	} else {
		FillShi();
	}
})
$("#county").change(function () {
	$("#qu option:first").prop("selected", 'selected');
	if ($("#shi").val() == "") {
		$("#substation").html("");
		return;
	} else {
		FillQu();
	}
});

//用户归属列表
//地市
function FillSheng(){
	var regionId = sessionStorage.getItem("hqregionId");
	var regionName = sessionStorage.getItem("hqName");
	var str = '<option value = ' + regionId+ '>' + regionName + '</option>';
	$("#prefecture").append(str);
}

//区县
function FillShi() {
	var url = "/assist/task/regionList";
	var regionId = $("#prefecture").val();
	var request = {
		param: {
			"regionId": regionId

		},
		common_param: {
			"token": token,
			"os": "web"
		}
	};
	$.ajax({
		type: 'post',
		async: false,
		url: url,
		data: { 'request': JSON.stringify(request) },
		contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
		success: function (data) {
			$("#county").html('<select id="shi" class="retrievalSelect"><option value="">请选择</option></select>');
			$.each(data.data.regionList, function (i, item) {
				var shiStr = '<option value = ' + item.ID + '>' + item.NAME + '</option>';
				$("#shi").append(shiStr);
			})
		}
	})
}

//支局
function FillQu() {
	var url = "/assist/task/regionList";
	var regionId = $("#shi").val();
	var request = {
		param: {
			"regionId": regionId

		},
		common_param: {
			"token": token,
			"os": "web"
		}
	};
	$.ajax({
		type: 'post',
		async: false,
		url: url,
		data: { 'request': JSON.stringify(request) },
		contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
		success: function (data) {
			$("#substation").html('<select id="qu" class="retrievalSelect"><option value="">请选择</option></select>');
			$.each(data.data.regionList, function (i, item) {
				var quStr = '<option value = ' + item.ID + '>' + item.NAME + '</option>';
				$("#qu").append(quStr);
			})
		}
	})
}

/****************当前工单内容，及跳转*******/
var regionId;
function youc() {
	pageNumber = 1;
	youcel();
}
function youcel() {
	var url = "/assist/task/webNowTakeList";
	if (pageNumber == 0) {
		pageNumber = 1;
	}
	var accNbr = $('#phone').val();
	nextTaskId = hqtaskId;
	var taskId = nextTaskId;
	var options = $("#selectAge option:selected");
	var status = options.val();
	var options1 = $("#selectAge1 option:selected");
	var belongStatus = options1.val();   //获取下拉框的val值
	var pageSize = 10;   //每页显示的条数
	var isWxComment1 = $("#isWxComment option:selected");
	var isWxComment = isWxComment1.val();
	var reportType1 = $("#reportType option:selected");
	var reportType = reportType1.val();   //上报结果
	var userStatus1 = $("#userStatus option:selected");
	var userStatus = userStatus1.val();  //用户状态
	var completeStatus1 = $("#completeStatus option:selected");
	var completeStatus = completeStatus1.val();  //竣工状态
	//用户归属
	var userRegionId;
	var sheng1 = $("#prefecture option:selected");
	var prefecture = sheng1.val();
	var shi1 = $("#shi option:selected");
	var shi = shi1.val();
	var qu1 = $("#qu option:selected");
	var qu = qu1.val();
	var statusDateStart = $("#statusDateStart").val();
	var statusDateEnd = $("#statusDateEnd").val();
	if (prefecture == "" && shi == "" && qu == "") {
		userRegionId = "";
	}
	else if (prefecture == "") {
		userRegionId = "";
	}
	else if (prefecture != "" && shi == "") {
		userRegionId = prefecture;
	}
	else if (prefecture != "" && shi == "" && qu == "") {
		userRegionId = prefecture;
	} else if (prefecture != "" && shi != "" && qu == "") {
		userRegionId = shi;
	} else if (prefecture != "" && shi != "" && qu != "") {
		userRegionId = qu;
	}
	var request = {
		param: {
			"taskId": nextTaskId,
			"accNbr": accNbr,
			"custName": "",
			"status": status,
			"belongStatus": belongStatus,
			"pageNumber": pageNumber,
			"pageSize": 10,
			"userRegionId": userRegionId,
			"reportType": reportType,
			"isWxComment": isWxComment,
			"userStatus": userStatus,
			"completeStatus": completeStatus,
			"statusDateStart": statusDateStart,
			"statusDateEnd": statusDateEnd
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
			taskIdListdsd();
			$(".workDetails").empty(); //清除上一次查询
			if (data.error.code == 1) {
				var workorderStr = '<li id="workorder">' +
					'<div><span>原始工单</span></div>' +
					'<div><span>任务名称</span></div>' +
					'<div><span>下发时间</span></div>' +
					'<div><span>截止时间</span></div>' +
					'<div style="width:18%;"><span>用户归属</span></div>' +
					'<div><span>微信留言</span></div>' +
					'<div><span>客户名称</span></div>' +
					'<div><span>客户号码</span></div>' +
					'<div><span>执行状态</span></div>' +
					'<div><span>归属状态</span></div>' +
					'<div><span>竣工情况</span></div>' +
					'<div style="width:8%;"><span>操作</span></div>' +
					'</li>';
				$(".workDetails").html(workorderStr);
				$.each(data.data.taskList, function (z, y) {
					var a = []; //定义一个空数组
						a[0] = y.parRegionName;     //返回时null时 让页面什么也不显示
						a[1] = y.branch;
						a[7] = y.custName;
						a[9] = y.des;
						a[10] = y.reportType;
						a[11] = y.reportReason;
					for (var i = 0; i < a.length; i++) {
						if (a[i] == null) {
							a[i] = "";
						}
					}
					switch (y.status) {  //当 任务状态（0：未执行，1：执行成功，2：执行失败，3：延时执行）页面显示相应的文字
						case 0:
							a[2] = '未执行';
							break;
						case 1:
							a[2] = '执行成功';
							break;
						case 2:
							a[2] = '执行失败';
							break;
						case 3:
							a[2] = '延迟执行';
							break;
						default:
							break;
					}
					switch (y.belongStatus) {//当 归属状态（转派：0:自有，1:转出，2:转入） 页面显示相应的文字
						case '0':
							a[3] = '自有';
							break;
						case '1':
							a[3] = '转出';
							break;
						case '2':
							a[3] = '转入';
							break;
						default:
							break;
					}
					switch (y.completeFlag) {//竣工
						case 0:
							a[4] = '未竣工';
							break;
						case 1:
							a[4] = '竣工';
							break;
						default:
							break;
					}
					switch (y.isWxComment) {
						case 0:
							a[6] = '否';
							break;
						case 1:
							a[6] = '是';
							break;
						default:
							break;
					}
					switch (y.userStatus) {
						case 0:
							a[8] = '正常';
							break;
						case 1:
							a[8] = '单停';
							break;
						case 2:
							a[8] = '双停';
							break;
						case 3:
							a[8] = '拆机';
							break;
						default:
							break;
					}
					
					// 首页颜色说明增强
					var balanceAccount;
					if (y.userBalance < 5) {
						balanceAccount = '该用户账户余额小于5元';
					} else if (y.userBalance > 5 && y.userBalance < 10) {
						balanceAccount = '该用户账户余额小于10元';
					} else {
						balanceAccount = '该用户账户正常';
					}
					var informationShow = ''+balanceAccount+' ; 用户状态'+ a[8]+' ; '+a[10]+' '+a[11]+' '+a[9]+'';
					var cta = "2";
					sessionStorage.setItem("cta", cta);
					var operatorStr = '<a href="information.html?ha=' + y.id + '" target="view_window"><div class="xaing1" style="width: 34px;">详情</div></a><div class="che1" style="width: 34px;">撤销</div>';
					if (a[3] == '转出' && a[2] == '未执行') { //如果是未执行&&是转出的  添加撤销转派的按钮
						operatorStr = '<a  class="xql" href="information.html?ha=' + y.id + '" target="view_window"><div class="xaing1" style="width: 34px;">详情</div></a><div class="cxl che2" id="' + y.id + '" onclick="chexiao(this)" style="width: 34px;">撤销</div>';
					}
					// var start = y.startDate;
					// var startDate = start.substr(0, 10); //取到开始时间 日期 去掉分秒  字符串截取
					// var endd = y.endDate;
					// var endDate = endd.substr(0, 10);
					var str1 = '<li class="shensdas">' +
						'<div><span class="title" title="' + y.initialName + '">' + y.initialName + '</span></div>' +
						'<div><span class="title" title="' + y.taskName + '">' + y.taskName + '</span></div>' +
						'<div><span class="title" title="' + y.startDate + '">' + y.startDate + '</span></div>' +
						'<div><span class="title" title="' + y.endDate + '">' + y.endDate + '</span></div>' +
						'<div style="width:18%"><span class="title" title="' + a[0] + '" style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + a[0] + '</span></div>' +
						'<div><span class="title" title="' + a[6] + '">' + a[6] + '</span></div>' +
						'<div id="name_' + y.id + '"><span class="title" title="' +informationShow + '">' + a[7] + '</span></div>' +
						'<div id="staus_' + y.id + '"><span class="title" title="' +informationShow + '" style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + y.accNbr + '</span></div>' +
						'<div><span class="title" title="' +informationShow + '">' + a[2] + '</span></div>' +
						'<div id="zi_' + y.id + '"><span class="title" title="' + a[3] + '">' + a[3] + '</span></div>' +
						'<div id="jun_' + y.id + '"><span class="title" title="' + a[4] + '">' + a[4] + '</span></div>' +
						'<div style="width:8%;"><span>' + operatorStr + '</span></div>' +
						'</li>';
					$(".workDetails").append(str1);
					//通过“客户号码” 列字体颜色区分用户状态：
					if (y.userStatus == 0) {
						$('.shensdas  #staus_' + y.id).css("color", "#63ce93");
					} else if (y.userStatus == 1) {
						$('.shensdas  #staus_' + y.id).css("color", "#e4e413");
					} else if (y.userStatus == 2) {
						$('.shensdas  #staus_' + y.id).css("color", "#ffcf3e");
					} else if (y.userStatus == 3) {
						$('.shensdas  #staus_' + y.id).css("color", "#ff5959");
					}
					//通过“客户名称” 列字体颜色区分账户余额：
					if (y.userBalance < 5) {
						$('.shensdas #name_' + y.id).css("color", "#ff5959");
					} else if (y.userBalance > 5 && y.userBalance < 10) {
						$('.shensdas #name_' + y.id).css("color", "#2f8acb");
					} else {
						$('.shensdas #name_' + y.id).css("color", "");
					}

					// 通过“归属状态” 列字体颜色区分归属状态
					if (y.belongStatus == '0') {
						$('.shensdas #zi_' + y.id).css("color", "#63ce93");
					} else if (y.belongStatus == '1') {
						$('.shensdas #zi_' + y.id).css("color", "#ccc");
					} else if (y.belongStatus == '2') {
						$('.shensdas  #zi_' + y.id).css("color", "#2f8acb");
					}
					if (y.assessment == 0) {
						$('.shensdas #jun_' + y.id).css("color", "#ccc");
					} else if (y.assessment == 1) {
						$('.shensdas #jun_' + y.id).css("color", "#2f8acb");
					} else if (y.assessment == 2) {
						$('.shensdas #jun_' + y.id).css("color", "");
					} else if (y.assessment == 3) {
						$('.shensdas #jun_' + y.id).css("color", "#ff5959");
					}
				})
				$(".shensdas:even").css({ 'background': '#f3fbff' });
				var total = data.data.total;
				totalPage = Math.ceil(total / pageSize);
				$("#dqyema").val(pageNumber);
				if (pageNumber > 1 && pageNumber < totalPage) {    //页数大于1小于总页数时都添加上点击事件
					$(".dqshou").attr("onclick", "dqshou();");
					$(".dqshang").attr("onclick", "dqshang();");
					$(".dqbutto").attr("onclick", "dqtiao();");
					$(".dqxia").attr("onclick", "dqxia();")
					$(".dweiye").attr("onclick", "dweiye();");
				} else {
					if (pageNumber <= 1) { //小于1时  删除上一页和首页的点击事件
						pageNumber = 1;
						$(".dqyema").val(pageNumber);
						$(".dqshou").removeAttr("onclick");
						$(".dqshang").removeAttr("onclick");
						$(".dqxia").attr("onclick", "dqxia();")
						$(".dweiye").attr("onclick", "dweiye();");
					}
					if (pageNumber >= totalPage) { //等于总页数时  删除下一页和跳转的点击事件
						pageNumber = totalPage;
						$("#dqyema").val(pageNumber);
						$(".dqxia").removeAttr("onclick");
						$(".dweiye").removeAttr("onclick");
					}
					if (pageNumber >= totalPage) { //等于总页数时  删除下一页和跳转的点击事件
						pageNumber = totalPage;
						$("#dqyema").val(pageNumber);
						$(".dqshou").attr("onclick", "dqshou();");
						$(".dqshang").attr("onclick", "dqshang();");
						$(".dqxia").removeAttr("onclick");
						$(".dweiye").removeAttr("onclick");
					}
				}
				var str66 = '<div class="dqpagez">共<span class="dqpagezz">' + pageNumber + '/' + totalPage + '</span>页</div>';
				$(".dqpagez").html(str66);
			}
		}


	});

}

//下一页  当前
function dqxia() {
	nextPag = $("#dqyema").val();
	pageNumber = Number(nextPag) + 1;
	youcel();
}

//当前上一页
function dqshang() {
	nextPag = $("#dqyema").val();
	pageNumber = Number(nextPag) - 1;
	youcel();
}
//当前工单首页
function dqshou() {
	pageNumber = 1;
	youcel();
}
//当前工单尾页
function dweiye() {
	pageNumber = totalPage;
	youcel();
}
//当前工单跳转
function dqtiao() {
	pageNd = $("#dqyema").val();
	pageNumber = pageNd.replace(/\D/g, '');
	//在删除绑定事件之前判断小于1时，跳转输入框还是显示1     大于总页数 输入框自动变成总页数  不能跳转
	if (pageNumber < 1) {
		$("#dqyema").val("1");
		return false;
	} else if (pageNumber > totalPage) {
		$("#dqyema").val(totalPage);
		return false;
	}
	youcel();
}


/*****************获取所有工单的id*******/
function taskIdListdsd() {
	var url = "/assist/task/webNowTaskIdList";
	var accNbr = $('#phone').val();
	nextTaskId = hqtaskId;
	var taskId = nextTaskId;
	var options = $("#selectAge option:selected");
	var status = options.val();
	var options1 = $("#selectAge1 option:selected");
	var belongStatus = options1.val();   //获取下拉框的val值
	var isWxComment1 = $("#isWxComment option:selected");
	var isWxComment = isWxComment1.val();
	var reportType1 = $("#reportType option:selected");
	var reportType = reportType1.val();   //上报结果
	var userStatus1 = $("#userStatus option:selected");
	var userStatus = userStatus1.val();  //用户状态
	var completeStatus1 = $("#completeStatus option:selected");
	var completeStatus = completeStatus1.val();  //竣工状态
	//用户归属
	var userRegionId;
	var sheng1 = $("#prefecture option:selected");
	var prefecture = sheng1.val();
	var shi1 = $("#shi option:selected");
	var shi = shi1.val();
	var qu1 = $("#qu option:selected");
	var qu = qu1.val();
	var statusDateStart = $("#statusDateStart").val();
	var statusDateEnd = $("#statusDateEnd").val();
	if (prefecture == "" && shi == "" && qu == "") {
		userRegionId = "";
	}
	else if (prefecture == "") {
		userRegionId = "";
	}
	else if (prefecture != "" && shi == "") {
		userRegionId = prefecture;
	}
	else if (prefecture != "" && shi == "" && qu == "") {
		userRegionId = prefecture;
	} else if (prefecture != "" && shi != "" && qu == "") {
		userRegionId = shi;
	} else if (prefecture != "" && shi != "" && qu != "") {
		userRegionId = qu;
	}
	var request = {
		param: {
			"taskId": nextTaskId,
			"accNbr": accNbr,
			"custName": "",
			"status": status,
			"belongStatus": belongStatus,
			"userRegionId": userRegionId,
			"reportType": reportType,
			"isWxComment": isWxComment,
			"userStatus": userStatus,
			"completeStatus": completeStatus,
			"statusDateStart": statusDateStart,
			"statusDateEnd": statusDateEnd
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
			var taskIdList = data.data.taskIdList;
			sessionStorage.setItem("taskIdList", taskIdList);  //储存id
		}
	})
}

/*************转派*******/      
$("#turnToSend").click(function () {
	var taskId = hqtaskId // 获取到tsskid 点击转派时传给父页面
	var accNbr = $('#phone').val();
	nextTaskId = hqtaskId;
	var taskId = nextTaskId;
	var options = $("#selectAge option:selected");
	var status = options.val(); //执行状态
	var options1 = $("#selectAge1 option:selected");
	var belongStatus = options1.val();   //获取下拉框的val值
	var isWxComment1 = $("#isWxComment option:selected");
	var isWxComment = isWxComment1.val();
	var reportType1 = $("#reportType option:selected");
	var reportType = reportType1.val();   //上报结果
	var userStatus1=$("#userStatus option:selected");  
	var	userStatus =userStatus1.val();  //用户状态
	var completeStatus1 = $("#completeStatus option:selected");
	var completeStatus = completeStatus1.val();  //竣工状态
	//用户归属
	var userRegionId;
	var sheng1 = $("#prefecture option:selected");
	var prefecture = sheng1.val();
	var shi1 = $("#shi option:selected");
	var shi = shi1.val();
	var qu1 = $("#qu option:selected");
	var qu = qu1.val();
	var statusDateStart = $("#statusDateStart").val();
	var statusDateEnd = $("#statusDateEnd").val();
	if (prefecture == "" && shi == "" && qu == "") {
		userRegionId = "";
	}
	else if (prefecture == "") {
		userRegionId = "";
	}
	else if (prefecture != "" && shi == "") {
		userRegionId = prefecture;
	}
	else if (prefecture != "" && shi == "" && qu == "") {
		userRegionId = prefecture;
	} else if (prefecture != "" && shi != "" && qu == "") {
		userRegionId = shi;
	} else if (prefecture != "" && shi != "" && qu != "") {
		userRegionId = qu;
	}
	var person = {
		"taskId": nextTaskId,
		"accNbr": accNbr,
		"status": status,
		"belongStatus": belongStatus,
		"userRegionId": userRegionId,
		"reportType": reportType,
		"isWxComment": isWxComment,
		"userStatus": userStatus,
		"completeStatus": completeStatus,
		"statusDateStart": statusDateStart,
		"statusDateEnd": statusDateEnd
	}
	sessionStorage.setItem("person", JSON.stringify(person));
	parent.zhuanpai();        //iframe中子页面 访问父页面
})

//撤回转派			
function chexiao(obj) {
	var objid = obj.id; //点击那个获取那个id
	parent.chexi(objid);
}

//点击确认按钮 关闭确认弹窗
$(".c").click(function () {
	$("#tanchuang").hide();
})