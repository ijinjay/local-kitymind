(function(){
	var oldData=''; // 之前一次的数据
	var km_fname = '';
	var html = '';
	var win_title = '';
	html += '<a class="diy export" data-type="json" id="json_export">导出json</a>',
	html += '<a class="diy export" data-type="png" id="png_export">导出png</a>',
	html += '<a class="diy export" data-type="md" id="md_export">导出md</a>',
	html += '<a class="diy export" data-type="km" id="km_export">导出km</a>',
	html += '<button class="diy input" id="import_net_data">',
	html += '导入网络数据',
	html += '</button>',
	html += '<button class="diy input">',
	html += '导入文件<input type="file" id="fileInput">',
	html += '</button>',
	// html += '<textarea class="diy input" id="prompt_txt">',
	// html +='</textarea>';    

	$('.editor-title').append(html); // 添加按钮

	$('.diy').css({
		// 'height': '30px',
		// 'line-height': '30px',
		'margin-top': '0px',
		'float': 'right',
		'background-color': '#fff',
		'min-width': '60px',
		'text-decoration': 'none',
		color: '#999',
		'padding': '0 10px',
		border: 'none',
		'border-right': '1px solid #ccc',
	});
	$('.input').css({
		'overflow': 'hidden',
		'position': 'relative',
	}).find('input').css({
		cursor: 'pointer',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		display: 'inline-block',
		opacity: 0
	});
	$('.export').css('cursor','pointer');

	// 导出
	$(document).on('mouseover', '.export', function(event) {
		// 链接在hover的时候生成对应数据到链接中
		event.preventDefault();
		if(JSON.stringify(oldData) == JSON.stringify(editor.minder.exportJson())){
			// 旧数据与现有数据相同
			return;
		}else{
			oldData = editor.minder.exportJson();
		}
		editor.minder.exportData('json').then(function(content){
			var blob = new Blob([content]),
					data_url = URL.createObjectURL(blob);
			var aLink = $("#json_export")[0];
			aLink.href = data_url;
			aLink.download = $('#node_text1').text()+'.json';
		});
		editor.minder.exportData('png').then(function(content){
			var blob = new Blob([content]),
					data_url = URL.createObjectURL(blob);
			var aLink = $("#png_export")[0];
			aLink.href = data_url;
			aLink.download = $('#node_text1').text()+'.png';
		});
		editor.minder.exportData('markdown').then(function(content){
			var blob = new Blob([content]),
					data_url = URL.createObjectURL(blob);
			var aLink = $("#md_export")[0];
			aLink.href = data_url;
			aLink.download = $('#node_text1').text()+'.md';
		});
		// km实质上是json格式
		editor.minder.exportData('json').then(function(content){
			var blob = new Blob([content]),
					data_url = URL.createObjectURL(blob);
			var aLink = $("#km_export")[0];
			aLink.href = data_url;
			aLink.download = $('#node_text1').text()+'.km';
		});

	});

	// 导入网络数据
	$(document).on("click", '#import_net_data', function(event){
		event.preventDefault();
		$.ajax({
            url: "file:///Users/jay/Code/local-kitymind/test_data.json",
            type: 'GET',
            dataType: 'txt',
            success: function (data) {
                var status = data.status;
                if (status == 100) {
                    alert(data.msg);
                    return;
                }
            },
            error: function (error) {
                alert('error');
            }
        });
	});

  // 不上传
	// window.setInterval(
	// 	function(){
	// 		if (win_title != $('#node_text1').text()) {
	// 			win_title = $('#node_text1').text();
	// 			document.title = win_title;
	// 		}
	// 		if (oldData == '') {
	// 			oldData = editor.minder.exportJson();
	// 			return;
	// 		}            
	// 		if(JSON.stringify(oldData) == JSON.stringify(editor.minder.exportJson())){
	// 			return;
	// 		}else{
	// 			oldData = editor.minder.exportJson();
	// 		}
	// 		exportType='json';
	// 		editor.minder.exportData(exportType).then(function(content){                               
	// 			$.ajax({
	// 				type: "POST",  
	// 				url: "upload.php?fname="+encodeURI(km_fname)+"&text="+$('#node_text1').text(), 
	// 				data: JSON.stringify(content),
	// 				success: function(msg){
	// 				//alert( "Data Saved: " + msg ); 
	// 		myDate = new Date();
	// 		txt=document.getElementById('prompt_txt');
	// 		txt.value = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + " : " + msg;
	// 				}
	// 			});               
	// 		});
	//         }, 
  //       5000);

	// 导入
	window.onload = function() {
		var fileInput = document.getElementById('fileInput');
        
        $("#kity_svg_6").css("background-color", '#cbe8cf');

		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0],
					// textType = /(md|km)/,
					fileType = file.name.substr(file.name.lastIndexOf('.')+1);
			console.log(file);
			km_fname=file.name;
			switch(fileType){
				case 'md':
					fileType = 'markdown';
					break;
				case 'km':
				case 'json':
					fileType = 'json';
					break;
				default:
					console.log("File not supported!");
					alert('只支持.km、.md、.json文件');
					return;
			}
			var reader = new FileReader();
			reader.onload = function(e) {
				var content = reader.result;
				editor.minder.importData(fileType, content).then(function(data){
					console.log(data);
					$(fileInput).val('');
					oldData = editor.minder.exportJson();
					if (win_title != $('#node_text1').text()) {
						win_title = $('#node_text1').text();
						document.title = win_title;
					}                    
				});
			}
			reader.readAsText(file);
		});
	}

})();
