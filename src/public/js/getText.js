const socket = io();
// import { emitMessage } from "./utils";

let rafId;
let lux = 0;
let stopped = false;

class Light {
  constructor() {
    this.container = document.getElementById("lightContainer");
    this.luxLimit = 150;
    if ("AmbientLightSensor" in window) {
      const sensor = new AmbientLightSensor({ frequency: 20 });
      sensor.addEventListener("reading", (e) => {
        lux = e.target.illuminance;
        this.container.children[0].innerHTML = "✦: " + lux;
        if (lux >= luxLimit) {
          stopped = true;
          // cancelAnimationFrame(rafId);
        } else {
          stopped = false;
        }
      });
      sensor.addEventListener("error", (e) => {
        this.container.children[0].innerHTML = e.error.name + e.error.message;
      });
      sensor.start();
    } else {
      this.container.children[0].innerHTML = "센서 없음";
    }
  }
}

class BypassText {
  constructor(element) {
    // 투명화
    this.others = element;
    // 메세지
    this.textContainer = document.getElementById("textAreaContainer");
    this.startPosition = { x: 0, y: 0 };
    this.velocity = 2;
    this.accel = 0.25;
    this.realWorld = "right";

    socket.on(this.realWorld, (key) => {
      const newLi = document.createElement("li");
      newLi.innerHTML = key;

      let textChildrens = [
        // this 말고 document에서 다시 확인
        ...document.getElementById("textAreaContainer").children,
      ];

      if (textChildrens.length === 0) {
        this.others.forEach((e) => {
          e.style.display = "none";
        });
        this.textContainer.appendChild(newLi);
        // 위치설정
        // 모바일로 봤을 때 키보드 위에서 발사되는 문제
        this.textContainer.style.transform = `translateY(${
          window.innerHeight - this.textContainer.getBoundingClientRect().height
        }px)`;
        this.startPosition.x = this.textContainer.getBoundingClientRect().x;
        this.startPosition.y = this.textContainer.getBoundingClientRect().y;
        this.render();
      } else {
        alert("이미 보내고 있는 메세지가 있습니다");
        location.reload();
        // delete this.textContainer.children;
      }
    });
  }
  render() {
    this.velocity += this.accel;
    this.startPosition.y = this.startPosition.y - this.velocity;
    this.textContainer.style.transform = `translateY(${this.startPosition.y}px)`;
    if (!stopped) {
      rafId = requestAnimationFrame(() => this.render());
      if (this.startPosition.y < 0) {
        this.others.forEach((e) => {
          e.style.display = "flex";
        });
        // 값 초기화
        this.startPosition.y = this.startPosition.x = 0;
        this.velocity = 2;
        // 애니메이션 초기화
        cancelAnimationFrame(rafId);
      }
    }
  }
}

window.onload = () => {
  const light = new Light();
  const bypassText = new BypassText([light.container]);
};
