/**
 * Created by hsgeng on 2016/12/15.
 */
//手风琴菜单
$(".menu_head").click(function(){
	var index=$(".menu_head").index(this);
	$(this).addClass("current").next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
	$(this).siblings().removeClass("current");
	$(".efloat").eq(index).addClass("efloa").siblings().removeClass("efloa");
	
});
$(function(){
   	zuoce(); 	//进入页面就获取左侧的当前菜单
	$("#logdown").html(salesId); //登录成功 号码
	
})
 
//从地址栏获取 
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}
//每次都要传给后台的     是从登录之后获取的token  os 
var  token=sessionStorage.getItem("token");
var  salesId=sessionStorage.getItem("salesId");
var os = "web"; 
var taskId;
//左侧当前工单菜单导航栏
function zuoce(){
 	var url="/assist/task/taskTypeTree";
    var request={
	    	param:{
		    	"salesId":salesId
	    	},
	    	common_param:{
	    		"token":token,
	    		"os":"web"
	    	}
    	};
    $.ajax({
        type : 'post',
        url : url,
        data: {'request':JSON.stringify(request)},
        contentType:'application/x-www-form-urlencoded;charset=UTF-8',
        success: function(data){
			if(data==""||data==undefined||data==null||data=="undefined"){
				location.href='login.html';
			}else{
		    	if(data.error.code==1){
					// var hqname=[];
		    		$.each(data.data.taskType,function(i,item){
						var hqname=item.name;  //获取工单名称
						var hname ="微信";
						if(hqname.indexOf(hname) > -1){  //判断工单名称中是否有微信两个字， 如果成立 则排到前面
							var  str= '<li class="aa title" title="'+item.name+'('+item.doTaskNum+'/'+item.allTaskNum+')" id="'+item.taskId+'">'+item.name+'(<span>'+item.doTaskNum+'</span>/<span>'+item.allTaskNum+'</span>)</li>';
							$("#nav").prepend(str);
						}else{
							var  str= '<li class="aa title" title="'+item.name+'('+item.doTaskNum+'/'+item.allTaskNum+')" id="'+item.taskId+'">'+item.name+'(<span>'+item.doTaskNum+'</span>/<span>'+item.allTaskNum+'</span>)</li>';
							$("#nav").append(str);
						}
		    			var taskId= item.taskId;
		    		})
		    		$("#nav li:nth-child(1)").removeClass('bb')
		    		  //切换二级菜单的内容
		    		$("#nav li").click(function(){	
						var indexx=$("#nav li").index(this);
						$(this).addClass('bb').siblings().removeClass('bb');//给二级菜单添加样式
						$(".undis").eq(indexx).addClass("dis").siblings().removeClass("dis");
						$("input").attr("value","");//每次获取时  都让input的值是空
						var hqtaskId=$(this).attr("id");   //获取当前工单的菜单   点击每个时候   每个工单的id
						sessionStorage.setItem("hqtaskId",hqtaskId);
						//点击菜单时把 taskId传过去
//						if(/\?(.+)/.test(location.search)){
						document.getElementById("iframe").src ='current.html';
//						}
					})		
		    	}
			}
        }
	});  
}


function lishi(){
	document.getElementById("iframe").src='historical.html?token='+token+'&salesId='+salesId+'';
}
function tongji(){
	document.getElementById("iframe").src='statistical.html?&token='+token+'&salesId='+salesId+'';
}

function reportForm() {
    document.getElementById("iframe").src = 'reportForm.html';
}


//转派检索

function turnRetrieve(){
	$("#dispatch").show();
	$("#SelectAll").attr("checked",false);   //点击转派的时候先让   全选框初始化
	var url="/assist/task/webSendTask";
	var indSelect=$("#indSelect option:selected");  
	var	orderType =indSelect.val();  
	var indSel=$("#indSel option:selected");  
	var	statuss =indSel.val();  //执行状态 点击转派的时候有系统默认选择执行状态为“未执行的工单”
	var	person = JSON.parse(sessionStorage.getItem("person"));
 var request={
		 param:{
			 "taskId": person.taskId,
			 "accNbr": person.accNbr,
			 "custName": "",
			 "status": statuss,
			 "belongStatus": person.belongStatus,
			 "userRegionId": person.userRegionId,
			 "reportType": person.reportType,
			 "isWxComment": person.isWxComment,
			 "userStatus": person.userStatus,
			 "completeStatus": person.completeStatus,
			 "orderType": orderType,
			 "statusDateStart": person.statusDateStart,
			 "statusDateEnd": person.statusDateEnd
		 },
		 common_param:{
			 "token":token,
			 "os":"web"
		 }
 };
 $.ajax({
	 type : 'post',
	 url : url,
	 data: {'request':JSON.stringify(request)},
	 contentType:'application/x-www-form-urlencoded;charset=UTF-8',
	 success: function(data){
		 $("#loginMask").show();
		 if(data.error.code==1){
			 $(".dispatch_biao").empty();
			//  if(data.data.jobs==""){  		//转派工单为null时，提示么有可以转派的工单
			// 	// alert("暂无可转派的工单");
			// 	$(".dispatch_biao").html("暂无可转派的工单")
			//  }else{
				 $.each(data.data.jobs,function(i,item){
					 var a = [];
					 a[0]=item.CUST_NAME;
					 a[1]=item.ACC_NBR;
					 a[2]=item.SALES_NAME;
					 a[3]=item.CONTRACT_NAME;
					 for(var i=0;i<a.length;i++){
						 if(a[i]==null){
							   a[i]="";
						 }
					 }
					 $("#dispatch").show();
					 var contractInvalidTime;
					 if(item.CONTRACT_INVALID_TIME==null){
						 contractInvalidTime="";
					 }else{
						 var invalidTime= item.CONTRACT_INVALID_TIME;
						 contractInvalidTime= invalidTime.substr(0,10);
					 }
					 var dispatchstr='<ul class="dispatch_bia">'+
										 '<li title="'+a[0]+'">'+a[0]+'</li>'+
										 '<li title="'+a[1]+'">'+a[1]+'</li>'+
										 '<li title="'+a[2]+'">'+a[2]+'</li>'+
										 '<li title="'+a[3]+'">'+a[3]+'</li>'+
										 '<li title="'+contractInvalidTime+'">'+contractInvalidTime+'</li>'+
										 '<li><input type="checkbox" name="xueli" onclick="select_me();" value="'+item.ID+'"/></li></ul>';
					  $(".dispatch_biao").append(dispatchstr);
				 })				
			//  }
		 }
	 }
 });  
}
// 转派
function zhuanpai(){
	document.getElementById("indSel").options.selectedIndex = 0;  //、让下拉框初始化
	$("#SelectAll").attr("checked",false);   //点击转派的时候先让   全选框初始化
   	var url="/assist/task/webSendTask";
   	var indSelect=$("#indSelect option:selected");  
	var	orderType =indSelect.val();  
	var indSel=$("#indSel option:selected");  
	var	hqstatus =indSel.val();  //执行状态 点击转派的时候有系统默认选择执行状态为“未执行的工单”
	var	person = JSON.parse(sessionStorage.getItem("person"));
	var hqstatus;
	if(person.status=="-1"){
		hqstatus=0;
	}else{
		hqstatus = person.status;
	}
    var request={
	    	param:{
		    	"taskId":person.taskId,
		    	"accNbr":person.accNbr,
		    	"custName":"",
		    	"status":hqstatus,
		    	"belongStatus":person.belongStatus,
		    	"userRegionId":person.userRegionId,
		    	"reportType":person.reportType,
		    	"isWxComment":person.isWxComment,
		    	"userStatus":person.userStatus,
		    	"completeStatus":person.completeStatus,
				"orderType":orderType,
				"statusDateStart": person.statusDateStart,
				"statusDateEnd": person.statusDateEnd
	    	},
	    	common_param:{
	    		"token":token,
	    		"os":"web"
	    	}
	};
    $.ajax({
        type : 'post',
        url : url,
        data: {'request':JSON.stringify(request)},
        contentType:'application/x-www-form-urlencoded;charset=UTF-8',
        success: function(data){
        	$("#loginMask").show();
	    	if(data.error.code==1){
	    		$(".dispatch_biao").empty();
				if(data.data.jobs==""){  		//转派工单为null时，提示么有可以转派的工单
					 if(hqstatus==0){
						 $("#tanchuang1").show();
						 $(".mess1").html("暂无“未执行”状态的工单可转派，如需转派其他执行状态的工单，请选择！");

					}else {
						 $("#tanchuang1").show();
						 $(".mess1").html("暂无工单可转派");
					 }
				}else{
					turnRetrieve();
				}
	    	}
        }
	});  
}

//点击X关闭
$(".guanbi").click(function(){
	$("#box").hide();
	$("#dispatch").hide();
	$("#loginMask").hide();
})

//复选框 ,全选    工单
function selectAll(){
	if ($("#SelectAll").attr("checked")) {
	$(":checkbox").attr("checked", true);
	} else {
		$(":checkbox").attr("checked", false);
	}
}
//取消一个复选框  全选对勾取消
function select_me(){ 
	var xl_arr=$('input:[name="xueli"]');
	$.each(xl_arr,function(i){
		if(!$(xl_arr[i]).attr("checked")){
			$("#SelectAll").attr("checked",false);
			return;
		}
	});
}
//复选框选择
$(".xiayibu").click(function(){
	 var checkboxes = document.getElementsByName("xueli");   //找到name 是xueli 的复选框
	var jobsstr = [];  //定义一个空数组
	for(i=0;i<checkboxes.length;i++){   //遍历出 复选框的长度  有多少
    	if(checkboxes[i].checked){  //复选框选择获取value
        	jobsstr.push(checkboxes[i].value); 
    	}
	}
	if(jobsstr.length<=0){
		$("#tanchuang").show();
		$(".mess").html('必须选择一个转派工单才可以进行转派');
		return;
	}else{
		var jobsss=jobsstr.length //选择了几个复选框
	    $.cookie("jobsss",jobsss); 
		$.cookie("jobs",jobsstr);
		sjr();
	}

})

//获取收件人
function sjr(){
   	var url="/assist/task/sendManager";
    var status =0;
   	var queryStr =$("#jsrcha").val();
    $("#dispatch").hide();
    $("#box").show();
    var request={
	    	param:{
		    	"salesId":salesId,
		    	"queryStr":queryStr
	    	},
	    	common_param:{
	    		"token":token,
	    		"os":"web"
	    	}
  	 };
    $.ajax({
        type : 'post',
        url : url,
        data: {'request':JSON.stringify(request)},
        contentType:'application/x-www-form-urlencoded;charset=UTF-8',
        success: function(data){
	    	if(data.error.code==1){
	    		$(".mingdan").empty();
	    		$.each(data.data.managers,function(z,y){
	    			var c=[];
					c[0]=y.name;
					c[1]=y.salesId;
					c[2]=y.branch;
					c[3]=y.county;
					for(var i=0;i<c.length;i++){
					    if(c[i]==null){
					      	c[i]="";
					    }
					}
					var sendeestr='<ul class="souming">'+
						    			'<li>'+
						    				'<div class="jingliming">'+c[0]+'</div>'+
						    				'<div>'+c[1]+'</div>'+
						    			'</li>'+
						    			'<li class="shiju">'+c[2]+'</li>'+
						    			'<li class="xian" style="width: 75px;">'+c[3]+'</li>'+
						    			'<li class="xuanzekuang" style="width: 23px;">'+
						    				'<input type="checkbox" name="selected" value="'+y.salesId+'"/><br>'+
						    			'</li></ul>';
					 $(".mingdan").append(sendeestr);
	    		})
	    	}
        }
	});  
}
//返回上一步
$(".shangyibu").click(function(){
	$("#box").hide();
	$("#dispatch").show();
})

//选择转派经理 复选框
$(".sousuozhuan").click(function(){
	var jobsss=$.cookie("jobsss"); //获取转派工单的选择个数
	var selecteds = document.getElementsByName("selected");
	var managersstr= [];
	for(i=0;i<selecteds.length;i++){
    	if(selecteds[i].checked){
        	managersstr.push(selecteds[i].value);
    	}
	}
 	var managers=managersstr.toString();
	if(jobsss<managersstr.length){
		$("#tanchuang").show();
		$(".mess").html("选择转派工单人必须大于选择的转派工单才能进行一键转派，请返回上一步重新选择");
		return;
	}else if(managersstr.length<=0){
		$("#tanchuang").show();
		$(".mess").html("必须选择一个转派工单联系人才能进行下一步");
		return;
	}else{
		$.cookie("managers",managers);
		yjzp();
	}
	
})
//么有选择转派工单    关闭提示
function qdla(){
	$("#tanchuang").hide();
}
//一键转派 提交转派
function yjzp(){
   	var url="/assist/task/sendReport";
    var jobs=$.cookie('jobs'); 
    var managers=$.cookie("managers");
    var request={
	    	param:{
		    	"managers":managers,
		    	"jobs":jobs
	    	},
	    	common_param:{
	    		"token":token,
	    		"os":"web"
	    	}
  	 };
    $.ajax({
        type : 'post',
        url : url,
        data: {'request':JSON.stringify(request)},
        contentType:'application/x-www-form-urlencoded;charset=UTF-8',
        success: function(data){
	    	if(data.error.code==1){
				$("#box").hide();
	    		$("#tanchuang1").show();
				$(".mess1").html(data.error.message);
	    	}
        }
	});  
}


//撤销转派
var cheid;
function chexi(hqid){
	$("#tan").show();
	$("#loginMask").show();
	cheid=hqid;
}
//不进行转派  关闭弹窗
$(".butt").click(function(){
	$("#tan").hide();
	$("#loginMask").hide();
})

//点击撤回按钮,撤回转派
function cxzp(){
   	var url="/assist/task/callback";
	var id =cheid;
     var request={
	    	param:{
		    	"salesId":salesId,
		    	"id":cheid
	    	},
	    	common_param:{
	    		"token":token,
	    		"os":"web"
	    	}
  	 };
    $.ajax({
        type : 'post',
        url : url,
        data: {'request':JSON.stringify(request)},
        contentType:'application/x-www-form-urlencoded;charset=UTF-8',
        success: function(data){
	    	if(data.error.code==1){
	    		$("#tanchuang1").show();
	    		$("#tan").hide();
				$(".mess1").html(data.error.message);
	    	}
        }
	});
}
//完成转派关闭页面
$(".queding1").click(function(){
	$()
	$("#tanchuang1").hide();
	$("#loginMask").hide();
	right.location.reload(true); //刷新iframe页面
})



/*******修改密码 atart***********/

/*
 *  密码都需要用md5 进行加密
 */
$('#goSubmit').click(function(){
	var url = "/assist/user/modifyPwd";
	var oldPassword = $("#oldPassword").val();
	if (oldPassword == "" || oldPassword == null) {
		alert("请输入旧密码！");
		return;
	}
	var oldPasswordl = $.md5(oldPassword);
	var newpassword = $('#newpassword').val();
	if (newpassword == "" || newpassword == null) {
		alert("请输入新密码！");
		return;
	}
	var password = $.md5(newpassword); //对密码进行md5加密
	var request = {
		param: {
			"oldPassword": oldPasswordl,
			"password": password
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
		success: function (date) {
			if (date.error.code == 1) {
				alert("恭喜您，密码修改成功，需要重新登录！");
				window.location.href = 'login.html';
			}else{
				alert(date.error.message);
			}
		}
	});
});

/*******修改密码 end***********/
