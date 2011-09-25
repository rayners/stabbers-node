var jerk = require('jerk');
var channels = [];
if (process.env.IRC_CHANNELS) {
    channels = process.env.IRC_CHANNELS.split(',');
}
var server = process.env.IRC_SERVER || 'irc.freenode.net';
var nick   = process.env.IRC_NICK   || 'stabbers-node';
var prefix = '.';

/*var client = new irc.Client(server, nick, {
    channels: channels,
});*/

var actions = {
    "stab": "stabs",
    "slap": "slaps",
    "yawn": function(from, predicate) { return "pours " + from + " another cup of coffee" },
};

var acronyms = {
    "ym": "Your mom",
    "twss": "That's what she said!"
};

for (action in actions) {
    jerk( function( j ) {
	var verb = actions[action];
	j.watch_for(new RegExp("^\\." + action + '(?: (.*))$'), function(message) {
	    var predicate = message.match_data[1] || message.user;
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
	j.watch_for(new RegExp("^\\." + acronym + "$"), function(message) {
	    message.say(acronyms[acronym]);
	});
    });
}

jerk().connect({ server: server, nick: nick, channels: channels });

/*client.addListener('message', function (from, to, message) {
    if (message.match(/^\./)) {
	// it's a command!
	var bits = message.split(' ', 2);

	// nix the '.' at the beginning
	var command = bits[0].substring(1);
	var predicate = bits[1] || from;

	// is it an action?
	if (command in actions) {
            var action = '';
	    if (typeof(actions[command]) === 'function') {
		action += actions[command](from, predicate);
	    }
	    else {
		action += actions[command] + " " + predicate;
	    }
	    client.say(to, "\u0001ACTION " + action + "\u0001");
	}

	// or an acronym?
	else if (command in acronyms) {
	    client.say(to, acronyms[command]);
	}

    }
});*/
