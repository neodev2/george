var socket = io();

setInterval(function(){
	socket.emit('update', true);
}, 314);

socket.on('update', function(data){
	//console.log(data);
	
	var html = `<div class="channel">`;
	
	for(let channel_name in data){
		html += `<div><div>${channel_name}</div>`;
		
		for(let msgId in data[channel_name]){	
			html += 
			`<div id="${msgId}">
				<div>${data[channel_name][msgId]['m_time']}</div>
				<div>${data[channel_name][msgId]['m_content']}</div>
				<div>${data[channel_name][msgId]['m_authorUsername']}</div>
			<div></div>`;	
		}
	}
	
	html += `</div>`;
	
	$('body').html(html);
	
});