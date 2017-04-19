var socket = io();


setInterval(function(){
	
	socket.emit('update', true);
	
}, 2000);


socket.on('update', function(data){
	console.log(data);
});