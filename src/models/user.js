const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nickname: {type: String, required: true, unique:true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    accountId: {type: Number, unique: true},
    selectedMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    selectedTournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }]
});

module.exports = mongoose.model('User', userSchema);
