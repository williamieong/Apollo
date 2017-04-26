var mongoose = require('mongoose');
userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	spotifyAccessToken: {
		type: String,
		unique: true,
		required: true
	},
	youtubeAccessToken: {
		type: String,
		unique: true
	}
	});
