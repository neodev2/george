const
	Discord  = require('discord.js'),
	client   = new Discord.Client(),
	https    = require('https'),
	cheerio  = require('cheerio'),
	
	express	 = require('express'),
	app		 = express(),
	server	 = require('http').Server(app),
	io		 = require('socket.io')(server);

server.listen(process.env.PORT || 8000);

app.use('/resources', express.static(__dirname+'/public/resources'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
});

/* - - - - - - - - - */


io.on('connection', function(socket){
	
	socket.on('update', function(){
			
		// get last messages from specific channels
		
		var ch_ids = [process.env.ch_id1, process.env.ch_id2];
		var response = {};
		
		for(let i=0; i<ch_ids.length; i++){
			
			// find channel by name
			//var channel = client.channels.find("name", "bot_testing");
			
			// find channel by id
			var channel = client.channels.get(ch_ids[i]);
			
			//console.log(channel);
			
			response[channel.name] = {};
			
			console.log('response1:', response);
			
			channel.fetchMessages({limit: 1})
			.then(function(messages){
				//console.log(`Found ${messages.size} messages`);
				
				messages.forEach(function(m){
					
					var diff = timeDifference(m.createdAt, new Date());
					
					response[channel.name][m.id] = {};
					
					response[channel.name][m.id]['m_time'] = diff.minutes+' min, '+diff.seconds+' sec ago';
					response[channel.name][m.id]['m_content'] = m.content;
					response[channel.name][m.id]['m_authorUsername'] = m.author.username;
					
					console.log('responseMID:', response);
					
				});
				
				console.log('response2:', response);
				socket.emit('update', response);
				
			})
			.catch(console.error);
			
		}
		
		
	});
	
});


var lastMessage = 0;

function timeDifference(date1, date2) {
  var oneDay = 24 * 60 * 60; // hours*minutes*seconds
  var oneHour = 60 * 60; // minutes*seconds
  var oneMinute = 60; // 60 seconds
  var firstDate = date1.getTime(); // convert to milliseconds
  var secondDate = date2.getTime(); // convert to milliseconds
  var seconds = Math.round(Math.abs(firstDate - secondDate) / 1000); //calculate the diffrence in seconds
  // the difference object
  var difference = {
    "days": 0,
    "hours": 0,
    "minutes": 0,
    "seconds": 0,
  }
  //calculate all the days and substract it from the total
  while (seconds >= oneDay) {
    difference.days++;
    seconds -= oneDay;
  }
  //calculate all the remaining hours then substract it from the total
  while (seconds >= oneHour) {
    difference.hours++;
    seconds -= oneHour;
  }
  //calculate all the remaining minutes then substract it from the total 
  while (seconds >= oneMinute) {
    difference.minutes++;
    seconds -= oneMinute;
  }
  //the remaining seconds :
  difference.seconds = seconds;
  //return the difference object
  return difference;
}

function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

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
			url: "https://discordapp.com/api/v6/channels/"+process.env.channel_id+"/messages?limit=2",
			headers: {
				'authorization': process.env.authorization_1
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
			url: "https://discordapp.com/api/v6/channels/"+process.env.channel_id+"/messages?limit=2",
			headers: {
				'authorization': process.env.authorization_1
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
							'authorization': process.env.authorization_1
						}
					};
					
					request(options, function(){
						console.log('done');
					});
					
					
				}
				
			}
		}
		
		request(options, callback);*/
		
		if(message.author.id === process.env.admin_id){
					
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
						var title = escapeRegExp(links[i].title); // e.g. Something (concept)
						var re = new RegExp('('+title+')s?', "gi"); // e.g. Social bots
						var zzz = re.exec($(this).text());
						if(zzz !== null){ // matching...
							$(this).text($(this).text().replace(re, '['+links[i].title.replace(/ /g, '_')+']'));
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
			if(lastMessage.author.id == process.env.bot_id){
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


client.on("ready" , () => {
	
	
	// some basic users properties
	/*client.users.filter(function(m){
		console.log({
			"username": m.username,
			"id": m.id,
			"bot": m.bot,
			"presence.status": m.presence.status
		});
	});*/
	
	
	// client.channels
	/*console.log(client.channels);*/
	
	
	// find guild by name
	//var guild = client.guilds.find("name", "zl");
	
	
	// non offline users username
	//console.log(client.users.filter(m => m.presence.status !== "offline").map(m => m.username).join(","));
	
	
	// displayName of online members on XXXXXXXXXX
	//console.log(client.guilds.get('XXXXXXXXXX').members.filter(m => m.presence.status != "offline").map(m => m.displayName).join(","));
	/*var xxx = client.guilds.get('XXXXXXXXXX')['members'].filter(function(m){
	    return m.presence.status !== 'offline';
	}).map(function(m){
	    return {
	        'displayName': m.displayName
	    };
	});
	
	//console.log(JSON.stringify(xxx, null, 4));
	console.log(xxx);*/
	
	
	// some basic guilds properties
	/*client.guilds.filter(function(_this){
		console.log({
			//"members"   : _this.members,
			"channels"  : _this.channels,
			//"roles"     : _this.roles,
			//"presences" : _this.presences,
			//"available" : _this.available,
			//"id"        : _this.id,
			"name"      : _this.name
		});
	});*/
	
	
	// get channels in specific server
	/*var xxx = client.guilds.get('XXXXXXXXXX')['channels'].filter(function(m){
	    return 1+1==2;
	}).map(function(m){
	    return {
	        'xxx': m
	    };
	});
	
	//console.log(JSON.stringify(xxx, null, 4));
	console.log(xxx);*/
	
});


client.login(process.env.client_login);

