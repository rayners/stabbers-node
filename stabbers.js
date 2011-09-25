var jerk = require('jerk');
var channels = [];
if (process.env.IRC_CHANNELS) {
    channels = process.env.IRC_CHANNELS.split(',');
}
var server = process.env.IRC_SERVER || 'irc.freenode.net';
var nick   = process.env.IRC_NICK   || 'stabbers-node';
var prefix = '.';

var actions = {
    "stab": "stabs",
    "slap": "slaps",
    "yawn": function(from, predicate) { return "pours " + from + " another cup of coffee" },
    "\^5": "high fives"
};

var acronyms = {
    "ym": "Your mom",
    "twss": "That's what she said!"
};

for (action in actions) {
    jerk( function( j ) {
	var verb = actions[action];
	j.watch_for(new RegExp("^\\." + action + '( (.*))?$'), function(message) {
	    var predicate = message.match_data[2] || message.user;
	    var act = '';
	    if (typeof(verb) === 'function') {
		act = verb(message.user, predicate);
	    }
	    else {
		act = verb + " " + predicate;
	    }
	    message.say("\u0001ACTION " + act + "\u0001");
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

jerk(function(j){}).connect({ server: server, nick: nick, channels: channels });
