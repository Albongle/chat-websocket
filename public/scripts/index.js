const socket = io(); // con el io cierro la conexion entre el servidor y el cliente
const message = document.querySelector("#message");
const user = document.querySelector("#user");
const actions = document.querySelector("#websocket-actions");
const send = document.querySelector("#send");
const messages = document.querySelector("#websocket-messages");


message.addEventListener("keyup", (event) => {
  const exp = new RegExp("[a-zA-Z]+[0-9]?");
  if (!exp.test(user.value)) {

    alert("Debe ingresar un usuario o nombre valido");
    message.value = "";
    user.value = "";
    user.focus();
  }else if((message.value != "")){
    eventTiping("tiping");
  }else{
    eventTiping("notiping");
  }
});


send.addEventListener("click",()=>{

  const exp = new RegExp("^ *$");
  if(message.value.length>0 && !exp.test(message.value)){
    eventNewMessage();
  }

  
});

user.addEventListener("change",()=>{
  const exp = new RegExp("[a-zA-Z]+[0-9]?");
  if (exp.test(user.value)) {

    document.getElementById("saludo").innerHTML=`Bienvenido ${user.value}`;
    message.removeAttribute("disabled");
    send.removeAttribute("disabled");
  }else{
    message.setAttribute("disabled",true);
    send.setAttribute("disabled",true);
    alert("Debe ingresar un usuario o nombre valido");
  }
  
    //fetch("/",{method:"POST", headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify({user:user.value})}).catch(error=>console.error(error));
    
});

socket.on("chat:tiping", (data) => {
  if(data.status === "tiping"){
    actions.innerHTML=`<p>${data.user} esta escribiendo un mensaje</p>`;
  }else{
    actions.innerHTML="";
  }
});


socket.on("new:message",(data)=>{
  if(socket.id === data.id){
    messages.innerHTML+=`<p class="messages-me"><span>${data.user}:</span> ${data.message}</p>`
  }else{
    messages.innerHTML+=`<p class="messages-other"><span>${data.user}:</span> ${data.message}</p>`
  }
  

});

const eventTiping = (status)=>{

  socket.emit("chat:tiping", { user: user.value, id: socket.id,status:status });

}
const eventNewMessage = ()=>{

  socket.emit("new:message", { user: user.value, id: socket.id,message:message.value});
  message.value="";
  eventTiping("notiping");
}
