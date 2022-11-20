var socket = io();
import { gsap } from "gsap";
import "../scss/styles.scss";

const body = document.querySelector("body");

let clientBalls = {};

socket.on("makeRoom", (clientNo) => {
  const container = document.querySelector(".playground__container");
  const data = document.getElementById("data");
  data.innerHTML = "player: " + clientNo;
  if (+clientNo === 1) {
    window.scrollTo(0, window.innerHeight);
  } else {
    window.scrollTo(window.innerWidth, 0);
  }
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
