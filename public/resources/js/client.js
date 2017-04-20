var socket = io();


setInterval(function(){
	
	socket.emit('update', true);
	
}, 4000);


socket.on('update', function(data){
	
	console.log(data);
	
	
	var html = '';
	
	for(let channelName in data){
		
		html += '<div id="'+channelName+'">';
		
		for(let msgId in channelName){
			html += '<div>'+data[msgId].m_authorUsername+'</div>';
			html += '<div>'+data[msgId].m_content+'</div>';
			html += '<div>'+data[msgId].m_time+'</div>';
		}
		
		html += '</div>';
		
		
		$('body').html(html)
		
	}
	
});