//没有网络的时候弹出的页面
function wrapper(){
	var errorStr = 	'<a><img class="fade" src="images/error/404.png"></a>'+  
		        	'<div>'+ 
			            '<h1 class="fade">温馨提示：您访问的地址不存在！</h1>'+  
			            '<p class="fade">你正在寻找的页面无法找到。  </p>'+
			            '<p class="fade">请查看您的网线是不是没有插好！  </p>'+
			            '<a style="opacity: 1;" class="link" href="" onclick="history.go(-1)">刷新</a></p>'+  
		        	'</div>';
		$("#wrapper").html(errorStr);
}
