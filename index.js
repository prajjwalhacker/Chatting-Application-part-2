const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { checkServerIdentity } = require("tls");

const server = require("http").Server(app);
const port = process.env.PORT || 3000;



app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(express.static("public"));

server.listen(port, function(req , res){
       console.log("server started");
});

let map = new Map();

var User = [];
const users= {};

const io = require('socket.io')(server);



app.get("/live", function(req,res){
       res.render("Live", {map : map, users : users});
   });
   

io.on('connection', function(socket){
       socket.on('new-user-joined', function(name, room){
           console.log(name);
           socket.name = name;
           socket.room = room;
           socket.join(room);

           users[socket.id] = name;
           socket.broadcast.to(room).emit('user-joined', name);

       });
       socket.on('chat', function(msg){
        io.sockets.in(socket.room).emit('receive', msg);
       });

       socket.on('send',function(msg){
           socket.broadcast.to(socket.room).emit('receive', {data : msg.message , name : msg.name , pos : "right"});
       });
       socket.on('disconnect',function(){
           map.delete(socket.id);
           socket.broadcast.to(socket.room).emit('dis-user', users[socket.id]);
       });
       socket.on('lati-long', function(data){
              let url =  "https://api.opencagedata.com/geocode/v1/json?q=" + data.lati + "+" + data.long + "&key=3f973de1de964040b40d211d05515e0d";
              fetch(url)
                   .then(result => {return result.json()})
                   .then(function(data){
                      map.set(socket.id,data.results[0].formatted);
                      /////console.log("hello everyone i am fine");
                  });
             });
});


check = function(S){
      ///console.log("glg");
      for(let i=0;i<(User.length);i++){
             if(User[i] === S){
                   return 1;
             }
      }
      return 0;
};



app.get("/", function(req,res){
     res.render("main");
});

app.post("/rooms" , function(req,res){
       ////console.log("hellloo");
       if(check(req.body.room_name)){
             res.redirect("/rooms");
            ////res.render("groups" , {user : User}); 
       } 
       else{
           ////console.log(req.body.room_name);
           User.push(req.body.room_name);
           res.redirect("/rooms");
           ////res.render("groups" , {user : User}); 
       }
});



app.get("/rooms", function(req,res){
    res.render("groups", {user : User});
});



app.get("/:roomname", function(req,res){
       console.log(req.params.roomname);
       res.render("chatroom", { room : req.params.roomname});
});