const socket = io(); // con el io cierro la conexion entre el servidor y el cliente
const message = document.querySelector("#message");
const user = document.querySelector("#user");
const actions = document.querySelector("#websocket-actions");
const send = document.querySelector("#send");
const messages = document.querySelector("#websocket-messages");

message.addEventListener("keyup", (event) => {
  if (user.value === "") {

    alert("Debe ingresar un usuario");
    message.value = "";
    user.focus();
  }else if((message.value != "")){
    eventTiping("tiping");
  }else{
    eventTiping("notiping");
  }
});


send.addEventListener("click",()=>{
  eventNewMessage();
})

user.addEventListener("change",()=>{
    
    //fetch("/",{method:"POST", headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({user:user.value})}).catch(error=>console.error(error));
    document.getElementById("saludo").innerHTML=`Bienvenido ${user.value}`;
})

socket.on("chat:tiping", (data) => {
  if(data.status === "tiping"){
    actions.innerHTML=`<p>${data.user} esta escribiendo un mensaje</p>`;
  }else{
    actions.innerHTML="";
  }
});


socket.on("new:message",(data)=>{
  messages.innerHTML+=`<p><span>${data.user}:</span> ${data.message}</p>`

});

const eventTiping = (status)=>{

  socket.emit("chat:tiping", { user: user.value, id: socket.id,status:status });

}
const eventNewMessage = ()=>{

  socket.emit("new:message", { user: user.value, id: socket.id,message:message.value});
  message.value="";
  eventTiping("notiping");
}
