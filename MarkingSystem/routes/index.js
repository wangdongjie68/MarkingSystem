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

var scores = new Array;
for(var i=0;i<users.length;i++){
  scores[i]=new Array();
  for(var j=0;j<users.length;j++){
    scores[i][j]=0;
  }
}

router.post('/statistics.html', function(req, res, next) {
  var index=users.indexOf(req.cookies.whoami);
  if(index!=-1){
  scores[0][index]=req.body.chenbo;
  scores[1][index]=req.body.chenminjing;
  scores[2][index]=req.body.chentianlong;
  scores[3][index]=req.body.chengyao;
  scores[4][index]=req.body.dengqiliang;
  scores[5][index]=req.body.fujinxiang;
  scores[6][index]=req.body.guyichang;
  scores[7][index]=req.body.lixingbin;
  scores[8][index]=req.body.lvyi;
  scores[9][index]=req.body.wangdongjie;
  scores[10][index]=req.body.xuwei;
  scores[11][index]=req.body.yehong;
  scores[12][index]=req.body.zhangqiang;
  scores[13][index]=req.body.zhulongfei;
  }
 res.render('statistics', {
        users: users,
        scores: scores,
    });
});

// router.post('/statistics.html', function(req, res, next) {
//   console.log('Cookies:',req.cookies);
//   global.chenbo=req.body.chenbo;
//   global.chenminjing=req.body.chenminjing;
//   global.chentianlong=req.body.chentianlong;
//   global.chengyao=req.body.chengyao;
//   global.dengqiliang=req.body.dengqiliang;
//   global.fujinxiang=req.body.fujinxiang;
//   global.guyichang=req.body.guyichang;
//   global.lixingbin=req.body.lixingbin;
//   global.lvyi=req.body.lvyi;
//   global.wangdongjie=req.body.wangdongjie;
//   global.xuwei=req.body.xuwei;
//   global.yehong=req.body.yehong;
//   global.zhangqiang=req.body.zhangqiang;
//   global.zhulongfei=req.body.zhulongfei;
//   res.render('statistics', { title: 'Express' });
// });

router.get('/statistics.html', function(req, res, next) {
 res.render('statistics', {
        users: users,
        scores: scores,
    });
});

module.exports = router;
