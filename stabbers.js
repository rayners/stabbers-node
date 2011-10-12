var jerk = require('jerk');
var mu   = require('mu2');
var channels = [];
if (process.env.IRC_CHANNELS) {
    channels = process.env.IRC_CHANNELS.split(',');
}
var server    = process.env.IRC_SERVER || 'irc.freenode.net';
var pass      = process.env.IRC_SERVER_PASS;
var nick      = process.env.IRC_NICK   || 'stabbers-node';
var nick_pass = process.env.IRC_NICK_PASS;

var debug     = process.env.DEBUG;

var bot;
var connect_options = {
    server: server,
    nick: nick,
    channels: channels,
    user: { username: nick, hostname: 'thetubes', servername: 'tube1', realname: 'Stabbers Bot' }
};

if (pass) {
    connect_options['pass'] = pass
}

if (nick_pass) {
    connect_options['onConnect'] = function() {
	bot.say('NickServ', 'identify ' + nick_pass);
    };
}

var prefix = '.';

var actions = {
    "stab": "stabs {{predicate}}",
    "slap": "slaps {{predicate}}",
    "yawn": "pours {{user}} another cup of coffee",
    "\\^5": "high fives {{predicate}}",
    "tackle": "tackles {{predicate}}"
};

var acronyms = {
    "ym": "Your mom",
    "twss": "That's what she said!",
    "whee+!?": "Wheeee!"
};

for (action in actions) {
    jerk( function( j ) {
	var verb = actions[action];
	j.watch_for(new RegExp("^\\." + action + '( (.*))?$'), function(message) {
	    var predicate = message.match_data[2] || message.user;
	    var act = '';
	    if (typeof(verb) === 'function') {
		act = verb(message.user, predicate);
		message.say("\u0001ACTION " + act + "\u0001");
	    }
	    else {
		var buffer = '';
		mu.renderText(verb, { user: message.user, predicate: predicate })
		    .addListener('data', function(c) {buffer += c;})
		    .addListener('end', function() {message.say("\u0001ACTION " + buffer + "\u0001");});
	    }
	});
    });
}

for (acronym in acronyms) {
    jerk( function( j ) {
	var a = acronyms[acronym];
	j.watch_for(new RegExp("^\\." + acronym + "$"), function(message) {
	    message.say(a);
	});
    });
}

// greetings!
jerk( function( j ) {
	  j.watch_for(new RegExp("^" + nick + "!$"), function(message) {
			  message.say(message.user + "!");
			  });
	  j.watch_for(new RegExp("^(hi|howdy|hiya|hey( there)?),? " + nick + "(!?)$"), function(message) {
			  message.say(message.match_data[1] + " " + message.user + message.match_data[3]);
			  });
      });

// githubiness
var GitHubApi = require("github").GitHubApi;
var github = new GitHubApi(true);
jerk( function( j ) {
    j.watch_for(/^\.ghr ([a-zA-Z0-9-_.]+) ([a-zA-Z0-9-_.]+)$/, function(message) {
	var user = message.match_data[1];
	var repo = message.match_data[2];

	github.getRepoApi().show(user, repo, function(err, repos) {
	    if (repos) {
		message.say(repos.url +": "+repos.description);
	    }
	});
    });
});

debug && console.log("options: " + JSON.stringify(connect_options));
bot = jerk(function(j){}).connect(connect_options);
