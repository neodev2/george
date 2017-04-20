var socket = io();


setInterval(function(){
	
	socket.emit('update', true);
	
}, 4000);


socket.on('update', function(data){
	
	console.log(data);
	
});