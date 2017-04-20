var socket = io();

//setInterval(function(){
	socket.emit('update', true);
//}, 314);

socket.on('update', function(data){
	//console.log(data);
	
	var html = '';
	
	for(let channel_name in data){
		html += `<div data-name="${channel_name}">`;
		
		for(let msgId in data[channel_name]){	
			html += 
			`<div id="${msgId}">
				<i>${data[channel_name][msgId]['m_time']}</i>
				<p>${data[channel_name][msgId]['m_content']}</p>
				<small>${data[channel_name][msgId]['m_authorUsername']}</small>
			</div>`;	
		}
		
		html += '</div>';
	}
	
	$('body').html(html);
	
});