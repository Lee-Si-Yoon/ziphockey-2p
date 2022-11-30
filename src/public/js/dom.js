/** 이미지 설정 */
import background_screws from "../imgs/background_screws.png";
import background from "../imgs/background.png";
import ball from "../imgs/ball.png";
import board_score from "../imgs/board_score.png";
import board_time from "../imgs/board_time.png";
import button_down from "../imgs/button_down.png";
import button_left from "../imgs/button_left.png";
import button_right from "../imgs/button_right.png";
import button_up from "../imgs/button_up.png";
import playground_2P from "../imgs/playground_2P.png";
import playground_3P from "../imgs/playground_3P.png";
import racket_1P from "../imgs/racket_1P.png";
import racket_2P from "../imgs/racket_2P.png";
import racket_3P from "../imgs/racket_3P.png";

export { ball, racket_1P, racket_2P, racket_3P };

const IMGplayground = document.querySelector(".img__playground");
IMGplayground.src = playground_2P;
const controller = document.querySelectorAll(".img__controller");
controller.forEach((c) => (c.src = background));
const img_screws = document.querySelectorAll(".img_screws");
img_screws.forEach((i) => (i.src = background_screws));
const img__button__up = document.querySelectorAll(".img__button__up");
const img__button__left = document.querySelectorAll(".img__button__left");
const img__button__down = document.querySelectorAll(".img__button__down");
const img__button__right = document.querySelectorAll(".img__button__right");
img__button__up.forEach((i) => (i.src = button_up));
img__button__left.forEach((i) => (i.src = button_left));
img__button__down.forEach((i) => (i.src = button_down));
img__button__right.forEach((i) => (i.src = button_right));
const img__board__score = document.querySelectorAll(".img__board__score");
img__board__score.forEach((i) => (i.src = board_score));
const img__board__time = document.querySelectorAll(".img__board__time");
img__board__time.forEach((i) => (i.src = board_time));

/** DOM 기능들 */
import { gsap } from "gsap";
import "../scss/styles.scss";

function lockButton() {
  const lockBtnP1 = document.getElementById("lock__button__P1");
  const lockBtnP2 = document.getElementById("lock__button__P2");
  function onClickShowP1() {
    body.style.overflow = "visible";
    lockBtnP1.addEventListener("click", onClickHideP1);
  }
  function onClickShowP2() {
    body.style.overflow = "visible";
    lockBtnP2.addEventListener("click", onClickHideP2);
  }
  function onClickHideP1() {
    body.style.overflow = "hidden";
    lockBtnP1.removeEventListener("click", onClickHideP1);
    lockBtnP1.addEventListener("click", onClickShowP1);
  }
  function onClickHideP2() {
    body.style.overflow = "hidden";
    lockBtnP2.removeEventListener("click", onClickHideP2);
    lockBtnP2.addEventListener("click", onClickShowP2);
  }
  lockBtnP1.addEventListener("click", onClickHideP1);
  lockBtnP2.addEventListener("click", onClickHideP2);
}
lockButton();

/**
 * 페이지 숨기고 보여줄 때 사용
 * @param {HTMLElement} hide 숨길 것
 * @param {HTMLElement} show 보여줄 것
 */
export function hideAndShow(hide, show) {
  hide.classList.add("hidden");
  show.classList.remove("hidden");
}
const body = document.querySelector("body");
window.onload = () => {
  body.classList.remove("loading");
  gsap.from(body, {
    opacity: 0,
    duration: 1,
    ease: "Power3.easeOut",
  });
};
