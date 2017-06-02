var express = require('express');
var router = express.Router();

var maxaveragescore = 0;
var maxzonglakaifencha = 0;
var isneedshowresult = "false";

var scores = new Array;
var submitters = new Array;
var jiafenxiangdir = new Array;
var jiafenxiangscores = new Array;

var users = ['陈博', '陈民敬', '陈天龙', '程遥', '邓启亮', '付金祥', '李幸斌', '吕毅', '王东杰', '许威', '叶洪', '张强', '朱龙飞','邓壮','黄腾霄','余冬','郑旭'];
var title = ['陈博', '陈民敬', '陈天龙', '程遥', '邓启亮', '付金祥', '李幸斌', '吕毅', '王东杰', '许威', '叶洪', '张强', '朱龙飞','邓壮','黄腾霄','余冬','郑旭', '总分', '平均分', '拉开差', '额外加分', '总-拉开差', '最终分'];

var jiafenmingxititle = ['姓名', '额外加分项总分', '额外加分项明细'];
var markingtitle = ['姓名', '工作项评分', '专利（东杰）', '小零识（天龙）', '导师', '定制版', '招聘', '内推', '培训', '服务生', '特殊加分'];
var markingtitlesen = ['xingming', 'gongzuoxiang', 'zhuanli', 'xiaolingshi', 'daoshi', 'dingzhiban', 'zhaopin', 'neitui', 'peixun', 'fuwusheng', 'teshujiafen'];
var usersen = ['chenbo', 'chenminjing', 'chentianlong', 'chengyao', 'dengqiliang', 'fujinxiang', 'lixingbin', 'lvyi', 'wangdongjie', 'xuwei', 'yehong', 'zhangqiang', 'zhulongfei','dengzhuang','huangtengxiao','yudong','zhengxu'];

initdata();

/* GET marking page. */
router.get('/', function (req, res, next) {
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

router.post('/statistics.html', function (req, res, next) {
  var whoami = req.body.whoami;
  var index = usersen.indexOf(whoami);
  if (index != -1) {
    submitters[index] = true;
    var key = usersen[0] + "_" + "gongzuoxiang";
    if (req.body[key] != undefined) {
      //记录工作项评分
      usersen.forEach(function (useren, i) {
        var gongzuoxiang = useren + "_" + "gongzuoxiang";
        scores[i][index] = CheckScore(req.body[gongzuoxiang]);
      }, this);

      //记录加分项评分
      usersen.forEach(function (useren, i) {
        markingtitlesen.forEach(function (jiafenxiang, j) {
          if (j >= 2) {
            var jiafenxiangkey = useren + "_" + jiafenxiang;
            var jiafenxiangdirkey = whoami + "_" + useren + "_" + jiafenxiang;
            jiafenxiangdir[jiafenxiangdirkey] = CheckScore(req.body[jiafenxiangkey]);
          }
        }, this);
      }, this);

      GongzuoxiangStatistic();
      jiafenxiangStatistic();
      ResultStatistic();
    }
    Load(res);
  }
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
      submitters: submitters,
      finishusercount: finishusercount,
      jiafenmingxititle: jiafenmingxititle,
      jiafenxiangscores: jiafenxiangscores,
    });
  }
}

function initdata() {
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

  users.forEach(function (user, i){
    submitters[i] = false;
  });
}

function CheckScore(score) {
  if (score == "") {
    return 0;
  }
  else {
    return parseFloat(score);
  }
}

function CountFinishUser() {
  var count = 0;
  for (i = 0; i < users.length; i++) {
    if (parseFloat(scores[0][i]) > 0) {
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
      totle += parseFloat(everyonescore[j]);
    }
    scores[i][title.length-6] = parseFloat(totle.toFixed(0));
    var average = parseFloat((totle / scores.length).toFixed(1));
    scores[i][title.length-5] = average;

    if (average > maxaveragescore) {
      maxaveragescore = average;
    }
    totle = 0;
  }, this);

  //计算工作项拉开分差。
  scores.forEach(function (everyonescore, i) {
    scores[i][title.length-4] = parseFloat((scores[i][title.length-5] / maxaveragescore * 140).toFixed(1));
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
    scores[i][title.length-3] = jiafenxiangtotal;
    jiafenxiangscores[i][0] = jiafenxiangtotal;
    jiafenxiangscores[i][1] = jiafenxiangmingxi;
    jiafenxiangtotal = 0;
    jiafenxiangmingxi = "";
  }, this);
}

function ResultStatistic() {
  //计算总-拉开分差。
  scores.forEach(function (everyonescore, i) {
    scores[i][title.length-2] = parseFloat((scores[i][title.length-4] + scores[i][title.length-3]).toFixed(1));
    if (scores[i][title.length-2] > maxzonglakaifencha) {
      maxzonglakaifencha = scores[i][title.length-2];
    }
  }, this);

  //计算最终分。
  scores.forEach(function (everyonescore, i) {
    scores[i][title.length-1] = parseFloat((scores[i][title.length-2] / maxzonglakaifencha * 120).toFixed(1));
  }, this);

  maxaveragescore = 0;
  maxzonglakaifencha = 0;
}

module.exports = router;
