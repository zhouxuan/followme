/**
 * findStar2.js
 * @authors zhouxuan1
 * @date    2017-11-01 15:32:34
 * @version $Id$
 */
var https = require('https');
var fs = require('fs');
var db = require('./tools');

var uids = {1730077315:1};
var names = ['1730077315'];
var depth = 1;

async function getPersonInfo(uid, since_id){
	since_id = since_id || 1;
    var res = await new Promise(function (resolve, reject) {
        var url = 'https://m.weibo.cn/api/container/getIndex?containerid=231051_-_followerstagrecomm_-_'+uid+'_-_1042015%253AtagCategory_050&luicode=10000011&lfid=231051_-_followers_-_'+uid+'&featurecode=10000326&type=all&since_id='+ since_id;
        var req = https.get(url, function (res) {
            var body = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
            	body += chunk;
            });
            res.on('end', () => {
            	resolve(eval('('+body+')').cards[0])
			})
        });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            reject(new Error('http failed'));
        });
        req.end();
    });

    if(!res || !res.card_group) return names;
	
	var onePageGroup = res.card_group;

	for(var i=0, l = onePageGroup.length; i<l; i++){
		var user = onePageGroup[i].user;
		if(user && !uids[user.id] && user.followers_count > 10000000){
			uids[user.id] = 1;
			names.push(user.id);
			db.setUser(user.id, user.screen_name, user.followers_count, 'star');
			db.setRelation(uid, user.id);
		}
	}

	return await getPersonInfo(uid, ++since_id);
}

//遍历
async function getAllStars(users) {
	var depthUsers = [];

	for(var i = 0, l = users.length; i <l; i++){
		var temp = await getPersonInfo(users[i]);
		//console.log(temp.length)
		depthUsers.push(...temp);
		names = [];
	}

	depth++;

	console.log("第"+depth+"级人数：", depthUsers.length);

	if(depth < 10){
		console.log("总人数：", Object.keys(uids).length);
		return await getAllStars(depthUsers);
	}else{
		console.log("总人数：", Object.keys(uids).length);
		fs.writeFileSync('bbb', JSON.stringify(uids),'utf-8');
		return;
	}

}

getAllStars(names);
