/**
 * Created by hsgeng on 2017/3/20.
 */
//获取地址栏
var offerId,planId,prodNumList,contact1,accnbr,corelinkman,editSms;
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}	
var  token=sessionStorage.getItem("token");
var  salesId=sessionStorage.getItem("salesId");
var  cta=sessionStorage.getItem("cta");
    var id = GetQueryString("ha");  
$(function(){
	webTakeInfo(id);
	asd();
})
function asd(){
	var a1 = sessionStorage.getItem("taskIdList");
	var a2 =a1.split(",");
		if(id != a2[0]){
			$("#previousBtn").attr("onclick","previous()");
		}
	}

function webTakeInfo(idVal){
	var url="/assist/task/webTakeInfo";
	
    var os = "web";
    var request={
	    	param:{
		    	"id":idVal
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
        beforeSend:function(xhr){ 
   			$("#loadingMask").show();
		},
        success: function(data){
			$("#loadingMask").hide();
			if(data==""||data==undefined||data==null||data=="undefined"){
				location.href='login.html';
			}else{
				if(data.error.code==1){
					var task=data.data.taskjob;
					if(task!=null){
					var a=[];
						a[4]=task.par_region_name;
						// a[5]=task.branch
						a[6]=task.sales_name;
						a[7]=task.charge_type;
						a[8]=task.vid_rank;
	//      			a[11]=task.des;
						a[12]=task.contract_name;
					for(var i=0;i<a.length;i++){
							if(a[i]==null){
								a[i]="";
							}
						}
						
					switch (task.user_status){ //用户状态
						case 0:
							a[1]='正常';
							break;
						case 1:
							a[1]='单停';
							break;
						case 2:
							a[1]='双停';
							break;
						case 3:
							a[1]='已拆机';
							break;	
						default:
							break;
					}
					switch (task.acc_type){  //接入方式
						case 1:
							a[2]='非光纤';
							break;
						case 2:
							a[2]='非光纤';
							break;
						case 3:
							a[2]='非光纤';
							break;
						case 4:
							a[2]='非光纤';
							break;
						case 5:
							a[2]='光纤';
							break;
						default:
							break;
					}
					
					//用户基础信息
					$('#cust_name').html(task.cust_name);
					$('#acc_nbr').html(task.acc_nbr);
					accnbr=task.acc_nbr;//工单用户手机
					$('#parReginName').html(task.par_region_name);
	//      		$('#county').html(task.county);
	//      		$('#branch').html(task.branch);
					$('#site_name').html(task.site_name);
					$('#channel_name').html(task.channel_name);
					belongStatus = task.belong_status;
					if(belongStatus==1){
						$("#duanxin").hide();
						$("#shangbao").hide();
						$(".reportBut").removeAttr("onclick");
						$(".reportBut").css("cursor","not-allowed");
					}
					$('#user_status').html(a[1]);
					$('#vid_rank').html(task.vid_rank);
					$('#charge_type').html(task.charge_type);
					$('#user_balance').html(task.user_balance);
					switch (task.is_4g_card){  //接入方式
						case 0:
							a[9]='否';
							break;
						case 1:
							a[9]='是';
							break;
						default:
							break;
					}
					$('#is_4G_card').html(a[9]);
					switch (task.is_4g_card){  //接入方式
						case 0:
							a[10]='否';
							break;
						case 1:
							a[10]='是';
							break;
						default:
							break;
					}
					$('#is_4G_term').html(a[10]);
					$('#acc_type').html(a[2]); //接入方式
					$('#acc_rate').html(task.acc_rate);
					$('#term_mode').html(task.term_mode);
					$('#online_time').html(task.online_time);
					$('#contact1').html(task.contact1);
					$('#contact2').html(task.contact2);
					$('#contact3').html(task.contact3);
	//      		成员号码中间隔冒号替换成空格
					var prod=task.prod_num_list;
					if(prod==null||prod==""){
						$('#prod_num_list').html("");
					}else{
						prod = prod.replace(/:/g,' ');
						$('#prod_num_list').html(prod);//成员号码
					}
					prodNumList=task.prod_num_list;
					contact1 = task.contact1
					//用户行为信息
					$('#avg_bill').html(task.avg_bill);
					$('#mon_Bill').html(task.mon_bill);
					$('#avg_voice').html(task.avg_voice);
					$('#mon_Voice').html(task.mon_voice);
					$('#avg_flow').html(task.avg_flow);
					$('#mon_Flow').html(task.mon_flow);
					$('#last_sale_flow').html(task.last_sale_flow);
					// $('#cur_bill').html(task.cur_bill);
					$('#last_band_flow').html(task.last_band_flow);
					// $('#cur_flow').html(task.cur_flow);
					$('#last_stop_cnt').html(task.last_stop_cnt);
					// $('#cur_voice').html(task.cur_voice);
					$('#last_owe_cnt').html(task.last_owe_cnt);
					//销售品信息
					$('#sales_name').html(task.sales_name);
					$('#sales_create_time').html(task.sales_create_time);
					$('#amount').html(task.amount);
					$('#offer_channel').html(task.offer_channel);
					$('#contract_name').html(task.contract_name);
					$('#contract_create_time').html(task.contract_create_time);
					$('#contract_invalid_time').html(task.contract_invalid_time);
					$('#plan_channel').html(task.plan_channel);
					$('#req_pkg_name').html(task.req_pkg_name);
					$('#itv_pkg_name').html(task.itv_pkg_name);
					$('#band_pkg_name').html(task.band_pkg_name);
					$('#subsidy_type').html(task.subsidy_type);
					//用户特征描述
					// var str='<span>&nbsp;'+task.cust_name+'</span>'+
					// 		'<span>&nbsp;'+a[4]+'</span>'+
					// 		// '<span>&nbsp;'+a[5]+'</span>'+
					// 		'<span>&nbsp;'+a[6]+'</span>'+
					// 		'<span>&nbsp;'+a[12]+'</span>'+
					// 		'<span>&nbsp;'+a[7]+'</span>'+
					// 		'<span>&nbsp;'+a[8]+'</span>';
					// $('.describe_name').html(str);
					var contentstr=task.content;
					if(contentstr!=null){
						$("#content_div").html(contentstr);
						$("#content").html(contentstr);
						$("#content").hide();
					}
					$('#sms_content').val(task.sms_content); //销售短信
					//备注及上报
					$('#assessment_des').html(task.assessment_des);  //评估结果
					offerId=task.offer_id;
					planId=task.plan_id;
					}
					//用户特征描述
					var	userCharacter=data.data.userCharacter;
					if(userCharacter!=null){
						$('#portrait').html(userCharacter.USER_DRAW);
						$('#product').html(userCharacter.PRO_INFO);
						$('#terminal').html(userCharacter.TERM_INFO);
						$('#behavi').html(userCharacter.USE_BEHAVIOR);
						$('#dpi').html(userCharacter.DPI_INFO);
					}
					
					//推荐方案
					var	userRecommend=data.data.userRecommend;
					if(userRecommend!=null){
						$("#leftVule").html(userRecommend.RAISE_VALUE);
						$("#hedge").html(userRecommend.KEEP_VALUE);
						$("#dropVule").html(userRecommend.DEP_VALUE);
						$("#stream").html(userRecommend.MAIN_VALUE);
					}
					corelinkman = task.core_linkman;  //修改主联系人
					editSms=task.is_edit_sms_content;  //是否能编辑短信
	//				console.log(editSms);

				}
			}
			webTakeInfoCur(accnbr);
			taskJobRecordList();  
			//工单详情页面加载完之后采取加载外呼			
	
        },
        error:function(){
	      	$("#loadingMask").hide();
			$("#informtion").hide();
			alert('服务器连接失败')
			// wrapper();
		},
  	 })
}

// 流量话费实时查询接口
function webTakeInfoCur(jsb){
	var url='/assist/task/webTakeInfoCur';
	var accNbr=jsb; 
	var request={
	    	param:{
		    	"accNbr":accNbr       //工单用户号码
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
				$('#cur_bill').html(data.data.cur_bill);
        		$('#cur_flow').html(data.data.cur_flow);
        		$('#cur_voice').html(data.data.cur_voice);
			}
		}
	});
}
//成员webProdList
function webProdList(){
	$('#sms_content').attr("readonly","readonly");
	var url="/assist/task/webProdList";
    var os = "web";
    var request={
	    	param:{
		    	"prodNumList":prodNumList
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
        		$("#contract").show();
	    		$("#loginMask").show();
	    		$("#contract_c").show();
	    		$("#contract_con").hide();
	    		$("#con_img").html('<img src="img/yhtz.png"/>');
	    		$(".sheng").html('套餐成员信息');
	    	 	var	webProdListstr ='<li class="chengy">'+
	    	 							'<div style="width:6%;height:30px;">序列</div>'+
										'<div>用户号码</div>'+
										'<div>用户姓名</div>'+
										'<div>用户状态</div>'+
										'<div>产品类型</div>'+
										'<div>活跃度</div>'+
										'<div>主副卡 </div>'+
										'<div>话语权</div>'+
									'</li>';
				$(".members").html(webProdListstr);
					$("#corlin").val(corelinkman);
				$.each(data.data.prodList,function(i,item){
					var b=[];
					b[3]=item.PROD_SPEC_NAME;
					b[4]=item.SPEAK_RIGHT;
					b[5]=item.ACC_NBR;
					b[6]=item.CUST_NAME;
					b[7]=item.IS_ACTIVE;
					b[8]=item.IS_MAIN_CARD;
	        		for(var i=0;i<b.length;i++){
						    if(b[i]==null){
						      	b[i]="";
						    }
						}
						
					switch (item.USER_STATUS){ //用户状态
						case 0:
							b[1]='正常';
							break;
						case 1:
							b[1]='单停';
							break;
						case 2:
							b[1]='双停';
							break;
						case 3:
							b[1]='已拆机';
							break;	
						default:
							break;
					}
					switch (item.IS_ACTIVE){ //是否活跃
						case 0:
							b[2]='低';
							break;
						case 1:
							b[2]='一般';
							break;
						case 2:
							b[2]='高';
							break;
						case 3:
							b[2]='较高';
							break;
						default:
							break;
					}
					switch(item.IS_MAIN_CARD){
						case 0:
							b[8]='副卡';
							break;
						case 1:
							b[8]='主卡';
							break;	
						default:
							break;
					}
					var	Liststr ='<li class="contr_ull">'+
											'<div style="width:6%;height:30px;"></div>'+
											'<div><span class="title" title="'+b[5]+'">'+b[5]+'</span></div>'+
											'<div><span class="title" title="'+b[6]+'">'+b[6]+'</span></div>'+
											'<div><span class="title" title="'+b[1]+'">'+b[1]+'</span></div>'+
											'<div><span class="title" title="'+b[3]+'">'+b[3]+'</span></div>'+
											'<div><span class="title" title="'+b[2]+'">'+b[2]+'</span></div>'+
											'<div><span class="title" title="'+b[8]+'">'+b[8]+'</span></div>'+
											'<div><span class="title" title="'+b[4]+'">'+b[4]+'</span></div>'+
										'</li>';
					$(".members").append(Liststr);
					var len = $('.members li').length;
			        for(var i = 1;i<len;i++){
			            $('.members li:eq('+i+') div:first').text(i);
			    	}
					$(".members li:odd").css({'background-color':'#e8dbdb'});
				});
        	}
        }
    })
}


//套餐描述
function webOfferDesc(){
	$('#sms_content').attr("readonly","readonly");
	$("#ch_messages").html("");
	var url="/assist/task/webOfferDesc";
    var os = "web";
//  console.log(offerId);
    var request={
	    	param:{
		    	"offerId":offerId
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
	        	$("#contract").show();
	    		$("#loginMask").show();
	    		$("#contract_con").show();
	    		$("#contract_c").hide();
//	    		$("#contract").css("position","absolute");
//      		$("#contract").css("top","60%");
	    		var desca=data.data.desc;
	    		var contract_con= document.getElementById("contract_con");
	    		if(desca!=null){
		    		var a=desca.split(/\s+/g);  //后台获取的数据分段显示
					contract_con.innerHTML='';
					 for (var i = 0; i < a.length; i++) {
					 	contract_con.innerHTML+= a[i]+'<br/>';
					 };	
	    		}
	    		$(".sheng").html('套餐描述信息');
    		}
        }
    })
}
//合约描述
function webPlanDesc(){
	$('#sms_content').attr("readonly","readonly");
	$("#ch_messages").html("");
	var url="/assist/task/webPlanDesc";
    var os = "web";
//  console.log(planId);
    var request={
	    	param:{
		    	"planId":planId
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
        		$("#contract").show();
        		$("#loginMask").show();
        		$("#contract_con").show();
        		$("#contract_c").hide();
        		var descal=data.data.desc;
	    		var contract_con= document.getElementById("contract_con");
        		if(descal!=null){
		    		var b=descal.split(/\s+/g);  //后台获取的数据分段显示
					contract_con.innerHTML='';
					 for (var i = 0; i < b.length; i++) {
					 	contract_con.innerHTML+= b[i]+'<br/>';
					 };
        		}
        		$(".sheng").html('合约描述信息');
        	}
        	
        }
    })
}
//关闭合约描述
function contractClose(){
	$("#contract").hide();
    $("#loginMask").hide();
}
// 点击成员弹框，点击套餐名称弹框 ，合约名称弹框
 (function(){
        function Event(e){
            var oEvent = document.all ? window.event : e;
            if (document.all) {
                if(oEvent.type == "mouseout") {
                    oEvent.relatedTarget = oEvent.toElement;
                }else if(oEvent.type == "mouseover") {
                    oEvent.relatedTarget = oEvent.fromElement;
                }
            }
            return oEvent;
        }
        var Contains = function(a, b){
            return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
        }
		var webProd= document.getElementById('prod_num_list');
        var tip = document.getElementById('contract');
		var webOfferc= document.getElementById('sales_name');
		var webPlan= document.getElementById('contract_name');
		webProd.onmouseover = function(e){
			webProdList();
        }
		webOfferc.onmouseover = function(e){
			webOfferDesc();
        }
		webPlan.onmouseover = function(e){
			webPlanDesc();
        }
        tip.onmouseout = function(e){
            var o = Event(e).relatedTarget;
            if(!Contains(this, o)){
	                contractClose();
            }
        }
 })();
//工单流转记录列表
function taskJobRecordList(){
	var url="/assist/task/taskJobRecordList";
    var os = "web";
    var request={
	    	param:{
		    	"id":id
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
        	$("#liuzhuan").empty(); 
        	if(data.error.code==1){
        		if(data.data.taskJobRecordList== ""){
        			$("#liuzhuan").html('<p style="width: 100%;height: 100px;float: left;text-align: center;line-height: 100px;">该工单暂无流转记录</p>');
        		}else{
	        		var liusStr= '<li class="liuls">'+
							'<div><span>操作时间</span></div>'+
							'<div><span>操作人</span></div>'+
							'<div><span>类型</span></div>'+
							'<div><span>起始部门</span></div>'+
							'<div><span>目标部门</span></div>'+
							'<div><span>起始业务员</span></div>'+
							'<div><span>目标业务员</span></div>'+
							'<div><span>执行状态</span></div>'+
							'<div><span>反馈类型</span></div>'+
							'<div><span>反馈原因</span></div>'+
							'<div><span>备注</span></div>'+
						'</li>';
					$("#liuzhuan").append(liusStr);
						$.each(data.data.taskJobRecordList,function(i,item){
							var a=[]; //定义一个空数组
								a[1]=item.OPERATOR;
								a[2]=item.CREATE_DATE;
								a[3]=item.FROM_REGION;
								a[4]=item.TO_REGION;
								a[5]=item.FROM_SALE;
								a[6]=item.TO_SALE;
								a[7]=item.REPORT_STATUS;
								a[8]=item.REPORT_TYPE;
								a[9]=item.REPORT_REASON;
								a[10]=item.DES;
								for(var i=0;i<a.length;i++){
								    if(a[i]==null||a[i]=="null"||a[i]==""){
								      	a[i]="";
								    }
								}
								switch (item.TYPE){  //当 任务状态（0：未执行，1：执行成功，2：执行失败，3：延时执行）页面显示相应的文字
									case 1:
										a[0]='派发';
										break;
									case 2:
										a[0]='转派';
										break;
									case 3:
										a[0]='回收';
										break;
									case 4:
										a[0]='外呼';
										break;
									case 5:
										a[0]='短信';
										break;
									case 6:
										a[0]='营业厅';
										break;
									case 7:
										a[0]='上门';
										break;	
									case 8:
										a[0]='微信/QQ';
										break;
									case 9:
										a[0]='邮件';
										break;
									case 10:
										a[0]='宽带弹屏';
										break;
									case 11:
										a[0]='其他';
										break;
									default:
										break;
								}
								var liuStr= '<li class="liu">'+
										'<div><span title="'+a[2]+'" style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+a[2]+'</span></div>'+
										'<div><span title="'+a[1]+'" style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+a[1]+'</span></div>'+
										'<div><span title="'+a[0]+'">'+a[0]+'</span></div>'+
										'<div><span title="'+a[3]+'">'+a[3]+'</span></div>'+
										'<div><span title="'+a[4]+'">'+a[4]+'</span></div>'+
										'<div><span title="'+a[5]+'">'+a[5]+'</span></div>'+
										'<div><span title="'+a[6]+'">'+a[6]+'</span></div>'+
										'<div><span title="'+a[7]+'">'+a[7]+'</span></div>'+
										'<div><span title="'+a[8]+'">'+a[8]+'</span></div>'+
										'<div><span title="'+a[9]+'" style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+a[9]+'</span></div>'+
										'<div><span title="'+a[10]+'" style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+a[10]+'</span></div>'+
									'</li>';
								$("#liuzhuan").append(liuStr);
								$(".liu:even").css({'background':'#dde5e8'});	
						})
					}
        	}
        	
        }
    })
}

if(cta==2){
	//修改主联系人手机号码
	function editCoreLinkMan(){
		var url="/assist/task/editCoreLinkMan";
		var os = "web";
		var coreLinkMan=$("#corlin").val();
		var accNbr=accnbr;
	    var request={
		    	param:{
			    	"coreLinkMan":coreLinkMan,
			    	"accNbr":accNbr
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
					$("#ch_messages").html(data.error.message).show(300).delay(5000).hide(300);
					corelinkman =coreLinkMan;  //修改联系人成功之后， 把手机号再次赋值给全局变量，   防止关闭页面之后再次打开主联系人手机号码么有变化
					$("#corlin").val(corelinkman);
				}
		    }
		})
	}
	//发送短信
	var phone;
	function singleSend(){
//	    phone = GetQueryString("phone");
		phone = accnbr
	    var reg = /^(180|189|133|153|177|173|181)\d{8}$/;
	    if (!reg.test($.trim(phone))){
	    	phone=contact1;
	    	if(!reg.test($.trim(phone))){
	    		$("#loginMask").show();
				$("#newspapers").show();
				$(".newsmeagess").html("对不起用户不是贵州手机号，不能发送短信！");
	    	}else{
	   			dux();
	    	}
	    }else{
	    	dux();
	    }
	}
//	发送给自己短信
	function yourself(){
		phone=salesId;
		var reg = /^(180|189|133|153|177|173|181)\d{8}$/;
		if (!reg.test($.trim(phone))){
	    		$("#loginMask").show();
				$("#newspapers").show();
				$(".newsmeagess").html("对不起你不是贵州手机号,不能发送短信!");
	    }else{
	   			dux();
	    }
	}
	function dux(){
		$('#sms_content').attr("readonly","readonly");
		var url="/assist/sms/singleSend";
	    var os = "web";
	 	var content=$("#sms_content").val();
	    var request={
		    	param:{
			    	"id":id,
			    	"content":content,
			    	"phone":phone
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
		        	$("#loginMask").show();
					$("#newspapers").show();
					$(".newsmeagess").html(data.error.message);
	        	}
	        }
	   })
	}
	//点击编辑短信，移除textarea 中的禁止输入的readonly属性
	function sing(){
		if(editSms==1){
			$("#sms_content").removeAttr("readonly","readonly");
			$("#bianji").html("请在下面进行编辑").show(300).delay(5000).hide(300)
		}else{
			$("#loginMask").show();
			$("#newspapers").show();
			$(".newsmeagess").html("对不起，您没有权限编辑短信！如有需要，请联系地市管理员到后台添加权限！");
		}
	}
	//点击编辑销售术语
	function singbtn(){
		$("#content").show();
		$("#content_div").hide();
		$("#content").removeAttr("readonly","readonly");
	}
	//保存销售术语
	function baoCun(){
		var url="/assist/task/editContent";
		var os = "web";
		var content=$("#content").val();
		var request={
			param:{
				"id":id,
				"content":content
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
					alert(data.error.message);
				}else{
					alert(data.error.message);
				}
			}
		})
	}
	
	
	
	
	//上一条工单
	function previous(){
	 	var a1 = sessionStorage.getItem("taskIdList");
		var a2 =a1.split(",");
		for(var i=0;i<a2.length;i++){
			var a4=a2.length;
			if(a4==1){
				alert("已经没有工单");
				$("#previousBtn").removeAttr("onclick");
				return;
			}else{
				if(id==a2[i]){
					id=a2[i-1];
					if(id == a2[0]){
						webTakeInfo(id);
						$("#previousBtn").removeAttr("onclick");
					}else {
						webTakeInfo(id);
					}
				}
			}
		}
	}
	//下一条工单
	function MsoNavNext(){
		var a1 = sessionStorage.getItem("taskIdList");
		var a2 =a1.split(",");
		for(var i=0;i<a2.length;i++){
			var a4=a2.length;
			if(a4==1){    //只有一条工单的时候   return
				alert("已经没有工单");
				return;
			}else{
				var a5= a4 - "1";
				if(id==a2[i]){  //当工单的值 和sessionStorage取到值相同的时候   i的下标+1
					id=a2[i+1];
					webTakeInfo(id);
					$("#previousBtn").attr("onclick","previous()");
					return;		
				}else if(id == a2[a5]){
					alert("已经没有工单");
					return;
				}
				
			}
		}
	}
	
	
	
	$('#global_location').cxSelect({
		url: 'js/globalData.json',
		selects: ['country', 'state', 'city'],
		nodata: 'none'
	});
	
	//执行状态
	$(".country").change(function(){
		$("#dess").hide();
		$("#dess").val("");
		$("#des").val("");
	})
	//反馈类型
	$(".state").change(function(){
		$("#dess").hide();
		$("#dess").val("");
		$("#des").val("");
		if($(".state").val()=="其他"){
			$("#dess").show();
			$("#des").val("");
			$("#dess").val("");
			$("#des").hide();
		}else if($(".state").val()!="其他"){
			$("#des").hide();
			$("#des").val("");
		}
	})
	function weasd(){
		if($("#dess").val()!=""){
			$("#des").show();
			$("#des").css("height","85px");
		}else{
			$("#des").hide();
		}
	}
	//反馈原因
	$(".city").change(function(){
		$("#dess").val("");
		$("#des").val("");
		if($(".city").val()!="0"){
			$("#des").show();
			$("#des").css("height","174px");
		}else if($(".city").val()=="0"){
			$("#des").hide();
		}else{
			$("#dess").hide();
		}
	})
	//上报
	function reportJob(){
		var url="/assist/task/reportJob";
	    var os = "web";
	    var status = $(".country").val();
		var des = "";
		var reportReason = $(".city").val();
	    var reportType=$(".state").val();
	    //执行状态 val 值
	    if(status=="0"){
	    	status = "";
	    }else if(status=="执行成功"){
	    	status = "1";
	    }else if(status=="执行失败"){
	    	status = "2";
	    }else if(status=="延迟执行"){
	    	status = "3";
	    }
	    //反馈类型  val 值
	    if(reportType=="0"){
	    	reportType = "";
	    }else if(reportType =="其他" ){   //反馈状态等于 “其他” 时让反馈原因val值= des输入框的值
	    	reportType = reportType;
	    	reportReason = $("#dess").val();
	    	if($("#dess").val()!=""){
	    		des = $("#des").val();
	    	}else{
	    		des="";
	    	}
	    	
	    }else if($("#dess").val()!=""){
			des=$("#des").val();
	    } else{
	    	reportType = reportType;
	    }
	    //反馈原因val值
	    if(reportReason=="0" && reportType!=""){   
	    	reportReason = "";
	    }else if(reportReason!=""&&reportType!="其他"){  //如果反馈的val  不等于空&& 反馈类型val不等于"其他" 执行下面语句    
	    	reportReason = reportReason;
	    	des = $("#des").val();
	    }else{
	    	reportReason = reportReason;
	    }
	    var type = $("#pro").val();
	    var request={
		    	param:{
			    	"id":id,
			    	"status":status,
			    	"des":des,
			    	"reportReason":reportReason,
			    	"reportType":reportType,
			    	"status":status,
			    	"type":type
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
		    		$("#loginMask").show();
					$("#newspapers").show();
					$(".newsmeagess").html(data.error.message);
		    	}
		    	
	        }
		});
	}
	//关闭上报提示按钮
	function determine(){
		$("#loginMask").hide();
		$("#newspapers").hide();
	}
}else{
	$("#duanxin").hide();
	$("#shangbao").hide();
	$("#resa").hide();
	$("#previousBtn").hide();
	$("#NavNext").hide();
}


