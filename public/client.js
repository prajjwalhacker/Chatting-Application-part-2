/*socket = io("localhost:3000");

const name = prompt("Enter your name to join");




socket.emit("user-joined" , name, room);
*/
var socket = io();


const name = prompt("Enter your name to join");

if(name === ""){
    name = "Anonymous";
}


const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.containerr');

const bttn = document.querySelector('.btnn');

var room = document.getElementById("yy").innerText;



const append = function(message,position){
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(position);
      messageElement.innerText = message;
      messageContainer.append(messageElement);
      scrollToBottom();
}

socket.emit('new-user-joined', name , room);


socket.on('dis-user', function(data){
    append(`${data} leave the chat` , "left");
});


socket.on('user-joined', function(data){ 
      append(`${data} joined the chat` , "left");
});



form.addEventListener('submit', function(e){
     ////console.log("hhello lala");
     e.preventDefault();
     const message = messageInput.value;
     append(`You: ${message}`, "left");
     socket.emit('send', { message : message , name : name} );  
});



socket.on('receive', function(val){
    append(`${val.name}: ${val.data}`, val.pos);
});


if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } else {
      alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
  }
  
///var lat = 0;
//var long = 0;

 




  function successFunction(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
     console.log('Your latitude is :'+lat+' and longitude is '+long);
     socket.emit('lati-long',{lati : lat , long : long});
 };

 
 function  errorFunction() {
     alert("Geocoder failed.");
 }


function scrollToBottom(){
    messageContainer.scrollTop = messageContainer.scrollHeight;

}

//console.log("hello lala");
 