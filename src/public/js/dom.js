/** 폰트 설정 */
import "../fonts/PPNeueBit-Bold.woff";
import "../fonts/BEANPOLL-Bold.woff";

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
const body = document.querySelector("body");
const playground = document.querySelector(".play");
import { gsap } from "gsap";
import "../scss/styles.scss";

// 화면고정 버튼
function lockButton() {
  const lockBtnP1 = document.getElementById("lock__button__P1");
  const lockBtnP2 = document.getElementById("lock__button__P2");
  function onClickShowP1() {
    body.style.overflow = "visible";
    body.style.position = "relative";
    playground.style.top = "0px";
    lockBtnP1.addEventListener("touchstart", onClickHideP1);
  }
  function onClickShowP2() {
    body.style.overflow = "visible";
    body.style.position = "relative";
    playground.style.left = "0px";
    lockBtnP2.addEventListener("touchstart", onClickHideP2);
  }
  function onClickHideP1() {
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    playground.style.top = "-312px";
    lockBtnP1.removeEventListener("touchstart", onClickHideP1);
    lockBtnP1.addEventListener("touchstart", onClickShowP1);
  }
  function onClickHideP2() {
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    playground.style.left = "-414px";
    lockBtnP2.removeEventListener("touchstart", onClickHideP2);
    lockBtnP2.addEventListener("touchstart", onClickShowP2);
  }
  lockBtnP1.addEventListener("touchstart", onClickHideP1);
  lockBtnP2.addEventListener("touchstart", onClickHideP2);
}
lockButton();
// 핀치 줌 막기
function UX_preventers() {
  const H1 = document.querySelectorAll("h1");
  const H2 = document.querySelectorAll("h2");
  H1.forEach((h) => {
    h.addEventListener("touchstart", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    h.addEventListener("gesturestart", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });
  H2.forEach((h) => {
    h.addEventListener("touchstart", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    h.addEventListener("gesturestart", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });
  // const play = document.querySelector(".play");
  // play.addEventListener(
  //   "touchmove",
  //   function (event) {
  //     if (event.scale !== 1) {
  //       event.preventDefault();
  //       event.stopPropagation(); // maybe useless
  //     }
  //   },
  //   false
  // );
  document.addEventListener(
    "touchmove",
    function (event) {
      if (event.scale !== 1) {
        event.preventDefault();
        event.stopPropagation(); // maybe useless
      }
    },
    false
  );
  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length > 1) {
        // console.log("zoom plz stahp");
        event.preventDefault();
        event.stopPropagation(); // maybe useless
      }
    },
    { passive: false }
  );
  document.addEventListener(
    "gesturestart",
    (event) => {
      if (event.touches.length > 1) {
        // console.log("zoom plz stahp");
        event.preventDefault();
        event.stopPropagation(); // maybe useless
      }
    },
    { passive: false }
  );
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (e) {
      let now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
}
UX_preventers();

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
