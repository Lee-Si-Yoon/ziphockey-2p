import express from "express";
const app = express();
import http from "http";
const httpServer = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(httpServer);
import { staticPage } from "./controllers";

// express 세팅
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src" + "/views");
app.use("/assets", express.static("assets"));

// 라우팅
app.get("/", staticPage("home", "welcome"));

io.on("connection", (socket) => {

});


export default httpServer;
