var socket = io();


setInterval(function(){
	
	socket.emit('update', true);
	
}, 4000);


socket.on('update', function(data1, data2){
	console.log(data1, data2);
});