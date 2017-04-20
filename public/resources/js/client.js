var socket = io();


setInterval(function(){
	
	socket.emit('update', true);
	
}, 4000);


socket.on('update', function(data){
	
	console.log(data);
	
	for(let channel in data){
		for(let msgId in channel){
			console.log(data[msgId].m_authorUsername);
			console.log(data[msgId].m_content);
			console.log(data[msgId].m_time);
		}
	}
	
});