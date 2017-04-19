var socket = io();


setInterval(function(){
	
	socket.emit('update', true);
	
}, 500);


socket.on('update', function(data){
	console.log(data);
});