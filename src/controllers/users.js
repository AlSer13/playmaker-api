const User = require('../models/user');
const Match = require('../models/match');
const Tournament = require('../models/tournament');
const mongoose = require('mongoose');
require('dotenv').config();

exports.user_signup = (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
        account_id: req.body.account_id
    });
    user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                status: "ok",
                message: "user registered",
                addedUser: user
            });
        }).catch(error => {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: error
        });
    })
};

exports.user_update = (req, res, next) => {
    User.findOneAndUpdate(
        {_id: req.body.id}, // почему не userId?
        {
            $set: {
                email: req.body.email,
                password: req.body.password,
                account_id: req.body.account_id
            }
        }
    )
};

exports.user_get_info = (req, res, next) => {
    User.findOne({_id: req.params.id})
        .populate('selected_matches', 'selected_tournaments')
        .select('_id nickname account_id selected_matches selected_tournaments')
        .exec()
        .then(doc => {
            const response = {
                status: "ok",
                user_info: doc
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
};

exports.user_add_match = (req, res, next) => {
    Match.findById(req.body.matchId)
        .exec()
        .then(match => {
            if (match) { //Если существует матч с таким id
                User.findOneAndUpdate(
                    {_id: req.params.userId},
                    {$addToSet: {selected_matches: {_id: match._id}}},
                    {new: true}
                )
                    .exec()
                    .then(user => {
                        const response = {
                            status: "ok",
                            addedMatch: match,
                            updatedUser: user
                        };
                        res.status(200).json(response);
                    })
                    .catch(err => {
                        res.status(500).json({error: err})
                    })
            } else return res.status(404).json({
                status: "error",
                message: "match not found"
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
};

exports.user_delete_match = (req, res, next) => {
    Match.findById(req.body.matchId)
        .exec()
        .then(match => {
            if (match) { //Если существует матч с передаваемым Id
                User.findOneAndUpdate(
                    {_id: req.params.userId},
                    {$pull: {selected_matches: {_id: match._id}}}, //Удаляем пользователя из команды
                    {new: true}
                )
                    .exec()
                    .then(user => {
                        const response = {
                            status: "ok",
                            removedMatch: match,
                            updatedUser: user
                        };
                        res.status(200).json(response);
                    })
                    .catch(err => {
                        res.status(500).json({error: err})
                    })
            } else return res.status(404).json({
                status: "error",
                message: "match not found"
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
};

exports.user_add_tournament = (req, res, next) => {
    Tournament.findById(req.body.tournamentId)
        .exec()
        .then(tournament => {
            if (tournament) { //Если существует турнир с таким id
                User.findOneAndUpdate(
                    {_id: req.params.userId},
                    {$addToSet: {selected_tournaments: {_id: tournament._id}}},
                    {new: true}
                )
                    .exec()
                    .then(user => {
                        const response = {
                            status: "ok",
                            addedTournament: tournament,
                            updatedUser: user
                        };
                        res.status(200).json(response);
                    })
                    .catch(err => {
                        res.status(500).json({error: err})
                    })
            } else return res.status(404).json({
                status: "error",
                message: "tournament not found"
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
};

exports.user_delete_tournament = (req, res, next) => {
    Tournament.findById(req.body.tournamentId)
        .exec()
        .then(tournament => {
            if (tournament) { //Если существует пользователь с передаваемым Id
                User.findOneAndUpdate(
                    {_id: req.params.userId},
                    {$pull: {selected_tournaments: {_id: tournament._id}}},
                    {new: true}
                )
                    .exec()
                    .then(user => {
                        const response = {
                            status: "ok",
                            removedTournament: tournament,
                            updatedUser: user
                        };
                        res.status(200).json(response);
                    })
                    .catch(err => {
                        res.status(500).json({error: err})
                    })
            } else return res.status(404).json({
                status: "error",
                message: "tournament not found"
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
};

exports.user_restore_password = (req, res, next) => {
    User.findOne({email: req.body.userEmail}) //проверить, что email существует
        .exec()
        .then(doc => {
            //TODO: if doc !=null send e-mail with password or else
            const response = {
                status: doc ? "ok" : "fail"
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
};

//basic auth
exports.user_auth = (req, res, next) => {
    User.findOne({email: req.body.userEmail, password: req.query.userPassword})
        .exec()
        .then(doc => {
            //TODO: encrypt password
            const response = {
                status: doc ? "ok" : "fail"
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
};