var socket = io();

setInterval(function(){
	socket.emit('update', true);
}, 314);

socket.on('update', function(data){
	//console.log(data);
	
	var html = `<div class="channel">`;
	
	for(let channel_name in data){
		html += `<div>${channel_name}</div>`;
		
		for(let msgId in data[channel_name]){
			html += `<div>${msgId}</div>`;
		}
		
	}
	
	html += `</div>`;
	
	$('body').html(html);
	
});