const express = require("express");
const path = require("path");
const expresshbs = require("express-handlebars");
const SocketIO = require("socket.io");
const app = new express();



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,"public")));

//setings
app.set("port",process.env.PORT || 3000); //Puerto
app.engine("hbs",expresshbs.engine({
    defaultLayout: "layout",
    extname: ".hbs",
    layoutsDir: path.join(__dirname,"/views/layouts"),
    partialsDir: path.join(__dirname,"/views/partials")

})); //motor de plantillas
app.set("views","./views/");
app.set("view engine","hbs");


app.get("/",(req, res)=>{
    res.render("index",{saludo:"Bienvenido"});
});

app.post("/",(req, res)=>{
    
    req.body.user != undefined ? res.render("index",{saludo:`Bienvenido ${req.body.user}`}) : res.status(406).send({error:"No se recibio el usuario"});
});

const server = app.listen(app.get("port"),()=>console.log(`App escuchando en ${app.get("port")}`));
const io = SocketIO(server);

io.on("connection",(socket)=>{
    console.log("Usuario conectado con ID", socket.id);

    socket.on("chat:tiping",(data)=>{
        socket.broadcast.emit("chat:tiping", data);
    });
    socket.on("new:message",(data)=>{
        io.sockets.emit("new:message", data);
    });
});