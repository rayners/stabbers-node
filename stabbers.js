var irc = require('irc');
var channels = [];
if (process.env.IRC_CHANNELS) {
    channels = process.env.IRC_CHANNELS.split(',');
}
var server = process.env.IRC_SERVER || 'irc.freenode.net';
var nick   = process.env.IRC_NICK   || 'stabbers-node';

var client = new irc.Client(server, nick, {
    channels: channels,
});

var actions = {
    "stab": "stabs",
    "slap": "slaps"
};

var acronyms = {
    "ym": "Your mom",
    "twss": "That's what she said!"
};

client.addListener('message', function (from, to, message) {
    if (message.match(/^\./)) {
	// it's a command!
	var bits = message.split(' ', 2);

	// nix the '.' at the beginning
	var command = bits[0].substring(1);
	var predicate = bits[1] || from;

	// is it an action?
	if (command in actions) {
	    client.say(to, "\u0001ACTION " + actions[command] + " " + predicate + "\u0001");
	}

	// or an acronym?
	else if (command in acronyms) {
	    client.say(to, acronyms[command]);
	}

    }
});
