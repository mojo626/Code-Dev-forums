/*
███╗░░░███╗░█████╗░░░░░░██╗░█████╗░
████╗░████║██╔══██╗░░░░░██║██╔══██╗
██╔████╔██║██║░░██║░░░░░██║██║░░██║
██║╚██╔╝██║██║░░██║██╗░░██║██║░░██║
██║░╚═╝░██║╚█████╔╝╚█████╔╝╚█████╔╝
╚═╝░░░░░╚═╝░╚════╝░░╚════╝░░╚════╝░
hope you enjoy!
*/


console.log("server is starting");


//setting up the server
var express = require('express');
var app = express();
var server = app.listen(3000, listening);

var fs = require('fs');
var dat = fs.readFileSync('save.json');

//this gets all of the data for the site (threads, posts, likes ect.) the data is held in an external json file called save.json
var data = JSON.parse(dat);
module.exports = { data };

function listening() {
  console.log("listening...");
}

app.use(express.static('website'));

app.get('/data/:thread', sendData);
app.get('/data', drawHome);


//this is the html for the pages that it renders
var strHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Code-dev</title><link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><link href="/style.css" rel="stylesheet" type="text/css" /></head>  ';

var strHead = '<body>                  <div id="header"><a href="/home.html"><h2 id="logo"><b>//Code-Dev</b> forums</h2></a></div>';

var strForm = '<br><form method="post" action="/';

var strForm2 = '" id="postForm" name="postForm">                      <p style="color: white; margin-bottom: 3px;">Title:</p> <input type="text" name="titleInput" required><br>                      <p style="color: white; margin-bottom: 3px;">Question:</p><textarea style="margin-top: 0;" type="text" name="txtInput" placeholder="Say Something Nice :)" required></textarea><br>                                                               <input type="submit" value="Post"></form>';
var strStart = '<div id="threads">';

var strDiv = '</div>';

var strEnd = '<!--<script src="../server.js"></script>--><script src="/script2.js"></script></body></html>';

var str3 = '';


function drawHome(req, res) {
  res.send(strHtml + strHead + strEnd);
}

//this renders the page where you can see all of the posts in a thread
//it loops through all of the posts in the thread, and renders them along with the html above /\
function sendData(req, res) {
  str3 = '';
  var thread = req.params.thread; {
    str3 = str3.concat("<h1 class='title2'>" + data.threads[thread * 2] + "</h2><br>");
    for (var j = data.threads[(thread * 2) + 1].length - 1; j > -1; j -= 1) {
      str3 = str3.concat(addQuestions(j, thread));
      for (var t = 0; t < data.threads[(thread * 2) + 1][j].comments.length; t++) {
      }
    }
  }
  res.send(strHtml + strHead + strStart + str3 + strDiv + strForm + thread + strForm2 + strEnd);
}

//this is where it renders individual questions, and the responses
app.get('/data/:thread/:question', function(req, res) {
  var thread = req.params.thread;
  var ques = req.params.question;
  var postStr = '';
  postStr = postStr.concat(addPosts(ques, thread));
  for (var t = 0; t < data.threads[(thread * 2) + 1][ques].comments.length; t++) {
    postStr = postStr.concat(addComments(ques, t, thread));
  }
  res.send(strHtml + strHead + strStart + postStr + strDiv + strEnd);
});

//this is a helper funciton for rendering the questions
function addQuestions(j, thread) {
  var str = '';
  str = str.concat("<div class='post'>" + "<a href='/data/" + thread + "/" + j + "'><h1 class='title'>" + data.threads[(thread * 2) + 1][j].title + "</h1></a></div>");
  return str;
}

//this is another helper function for rendering posts
function addPosts(j, thread) {
  var str = '';
  str = str.concat("<div class='post'><p class='likes'>Likes: " + data.threads[(thread * 2) + 1][j].likes + "</p>" + "<h2 class='title'>" + data.threads[(thread * 2) + 1][j].title + "</h2><p class='content'>" + data.threads[(thread * 2) + 1][j].content + "</p><br><p class='like' onClick='Like(" + j + ", " + thread + ")'>Like</p><p class='reply' onclick='reply2(" + j + ")'>reply</p>" + "</div><br>");
  str = str.concat("<div class='comment2' id='postBox" + j + "'><form method='post' action='/reply/" + thread + "/" + j + "' name='formReply" + j + "'><input type='text' name='txt'><input type='submit' value='Post'></form></div><br><br>");
  return str;
}


//this is a helper function for rendering replys to posts
function addComments(j, t, thread) {
  var str = '';
  str = str.concat("<div class='comment'>" + data.threads[(thread * 2) + 1][j].comments[t].content + "</div><br><br>");
  return str;
}

function addPost() {
  console.log("post added!");
}


//this is where all of the code for replying, adding posts, and liking quesitons are
var http = require('http');
var server = http.createServer(app);
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
//this is where it adds a post when you post one
app.post('/:thread', function(req, res) {
  console.log(req.body);
  //res.sendStatus(200);
  var thread = req.params.thread;
  data.threads[(thread * 2) + 1].push(
    {
      title: req.body.titleInput,
      content: req.body.txtInput,
      comments: [],
      likes: 0
    }
  );
  var dta = JSON.stringify(data);
  fs.writeFile('save.json', dta, finished);
  res.redirect('/data/' + thread);
});

//this is how it adds a reply
app.post('/reply/:thread/:post', function(req, res) {
  console.log(req.body);
  var thread = req.params.thread;
  data.threads[(thread * 2) + 1][req.params.post].comments.push(
    {
      title: "title",
      content: req.body.txt,
      comments: [],
      likes: 0
    }
  );
  var dta = JSON.stringify(data);
  fs.writeFile('save.json', dta, finished);
  res.redirect('/data/' + thread + "/" + req.params.post);
});

//this is where it likes the posts
app.get('/like/:post/:thread', function(req, res) {
  console.log(req.body);
  var thread = req.params.thread;
  data.threads[(thread * 2) + 1][req.params.post].likes++;
  var dta = JSON.stringify(data);
  fs.writeFile('save.json', dta, finished);
  res.redirect('/data/' + thread + "/" + req.params.post);
});

//this is the code for searching
app.post('/search/search', function(req, res) {
  var val = req.body.searchVal;
  console.log(val);
  var result = [];
  var dtaa = [];
  for (var i = 1; i < data.threads.length; i += 2) {
    for (var j = 0; j < data.threads[i].length; j++) {
      if (data.threads[i][j].content.includes(val)) {
        result.push(data.threads[i][j]);
        dtaa.push(
          {
            thread: i,
            post: j
          }
        );
        continue;
      }
      if (data.threads[i][j].title.includes(val)) {
        result.push(data.threads[i][j]);
        dtaa.push(
          {
            thread: i,
            post: j
          }
        );
        continue;
      }
      for (var t = 0; t < data.threads[i][j].comments.length; t++) {
        if (data.threads[i][j].comments[t].content.includes(val)) {
          result.push(data.threads[i][j]);
          dtaa.push(
            {
              thread: i,
              post: j
            }
          );
          continue;
        }
      }
    }
  }


  var returnStr = '';
  returnStr = returnStr.concat("<h1 class='title2'>Search Results:</h2><br>");
  for (var j = 0; j < result.length; j++) {
    returnStr = returnStr.concat("<div class='post'>" + "<a href='/data/" + (dtaa[j].thread - 1) / 2 + "/" + dtaa[j].post + "'><h1 class='title'>" + data.threads[dtaa[j].thread][dtaa[j].post].title + "</h1></a></div>");
  }
  res.send(strHtml + strHead + strStart + returnStr + strDiv + strEnd);
});

function finished(err) {
  console.log("edited!");
}

server.listen(process.env.PORT, process.env.IP);

//and we are done! have a great day :)