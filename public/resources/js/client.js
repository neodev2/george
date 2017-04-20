var socket = io();

setInterval(function(){
	socket.emit('update', true);
}, 314);

socket.on('update', function(data){
	console.log(data);
	
	var html = '';
	
	for(let channel_name in data){
		html += '<b>'+channel_name+'</b>';
	}
	
	$('body').html(html);
	
});