var express = require('express');
var router = express.Router();

var whoami = "";
var users = ['陈博', '陈民敬', '陈天龙', '程遥', '邓启亮', '付金祥', '古意昌', '李幸斌', '吕毅', '王东杰', '许威', '叶洪', '张强', '朱龙飞'];
var title = ['陈博', '陈民敬', '陈天龙', '程遥', '邓启亮', '付金祥', '古意昌', '李幸斌', '吕毅', '王东杰', '许威', '叶洪', '张强', '朱龙飞', '总分', '平均分'];

var markingtitle = ['姓名', '工作项评分', '专利', '小零识', '导师', '定制版', '招聘', '内推', '培训','服务生','特殊加分'];
var markingtitlesen = ['xingming', 'gongzuoxiang', 'zhuanli', 'xiaolingshi', 'daoshi', 'dingzhiban', 'zhaopin', 'neitui', 'peixun','fuwusheng','teshujiafen'];
var usersen = ['chenbo','chenminjing','chentianlong','chengyao','dengqiliang','fujinxiang','guyichang','lixingbin','lvyi','wangdongjie','xuwei','yehong','zhangqiang','zhulongfei'];

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {  
      users: users,
      usersen: usersen, });
});

/* GET marking page. */
router.get('/marking.html', function (req, res, next) {
  res.render('marking', {
      users: users,
      scores: scores, 
      usersen: usersen,
      markingtitle: markingtitle, 
      markingtitlesen: markingtitlesen,
    });
});

/* POST marking page. */
router.post('/marking.html', function (req, res, next) {
  res.cookie('whoami', req.body.whoami);
  res.render('marking', {
      whoami: req.body.whoami,
      users: users,
      scores: scores, 
      usersen: usersen,
      markingtitle: markingtitle,
      markingtitlesen: markingtitlesen,
    });
});

var scores = new Array;
for (var i = 0; i < users.length; i++) {
  scores[i] = new Array();
  for (var j = 0; j < title.length; j++) {
    scores[i][j] = 0;
  }
}

router.post('/statistics.html', function (req, res, next) {
  var index = usersen.indexOf(req.cookies.whoami);
  if (index != -1) {
    usersen.forEach(function(useren,i) {
      var gongzuoxiang = req.cookies.whoami+"_"+useren+"_"+"gongzuoxiang";
      scores[i][index] = CheckScore(req.body[gongzuoxiang]);
    }, this);
    
    // scores[1][index] = CheckScore(req.body.chenminjing);
    // scores[2][index] = CheckScore(req.body.chentianlong);
    // scores[3][index] = CheckScore(req.body.chengyao);
    // scores[4][index] = CheckScore(req.body.dengqiliang);
    // scores[5][index] = CheckScore(req.body.fujinxiang);
    // scores[6][index] = CheckScore(req.body.guyichang);
    // scores[7][index] = CheckScore(req.body.lixingbin);
    // scores[8][index] = CheckScore(req.body.lvyi);
    // scores[9][index] = CheckScore(req.body.wangdongjie);
    // scores[10][index] = CheckScore(req.body.xuwei);
    // scores[11][index] = CheckScore(req.body.yehong);
    // scores[12][index] = CheckScore(req.body.zhangqiang);
    // scores[13][index] = CheckScore(req.body.zhulongfei);
    Statistic();
  }
  Load(res);
});

router.get('/statistics.html', function (req, res, next) {
  Load(res);
});

function Load(res) {
  var finishusercount = CountFinishUser();
  if (CountFinishUser() >= 1) {
    res.render('statistics', {
      title: title,
      users: users,
      scores: scores,
    });
  }
  else {
    res.render('submiting', {
      users: users,
      finishusercount: finishusercount,
    });
  }
}

function CheckScore(score) {
  if (score == "") {
    return 0;
  }
  else {
    return ~~score;
  }
}

function CountFinishUser() {
  var count = 0;
  for (i = 0; i < users.length; i++) {
    if (~~scores[0][i] > 0) {
      count++;
    }
  }
  return count;
}

function Statistic() {
  var totle = 0;
  scores.forEach(function (everyonescore, i) {
    for (j = 0; j < users.length; j++) {
      totle += ~~everyonescore[j];
    }
    scores[i][14] = totle;
    scores[i][15] = (totle / scores.length).toFixed(1);
    totle = 0;
  }, this);
}

module.exports = router;
