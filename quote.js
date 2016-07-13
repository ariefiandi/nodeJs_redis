/**
 * Created by AriefiandiN on 13/07/2016.
 */
var express = require('express');
var redis = require("redis");
var app = express();

var client = redis.createClient();

var quotes =[
    {author : 'Ariefiandi Nugraha', text:"Peringkasan Berita Online pada Twitter Timeline dengan menggunakan SVM"},
    {author : 'Martin Kaningan', text: "Fisika Kelas 3 SMA"},
    {author : 'Akira Toriyama', text:"Dragon Ball Super"},
    {author : 'Dan Brwon', text:" Angels & Demons"}
];

client.on('connect', function () {
    console.log('connected');
})

app.use(express.bodyParser());

app.get('/',function (req,res) {
    res.json(quotes);
})

app.get('/quote/random', function (req, res) {
    var id = Math.floor(Math.random() * quotes.length);
    var q = quotes[id];
    res.json(q);
})

app.get('/quote/:id', function (req, res) {
    if(quotes.length <= req.params.id || req.params.id<0){
        res.status = 404;
        return res.send('Error 404: No quote found');
    }
    var q = quotes[req.params.id];
    res.json(q);
})

app.post('/quote',function(req,res){
    if(!req.body.hasOwnProperty('author') || !req.body.hasOwnProperty('text')){
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect');
    }
    var newQuote = {
        author : req.body.author,
        text : req.body.text
    };
    client.rpush('quotes5',JSON.stringify(newQuote), function(err, replay){
        console.log(replay);
    });
    quotes.push(newQuote);
    res.json(true);
})

app.listen(process.env.PORT || 3412);