var socket = io();
var data;

setInterval(function(){
	socket.emit('update', true);
}, 4000);

socket.on('update', function(data){
	console.log(data);
	data = data;
});