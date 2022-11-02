import { gsap } from "gsap";
import { v4 as uuidv4 } from "uuid";
import "../scss/styles.scss";
const socket = io();

const body = document.querySelector("body");
const homeContainer = document.querySelector(".home");
const newRoomContainer = document.querySelector(".newroom");
const readyContainer = document.querySelector(".ready");

const enterNewRoom = document.getElementById("enterNewRoom");
const enterRoomForm = document.getElementById("enterRoomForm");
const backToHome = newRoomContainer.querySelector(".back");
const newRoomForm = document.getElementById("newRoomForm");
const readyNumber = document.getElementById("ready__number");
const readyRoomName = document.getElementById("ready__roomName");
const readyButton = document.getElementById("ready__button");

let nameOfRoom;

window.onload = () => {
  body.classList.remove("loading");
  gsap.from(body, {
    opacity: 0,
    duration: 1,
    ease: "Power3.easeOut",
  });

  enterNewRoom.addEventListener("click", () => {
    newRoomContainer.classList.remove("hidden");
    homeContainer.classList.add("hidden");
  });
  backToHome.addEventListener("click", () => {
    homeContainer.classList.remove("hidden");
    newRoomContainer.classList.add("hidden");
  });

  enterRoomForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = enterRoomForm.querySelectorAll("input");
    socket.emit("enterRoom", inputs[0].value);
    if (inputs[0].value !== "" && inputs[0].value !== "enter room id") {
      readyContainer.classList.remove("hidden");
      homeContainer.classList.add("hidden");
      readyRoomName.innerText = `${inputs[0].value}`;
    }
  });

  newRoomForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { value } = newRoomForm.querySelector(".room__capacity__number");
    nameOfRoom = uuidv4().slice(0, 3) + value;
    socket.emit("enterRoom", nameOfRoom);
    readyContainer.classList.remove("hidden");
    newRoomContainer.classList.add("hidden");
    readyRoomName.innerText = nameOfRoom;
    readyNumber.innerText = `1/${value}`;
  });

  socket.on("welcome", (roomName, count) => {
    const capacity = roomName.slice(-1);
    readyNumber.innerText = `${count}/${capacity}`;
    if (+count == +capacity) {
      readyButton.innerHTML = "Are you ready?";
      function onClick() {
        readyButton.classList.remove("orange");
        readyButton.classList.add("green");
        readyButton.innerHTML = "Ready!";
        socket.emit("getReady", roomName, count);
        readyButton.removeEventListener("click", onClick);
      }
      readyButton.addEventListener("click", onClick);
    }
  });

  socket.on("ready", (roomName, count) => {
    const capacity = roomName.slice(-1);
    readyNumber.innerText = `${count}/${capacity}`;
    if (+count == +capacity) {
      readyButton.innerHTML = "Are you ready?";
      function onClick() {
        readyButton.classList.remove("orange");
        readyButton.classList.add("green");
        readyButton.innerHTML = "Ready!";
        readyButton.removeEventListener("click", onClick);
      }
      readyButton.addEventListener("click", onClick);
    }
  });
};
