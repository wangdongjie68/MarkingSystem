var express = require('express');
var router = express.Router();

var whoami = "";
var scores = new Array;
var jiafenxiangdir = {};
var maxaveragescore = 0;
var maxzonglakaifencha = 0;
var isneedshowresult = "false";
var jiafenxiangscores = new Array;

var users = ['陈博', '陈民敬', '陈天龙', '程遥', '邓启亮', '付金祥', '古意昌', '李幸斌', '吕毅', '王东杰', '许威', '叶洪', '张强', '朱龙飞'];
var title = ['陈博', '陈民敬', '陈天龙', '程遥', '邓启亮', '付金祥', '古意昌', '李幸斌', '吕毅', '王东杰', '许威', '叶洪', '张强', '朱龙飞', '总分', '平均分', '拉开差', '额外加分', '总-拉开差', '最终分'];

var jiafenmingxititle = ['姓名', '总分', '明细'];
var markingtitle = ['姓名', '工作项评分', '专利', '小零识', '导师', '定制版', '招聘', '内推', '培训', '服务生', '特殊加分'];
var markingtitlesen = ['xingming', 'gongzuoxiang', 'zhuanli', 'xiaolingshi', 'daoshi', 'dingzhiban', 'zhaopin', 'neitui', 'peixun', 'fuwusheng', 'teshujiafen'];
var usersen = ['chenbo', 'chenminjing', 'chentianlong', 'chengyao', 'dengqiliang', 'fujinxiang', 'guyichang', 'lixingbin', 'lvyi', 'wangdongjie', 'xuwei', 'yehong', 'zhangqiang', 'zhulongfei'];

initdata();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    users: users,
    usersen: usersen,
  });
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

/* GET setting page. */
router.get('/sethaha.html', function (req, res, next) {
  res.render('sethaha');
});

/* POST setting page. */
router.post('/sethaha.html', function (req, res, next) {
  isneedshowresult = req.body.isneedshowresult;
  res.render('sethaha');
});

/* POST marking page. */
router.post('/marking.html', function (req, res, next) {
  //res.cookie('whoami', req.body.whoami);
  res.render('marking', {
    whoami: req.body.whoami,
    users: users,
    scores: scores,
    usersen: usersen,
    markingtitle: markingtitle,
    markingtitlesen: markingtitlesen,
  });
});

router.post('/statistics.html', function (req, res, next) {
  var index = users.indexOf(req.body.whoami);
  if (index != -1) {
    var owner = usersen[index]
    var key = owner + "_" + usersen[0] + "_" + "gongzuoxiang";
    if (req.body[key] != undefined) {
      //记录工作项评分
      usersen.forEach(function (useren, i) {
        var gongzuoxiang = owner + "_" + useren + "_" + "gongzuoxiang";
        var a = req.body[gongzuoxiang];
        scores[i][index] = CheckScore(req.body[gongzuoxiang]);
      }, this);

      //记录加分项评分
      usersen.forEach(function (useren, i) {
        markingtitlesen.forEach(function (jiafenxiang, j) {
          if (j >= 2) {
            var jiafenxiangkey = owner + "_" + useren + "_" + jiafenxiang;
            jiafenxiangdir[jiafenxiangkey] = CheckScore(req.body[jiafenxiangkey]);
          }
        }, this);
      }, this);

      GongzuoxiangStatistic();
      jiafenxiangStatistic();
      ResultStatistic();
    }
  }
  Load(res);
});

router.get('/statistics.html', function (req, res, next) {
  Load(res);
});

function Load(res) {
  if (isneedshowresult == "true") {
    res.render('statistics', {
      title: title,
      users: users,
      scores: scores,
      jiafenmingxititle: jiafenmingxititle,
      jiafenxiangscores: jiafenxiangscores,
    });
  }
  else {
    var finishusercount = CountFinishUser();
    res.render('submiting', {
      users: users,
      finishusercount: finishusercount,
      jiafenmingxititle: jiafenmingxititle,
      jiafenxiangscores: jiafenxiangscores,
    });
  }
}

function initdata() {
  whoami = "";
  maxaveragescore = 0;
  maxzonglakaifencha = 0;
  isneedshowresult = "false";
  
  for (var i = 0; i < users.length; i++) {
    scores[i] = new Array();
    for (var j = 0; j < title.length; j++) {
      scores[i][j] = 0;
    }
  }

  for (var i = 0; i < users.length; i++) {
    jiafenxiangscores[i] = new Array();
    for (var j = 0; j < 2; j++) {
      jiafenxiangscores[i][j] = 0;
      if (j == 1) jiafenxiangscores[i][j] = "";
    }
  }

  usersen.forEach(function (whoen) {
    usersen.forEach(function (useren) {
      markingtitlesen.forEach(function (jiafenxiang, j) {
        if (j >= 2) {
          var jiafenxiangkey = whoen + "_" + useren + "_" + jiafenxiang;
          jiafenxiangdir[jiafenxiangkey] = 0;
        }
      }, this);
    }, this);
  }, this);
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

function GongzuoxiangStatistic() {
  var totle = 0;
  //计算工作项总分及平均分。
  scores.forEach(function (everyonescore, i) {
    for (j = 0; j < users.length; j++) {
      totle += ~~everyonescore[j];
    }
    scores[i][14] = totle.toFixed(0);
    var average = (totle / scores.length).toFixed(1);
    scores[i][15] = average;

    if (average > maxaveragescore) {
      maxaveragescore = average;
    }
    totle = 0;
  }, this);

  //计算工作项拉开分差。
  scores.forEach(function (everyonescore, i) {
    scores[i][16] = (scores[i][15] / maxaveragescore * 140).toFixed(1);
  }, this);
}

function jiafenxiangStatistic() {
  //计算每个人的加分项总全，并记录明细。
  var jiafenxiangtotal = 0;
  var jiafenxiangmingxi = "";
  usersen.forEach(function (useren, i) {
    usersen.forEach(function (whoen) {
      markingtitlesen.forEach(function (jiafenxiang, j) {
        if (j >= 2) {
          var jiafenxiangkey = whoen + "_" + useren + "_" + jiafenxiang;
          var value = jiafenxiangdir[jiafenxiangkey];
          if (value > 0) {
            jiafenxiangmingxi += users[usersen.indexOf(whoen)] + ">" + markingtitle[markingtitlesen.indexOf(jiafenxiang)] + "【" + value + "】";
          }
          jiafenxiangtotal += value;
        }
      }, this);
    }, this);
    if(jiafenxiangtotal > 10){
      jiafenxiangtotal = 10;
    }
    scores[i][17] = jiafenxiangtotal;
    jiafenxiangscores[i][0] = jiafenxiangtotal;
    jiafenxiangscores[i][1] = jiafenxiangmingxi;
    jiafenxiangtotal = 0;
    jiafenxiangmingxi = "";
  }, this);
}

function ResultStatistic() {
  //计算总-拉开分差。
  scores.forEach(function (everyonescore, i) {
    scores[i][18] = ~~scores[i][16] + ~~scores[i][17];
    if (scores[i][18] > maxzonglakaifencha) {
      maxzonglakaifencha = scores[i][18];
    }
  }, this);

  //计算最终分。
  scores.forEach(function (everyonescore, i) {
    scores[i][19] = (scores[i][18] / maxzonglakaifencha * 120).toFixed(1);
  }, this);

  maxaveragescore = 0;
  maxzonglakaifencha = 0;
}

module.exports = router;
