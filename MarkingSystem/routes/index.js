var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET marking page. */
router.get('/marking.html', function(req, res, next) {
  res.render('marking', { title: 'Express' });
});

/* POST marking page. */
router.post('/marking.html', function(req, res, next) {
  res.cookie('whoami',req.body.whoami);
  res.render('marking', { title: 'Express' });
});

var users = ['陈博','陈民敬','陈天龙','程遥','邓启亮','付金祥','古意昌','李幸斌','吕毅','王东杰','许威','叶洪','张强','朱龙飞'];
var statisticscoretitles = ['部分','平均分'];

var scores = new Array;
for(var i=0;i<users.length;i++){
  scores[i]=new Array();
  for(var j=0;j<users.length;j++){
    scores[i][j]=0;
  }
}

var statisticscores = new Array;
for(var i=0;i<users.length;i++){
  statisticscores[i]=new Array();
  for(var j=0;j<2;j++){
    statisticscores[i][j]=0;
  }
}

router.post('/statistics.html', function(req, res, next) {
  var index=users.indexOf(req.cookies.whoami);
  if(index!=-1){
  scores[0][index]=CheckScore(req.body.chenbo);
  scores[1][index]=CheckScore(req.body.chenminjing);
  scores[2][index]=CheckScore(req.body.chentianlong);
  scores[3][index]=CheckScore(req.body.chengyao);
  scores[4][index]=CheckScore(req.body.dengqiliang);
  scores[5][index]=CheckScore(req.body.fujinxiang);
  scores[6][index]=CheckScore(req.body.guyichang);
  scores[7][index]=CheckScore(req.body.lixingbin);
  scores[8][index]=CheckScore(req.body.lvyi);
  scores[9][index]=CheckScore(req.body.wangdongjie);
  scores[10][index]=CheckScore(req.body.xuwei);
  scores[11][index]=CheckScore(req.body.yehong);
  scores[12][index]=CheckScore(req.body.zhangqiang);
  scores[13][index]=CheckScore(req.body.zhulongfei);
  Statistic();
}
var a=CountFinishUser();
if(a>=2){
 res.render('statistics', {
        users: users,
        scores: scores,
        statisticscores: statisticscores,
        statisticscoretitles: statisticscoretitles,
    });
}
else{
res.render('submiting', {
        users: users,
        scores: scores,
        statisticscores: statisticscores,
        statisticscoretitles: statisticscoretitles,
    });
}
});

function CheckScore(score){
  if(score=="") {
    return 0;}
    else{
      return score;
    }
}

function CountFinishUser(){
  var count=0;
  scores[0].forEach(function(score,i) {
    if(~~score > 10){
      count++;
    }
  }, this);
  return count;
}

function Statistic(){
  var totle=0;
  scores.forEach(function(everyonescore,i) {
    everyonescore.forEach(function(score) {
      totle+=(~~score);
    }, this);
    statisticscores[i][0]=totle;
    statisticscores[i][1]=(totle/scores.length).toFixed(1);
    totle=0;
  }, this);
}

router.get('/statistics.html', function(req, res, next) {
var a=CountFinishUser();
if(a>=2){
 res.render('statistics', {
        users: users,
        scores: scores,
        statisticscores: statisticscores,
        statisticscoretitles: statisticscoretitles,
    });
}
else{
res.render('submiting', {
        users: users,
        scores: scores,
        statisticscores: statisticscores,
        statisticscoretitles: statisticscoretitles,
    });
}
});

module.exports = router;
