var mongoose = require('mongoose');
var md5 = require("md5");

mongoose.Promise = global.Promise;
var UserSchema = new mongoose.Schema({
    uid         : { type: String, unique: true },
    name        : String,
    fans        : String,
    //followers   : String,
    type        : String
});

var RelationSchema = new mongoose.Schema({
    uid         : String,
    follow_uid  : String,
    combine_hash: String
});

var RelationChangeSchema = new mongoose.Schema({
    uid         : String,
    follow_uid  : String,
    operate     : String,
    create_time : String
});

var db = mongoose.createConnection('mongodb://wudi3:wudi3@127.0.0.1/relations');
var UserModel = db.model('User', UserSchema);
var RelationModel = db.model('Relation', RelationSchema);
var RelationChangeModel = db.model('RelationChange', RelationChangeSchema);

module.exports = {
    //setUser: function(uid, name, fans, followers, type) {
    setUser: function(uid, name, fans, type) {
        var user_model = new UserModel();
        
        user_model.uid = uid;
        user_model.name = name;
        user_model.fans = fans;
        //user_model.followers = followers;
        user_model.type = type;

        user_model.save(function(error, a) {
            if(error) {
                console.log(error);
            } else {
                console.log('saved word OK!');
            }
        });
    },
    setRelation: function(uid, follow_uid) {
        var relation_model = new RelationModel();
        
        relation_model.uid = uid;
        relation_model.follow_uid = follow_uid;
        relation_model.combine_hash = md5(uid + '_' + follow_uid);

        relation_model.save(function(error, a) {
            if(error) {
                console.log(error);
            } else {
                console.log('saved word OK!');
            }
        });
    },
    setRelationChange: function(uid, follow_uid, operate) {
        var relation_change_model = new RelationChangeModel();
        
        relation_change_model.uid = uid;
        relation_change_model.follow_uid = follow_uid;
        relation_change_model.operate = operate;
        relation_change_model.create_time = new Date().getTime();

        relation_change_model.save(function(error, a) {
            if(error) {
                console.log(error);
            } else {
                console.log('saved word OK!');
            }
        });
    }
};