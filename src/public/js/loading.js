const socket = io();

const readyNumber = document.getElementById("ready__number");
const readyButton = document.getElementById("ready__button");

socket.on("room_change", (publicRooms) => {
  console.log(publicRooms);
  // console.log(roomCapacity, playerList);
  // readyNumber.innerHTML = playerList;
  // if (roomCapacity === playerList) {
  //   readyButton.innerHTML = "ready!";
  //   readyButton.classList.add("green");
  // }
});
