var socket = io();
import { gsap } from "gsap";
import "../scss/styles.scss";

const body = document.querySelector("body");

let clientBalls = {};

socket.on("makeRoom", (clientNo, roomNo) => {
  const statusP1 = document.querySelector(".status__P1");
  const statusP2 = document.querySelector(".status__P2");
  const playerNum = +clientNo % 2;
  if (playerNum === 1) {
    // 1번 플레이어
    statusP1.children[0].innerHTML = "room: " + roomNo;
    statusP1.children[1].innerHTML = "player: " + clientNo;
  } else {
    // 2번 플레이어
    statusP2.children[0].innerHTML = "room: " + roomNo;
    statusP2.children[1].innerHTML = "player: " + clientNo;
  }
});

const lockBtnP1 = document.querySelector(".lock__button__P1");
const lockBtnP2 = document.querySelector(".lock__button__P2");
lockBtnP1.addEventListener("click", () => {
  body.style.overflow = "hidden";
});
lockBtnP2.addEventListener("click", () => {
  body.style.overflow = "hidden";
});

/**
 * 페이지 숨기고 보여줄 때 사용
 * @param {HTMLElement} hide 숨길 것
 * @param {HTMLElement} show 보여줄 것
 */
export function hideAndShow(hide, show) {
  hide.classList.add("hidden");
  show.classList.remove("hidden");
}

window.onload = () => {
  body.classList.remove("loading");
  gsap.from(body, {
    opacity: 0,
    duration: 1,
    ease: "Power3.easeOut",
  });
};
