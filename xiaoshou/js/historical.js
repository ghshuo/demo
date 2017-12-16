$(function(){
	leixing();
})
  
//从地址栏获取 
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}
//每次都要传给后台的     是从登录之后获取的token  os 
//var token = GetQueryString("token");
//var salesId = GetQueryString("salesId");
var  token=sessionStorage.getItem("token");
var  salesId=sessionStorage.getItem("salesId");
var os = "web"; 
// 历史工单任务类型列表
function leixing(){
   	var url="/assist/task/taskTypeList";
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
        	var str981=
	    			'<option value="">全部查询</option>';
	    			$("#selectAgeee").append(str981);
	    	$.each(data.data.taskTypeList,function(i,item){					           	
	    		var str98=
	    			'<option value="'+item.ID+'">'+item.NAME+'</option>';
	    		$("#selectAgeee").append(str98);
	    	})
	    	lishil();
        }
	});  
}
//历史工单
var pageNumber,nextPag,totalPage;
function lishil(){
	
	pageNumber=1;
	liasdaas();
}

function liasdaas(){
   	var url="/assist/task/webHisTakeList";
// 	$("input").attr("value","");
//  var custName = $('#name1').val();
    var downTime = $("#downTime").val();
    var Deadline = $("#Deadline").val();
    var accNbr = $('#phone1').val();
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    var statusDateStart = $('#statusDateStart').val();
    var statusDateEnd = $('#statusDateEnd').val();
   	var options=$("#selectAge2 option:selected"); 
   	var	status =options.val();
   	var options2=$("#selectAgeee option:selected"); 
   	var	taskId =options2.val();
   	var options1=$("#selectAge3 option:selected"); 
   	var	belongStatus =options1.val();
   	var pageSize =10;
   	$("#loadingMask").show();
   	var request={
	    	param:{
		    	"taskId":taskId,
		    	"startDate":startDate,
		    	"endDate":endDate,
		    	"accNbr":accNbr,
		    	"custName":"",
		    	"status":status,
		    	"belongStatus":belongStatus,
		    	"pageNumber":pageNumber,
				"pageSize":10,
				"statusDateEnd": statusDateEnd,
                "statusDateStart": statusDateStart,
                "downTime": downTime,
                "Deadline": Deadline
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
			$(".historyWork").empty();
	    	if(data.error.code==1){
	    		$("#loadingMask").hide();
	    		var historStr='<li id="history">'+
//								'<div style="width:3%;"><span>序列</span></div>'+
								'<div><span>原始工单</span></div>'+
								'<div><span>任务名称</span></div>'+
								'<div><span>下发时间</span></div>'+
								'<div><span>截止时间</span></div>'+
								'<div style="width:18%;"><span>用户归属</span></div>'+
								'<div><span>微信留言</span></div>'+
								'<div><span>客户名称</span></div>'+
								'<div><span>客户号码</span></div>'+
								'<div><span>执行状态</span></div>'+
								'<div><span>归属状态</span></div>'+
								'<div><span>竣工情况</span></div>'+
								'<div><span>操作</span></div>'+
							'</li>';
				$(".historyWork").html(historStr);
	    		$.each(data.data.taskList,function(z,y){
	    			var a=[];
					a[0]=y.parRegionName;
					a[1]=y.branch;
					a[5]=y.region;
					a[7]=y.custName;
					a[8]=y.accNbr;
					a[9]=y.des;
					a[9] = y.des;
					a[10] = y.reportType;
					a[11] = y.reportReason;
					for(var i=0;i<a.length;i++){
					    if(a[i]==null){
					      	a[i]="";
					    }
					}
					switch (y.status){
						case 0:
							a[2]='未执行';
							break;
						case 1:
							a[2]='执行成功';
							break;
						case 2:
							a[2]='执行失败';
							break;
						case 3:
							a[2]='延迟执行';
							break;	
						default:
							break;
					}
					switch (y.belongStatus){
						case '0':
							a[3]='自有';
							break;
						case '1':
							a[3]='转出';
							break;
						case '2':
							a[3]='转入';
							break;
						default:
							break;
					}
					switch (y.completeFlag){//竣工
						case 0:
							a[4]='未竣工';
							break;
						case 1:
							a[4]='竣工';
							break;
						default:
							break;
					}
					switch(y.isWxComment){
						case 0:
							a[6]='否';
							break;
						case 1:
							a[6]='是';
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
					var informationShow = ''+balanceAccount+' ; 用户状态'+ a[8]+' ;'+a[10]+' '+a[11]+' '+a[9]+'';
					//取到开始时间 日期 去掉分秒  字符串截取
					// var start = y.startDate;
					// var startDate= start.substr(0,10);
					// var endd = y.endDate;
					// var endDate= endd.substr(0,10);
					//给是偶数的哪行添加背景色
					$(".shensdas:even").css({'background':'#f3fbff'});
					var str4='<li class="shensdas">'+
//								'<div class="shad" style="width: 3%;"></div>'+
								'<div><span class="title" title="'+y.initialName+'">'+y.initialName+'</span></div>'+
								'<div><span class="title" title="'+y.taskName+'">'+y.taskName+'</span></div>'+
						'<div><span class="title" title="' + y.startDate + '">' + y.startDate+'</span></div>'+
						'<div><span class="title" title="' + y.endDate + '">' + y.endDate+'</span></div>'+
								'<div style="width:18%;"><span class="title" title="'+a[0]+'" style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+a[0]+'</span></div>'+
								'<div><span class="title" title="'+a[6]+'">'+a[6]+'</span></div>'+
								'<div id="name_'+y.id+'"><span class="title" title="'+informationShow+'">'+a[7]+'</span></div>'+
								'<div id="staus_'+y.id+'"><span class="title" title="'+informationShow+'">'+y.accNbr+'</span></div>'+
								'<div><span class="title" title="'+informationShow+'">'+a[2]+'</span></div>'+
								'<div id="zi_'+y.id+'"><span class="title" title="'+a[3]+'">'+a[3]+'</span></div>'+
								'<div id="jun_'+y.id+'"><span class="title" title="'+a[4]+'">'+a[4]+'</span></div>'+
								'<div><span><a href="information.html?ha='+y.id+'" target="view_window"><div class="xiang2" style="width:42px;">详情</div></a></span></div>'+
							'</li>';
					 $(".historyWork").append(str4); 
					var cta ="1";
					sessionStorage.setItem("cta",cta);
//					 通过“客户号码” 列字体颜色区分用户状态：
					if(y.userStatus==0){
						$('.shensdas #staus_'+y.id).css("color","#63ce93");
					}else if(y.userStatus==1){
						$('.shensdas #staus_'+y.id).css("color","#e4e413");
					}else if(y.userStatus==2){
						$('.shensdas #staus_'+y.id).css("color","#ffcf3e");
					}else if(y.userStatus==3){
						$('.shensdas #staus_'+y.id).css("color","#ff5959");
					}
//					通过“客户名称” 列字体颜色区分账户余额：
					if(y.userBalance<5){
						$('.shensdas #name_'+y.id).css("color","#ff5959");
					}else if(y.userBalance>5&&y.userBalance<10){
						$('.shensdas #name_'+y.id).css("color","#2f8acb");
					}else{
						$('.shensdas #name_'+y.id).css("color","");
					}
					
//					 通过“归属状态” 列字体颜色区分归属状态
					if(y.belongStatus=='0'){
						$('.shensdas #zi_'+y.id).css("color","#63ce93");
					}else if(y.belongStatus=='1'){
						$('.shensdas #zi_'+y.id).css("color","#ccc");
					}else if(y.belongStatus=='2'){
						$('.shensdas #zi_'+y.id).css("color","#2f8acb");
					}
					if(y.assessment==0){
						$('.shensdas #jun_'+y.id).css("color","#ccc");
					}else if(y.assessment==1){
						$('.shensdas #jun_'+y.id).css("color","#2f8acb");
					}else if(y.assessment==2){
						$('.shensdas #jun_'+y.id).css("color","");
					}else if(y.assessment==3){
						$('.shensdas #jun_'+y.id).css("color","#ff5959");
					}
	    		})
	    		//排序
//	    		var len = $('.historyWork li').length;
//			        for(var i = 1;i<len;i++){
//			            $('.historyWork li:eq('+i+') div:first').text(i);
//			    }
				var total =data.data.total;    //取出输入框的总条数
				totalPage=Math.ceil(total/pageSize); //算出总页数 
				$("#yema").val(pageNumber); //把pageNumber给了跳转输入框 
				if(pageNumber>1 && pageNumber<totalPage){    //页数大于1小于总页数时都添加上点击事件
				 	$("#shou").attr("onclick","shouye();");
				 	$("#shang").attr("onclick","shang();");
				 	$(".butto").attr("onclick","tiao();");
				 	$("#xia").attr("onclick","xia();")
				 	$("#weiye").attr("onclick","weiye();");
				}else{
					if(pageNumber<=1){ //小于1时  删除上一页和首页的点击事件
					 	pageNumber=1; 
					 	$("#yema").val(pageNumber); 
					 	$("#shou").removeAttr("onclick");
					 	$("#shang").removeAttr("onclick");
					 	$("#xia").attr("onclick","xia();")
					 	$("#weiye").attr("onclick","weiye();");
					}
					if(pageNumber>=totalPage){ //大于总页数时  删除下一页和跳转的点击事件
						pageNumber=totalPage;   
						$("#yema").val(pageNumber); 
						$("#shou").attr("onclick","shouye();");
				 		$("#shang").attr("onclick","shang();");
					 	$("#xia").removeAttr("onclick");
					 	$("#weiye").removeAttr("onclick");
					}		 
				}
				var str33 ='<div class="pagez">共<span>'+pageNumber+'</span>/<span class="pagezz">'+totalPage+'</span>页</div>';
    			$(".pagez").html(str33);
	    	}
        }
	});  
}
//跳转
function tiao(){
	pageN =$("#yema").val();
	pageNumber=pageN.replace(/\D/g,'');
	//在删除绑定事件之前判断小于1时，跳转输入框还是显示1     大于总页数 输入框自动变成总页数  不能跳转
	if(pageNumber<1){  
		$("#yema").val("1");
		return false;
	}else if(pageNumber>totalPage){
		$("#yema").val(totalPage);
		return false;
	}
   	liasdaas();
}
//下一页
function xia(){
	nextPag=$("#yema").val();
	pageNumber=Number(nextPag)+1;
   liasdaas();
}
//上一页
function shang(){
   nextPag=$("#yema").val();
   if(nextPag==1){
	   return;
   }else{
		pageNumber=Number(nextPag)-1;
   		liasdaas();
   }
	
}
//首页
function shouye(){
   pageNumber =1;
   liasdaas();
}
//尾页
function weiye(){
	pageNumber=totalPage;
	liasdaas();
}

