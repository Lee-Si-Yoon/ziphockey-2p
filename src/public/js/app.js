// const socket = io();
import { gsap } from "gsap";
import "../scss/styles.scss";

const body = document.querySelector("body");

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
