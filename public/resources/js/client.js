var socket = io();

setInterval(function(){
	socket.emit('update', true);
}, 314);

socket.on('update', function(data){
	console.log(data);
	document.body.innerHTML = JSON.stringify(data);
});