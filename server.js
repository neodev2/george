const
	Discord  = require('discord.js'),
	client   = new Discord.Client(),
	https    = require('https'),
	cheerio  = require('cheerio'),
	conf     = require('./conf');



var lastMessage = 0;

function getWikiJsonApi(url){
	return new Promise(function(resolve, reject){
		
		
		https.get(url, (res) => {
			
			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => rawData += chunk);
			res.on('end', () => {
				try {
					resolve(rawData);
					
				} catch (e) {
					reject(`Snap! catched an error: ${e.message}`);
				}
			});
			
		}).on('error', (e) => {
			reject(`Got error: ${e.message}`);
		});
		
		
	})
}

function onMessage(message){
	
	if(/^george\ {0,}\?{0,}$/i.test(message.content)){
		message.reply('?');
	}
	
	else if(message.content === 'ping'){
		message.reply('pong');
	}
	
	else if(message.content === 'clear'){
		
		/*client.getChannelLogs(message.channel, 10, function(err, logs) {
			if (!err) {
				//do stuff with logs
				console.log(logs);
			} else {
				console.log("Error getting logs: ", err)
			}
		});*/
		
		/*var request = require('request');
		
		var options = {
			url: "https://discordapp.com/api/v6/channels/"+conf.channel_id+"/messages?limit=2",
			headers: {
				'authorization': conf.authorization_1
			}
		};
		
		var xxx = [];
		
		function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body);
				//console.log(data);
				
				for(var i in data){
					//console.log(data[i].content);
					xxx.push(data[i]);
				}
				
				client.deleteMessages(xxx, function(){
					console.log('done');
				})
				
			}
		}
		
		request(options, callback);*/
		
		/*var request = require('request');
		
		var options = {
			url: "https://discordapp.com/api/v6/channels/"+conf.channel_id+"/messages?limit=2",
			headers: {
				'authorization': conf.authorization_1
			}
		};
		
		
		function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body);
				//console.log(data);
				
				for(var id in data){
					//console.log(data[i].content);
					
					
					var options = {
						method: 'DELETE',
						url: "https://discordapp.com/api/v6/channels/"+channelid+"/messages/"+id,
						headers: {
							'authorization': conf.authorization_1
						}
					};
					
					request(options, function(){
						console.log('done');
					});
					
					
				}
				
			}
		}
		
		request(options, callback);*/
		
		if(message.author.id === conf.admin_id){
					
			message.channel.fetchMessages({limit: 100})
			.then(function(messages){
				console.log(`Found ${messages.size} messages`)
				
				messages.forEach(function(m){
					//console.log(m.content);
					
					m.delete()
					.then(msg => console.log(`Deleted message from ${msg.author} (${msg.author.username})`))
					.catch(console.error);
					
				})
				
			})
			.catch(console.error);
			
		}else{
			message.reply('You do not have privileges to perform this action.');
		}
		
	}
	
	else if(message.content === 'george, you are amazing' || message.content === 'george, you are awesome'){
		message.reply('thanks sir');
	}
	
	if(/^\/wiki\ .{1,}$/i.test(message.content)){
		
		var q = message.content.replace(/^\/wiki\ /, '');
		
		//message.reply(q);
		
		
		
		var preHash = q.replace(/^(.+)\#.+$/, '$1');
		var afterHash = q.match(/^.+\#(.+)$/);
		
		var url = 'https://en.wikipedia.org/w/api.php?'+
		'action=query&prop=extracts|links|categories|pageimages&piprop=original&pllimit=500&titles='+preHash+'&format=json';
		
		getWikiJsonApi(url, q)
		.then(function(data){
			
			//console.log(data);
			
			data = JSON.parse(data);
			
			
			var pageId = Object.keys(data['query']['pages']);
			var html = data['query']['pages'][pageId]['extract'];
			var links = data['query']['pages'][pageId]['links'];
			var image = data['query']['pages'][pageId]['original'];
			var categories = data['query']['pages'][pageId]['categories'];
					
			// sort by item length: trying to prevent e.g. "bot" before "social bot"
			// that were causing problems in our regexes below
			// putting shortest ones at the end
			links.sort(function(a, b){
				return b['title'].length - a['title'].length;
			});
			
			
			var $ = cheerio.load(html);
			
			
			var RichEmbed = {};
			
			//RichEmbed['author'] = 'a';
			//RichEmbed['color'] = 'b';
			RichEmbed['description'] = '';
			//RichEmbed['fields'] = 'd';
			//RichEmbed['footer'] = 'e';
			//RichEmbed['image'] = {
			//	url: image ? image['source'] : 'http://www.lg15.com/lgpedia/images/7/78/Wikipedia-logo-small.png'
			//};
			// doing svg replacement because svg is not supported by discord
			RichEmbed['thumbnail'] = {
				url: image ? image['source'].replace(/^(https?:\/\/)(upload\.wikimedia\.org\/wikipedia\/commons\/)(.+\/)*(.+)\.(svg)$/, '$1$2thumb/$3$4.$5/300px-$4.$5.png') : 'http://www.lg15.com/lgpedia/images/7/78/Wikipedia-logo-small.png'
			};
			//RichEmbed['timestamp'] = 'h';
			//RichEmbed['title'] = message.content;
			//RichEmbed['url'] = 'http://www.google.com/';
			
			//console.log(RichEmbed['thumbnail']);
			
			
			// check wiki type
			
			var ns0;
			for(let i=0; i<links.length; i++){
				if(links[i]['ns'] == 0){
					ns0 = i;
				}
			}
			
			if(html == '' || /^Category:Redirects/.test(categories[0].title)){
				RichEmbed['description'] += 'Redirects to:\n'+links[ns0].title;
			}
			
			else if(afterHash){
				
				var $h2OrDl = $('#'+afterHash[1])[0] ? $('#'+afterHash[1]) : $('dt:contains("'+afterHash[1]+'")');
				
				$h2OrDl.parent().next().find('>li').each(function(){
					
						
					for(let i=0; i<links.length; i++){
						
						// find word boundary
						// the "s" should fix plurals e.g. Social bots
						var re = new RegExp('\\b('+links[i].title+')s?\\b', "gim");
						
						
						var zzz = re.exec($(this).text());
						
						if(zzz !== null){ // matching...
							// updating item text with matching link (old [$1])
							// replace spaces with underscores
							$(this).text($(this).text().replace(re, '['+zzz[0].replace(/ /g, '_')+']'));
						}
						
					}
					
					
					RichEmbed['description'] += $(this).text() + '\n';
					
				});
			}
			
			else{
				
				var isDisambiguationPage = false;
				
				for(let i=0; i<categories.length; i++){
					if(categories[i].title == 'Category:All article disambiguation pages'){
						isDisambiguationPage = true;
					}
				}
				
				
				if(isDisambiguationPage){
					$('h2').each(function(){
						RichEmbed['description'] += '#' + $(this).find('>span').attr('id') + '\n';
					});
					
					$('dl').each(function(){
						RichEmbed['description'] += '#' + $(this).find('>dt').text() + '\n';
					});
				}
				
				else{
					RichEmbed['description'] += $('p').eq(0).text();
				}
				
			}
			
			
			//console.log(lastMessage);
			if(lastMessage.author.id == conf.bot_id){
				console.log('it was me... deleting...');
				lastMessage.delete();
			}
			message.channel.sendEmbed(RichEmbed);
			
			
		})
		.catch(function(err){
			console.log(err);
		})
		
		
	}
	
}

client.on('message', function(message){
	lastMessage = message;
	onMessage(message);
});

client.on('messageUpdate', function(message_old, message_new){
	onMessage(message_new);
});



client.login(conf.client_login)
//.then(msg => console.log(type(this),type(arguments), type(msg)))

