const socket = io();

const container = document.querySelector(".roomlist__container");

socket.on("room_change", (list, roomCapacity) => {
  console.log(list, roomCapacity);
  if (list.length > 0 && roomCapacity) {
    list.forEach((l) => {
      const item = document.createElement("li");
      item.classList.add("roomlist__item");
      const roomName = document.createElement("p");
      roomName.innerHTML = l.slice(0, 8) + " ..." + ` (${roomCapacity})`;
      item.appendChild(roomName);
      const enterButton = document.createElement("a");
      enterButton.classList.add("roomlist__button");
      enterButton.innerHTML = "enter";
      enterButton.addEventListener("click", (e) => {
        socket.emit("enterRoom", l);
        window.location.replace("/loading");
      });
      item.appendChild(enterButton);
      container.appendChild(item);
      const hairLine = document.createElement("hr");
      container.appendChild(hairLine);
    });
  } else return;
});
