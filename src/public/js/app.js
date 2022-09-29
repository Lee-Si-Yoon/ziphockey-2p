import { gsap } from "gsap";
import TextArea from "./text";
import "../scss/styles.scss";

const socket = io();

const body = document.querySelector("body");

window.onload = () => {
  body.classList.remove("loading");
  gsap.from(body, {
    opacity: 0,
    duration: 1,
    ease: "Power3.easeOut",
  });
  const textarea = new TextArea(
    document.getElementById("textAreaContainer"),
    document.querySelector(".send__form")
  );
};
