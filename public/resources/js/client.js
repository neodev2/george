var socket = io();


setInterval(function(){
	
	socket.emit('update', true);
	
}, 500);


socket.on('update', function(){
	console.log(data);
});