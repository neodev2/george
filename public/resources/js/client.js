var socket = io();

setInterval(function(){
	socket.emit('update', true);
}, 314);

socket.on('update', function(data){
	console.log(data);
	
	//data = JSON.parse(data);
	
	for(let channel_name in data){
		document.body.innerHTML += channel_name;
	}
	
});