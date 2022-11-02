const socket = io();
// 그 다음 연결고리 만들기
// import { emitMessage } from "./utils";

let rafId;
let lux = 0;
let stopped = false;

class BypassText {
  constructor() {
    // 빛 - 일단은 requestAnimation에서 사용해야 해서 넣음, 분리시키기
    this.container = document.getElementById("lightContainer");
    this.luxLimit = 300;
    // 메세지
    this.textContainer = document.getElementById("textAreaContainer");
    this.startPosition = { x: 0, y: 0 };
    this.velocity = 2;
    this.accel = 0.25;
    this.realWorld = "left";

    if ("AmbientLightSensor" in window) {
      const sensor = new AmbientLightSensor({ frequency: 20 });
      sensor.addEventListener("reading", (e) => {
        lux = e.target.illuminance;
        this.container.children[0].innerHTML = "✦: " + lux;
        if (+lux >= this.luxLimit) {
          this.container.children[0].innerHTML = "✦: " + "booooom!";
          stopped = true;
        } else {
          this.velocity = 2;
          stopped = false;
          this.render();
        }
      });
      sensor.addEventListener("error", (e) => {
        this.container.children[0].innerHTML = e.error.name + e.error.message;
      });
      sensor.start();
    } else {
      this.container.children[0].innerHTML = "센서 없음";
    }

    socket.on(this.realWorld, (key) => {
      const newLi = document.createElement("li");
      newLi.innerHTML = key;

      let textChildrens = [
        // this 말고 document에서 다시 확인
        ...document.getElementById("textAreaContainer").children,
      ];

      if (textChildrens.length === 0) {
        this.textContainer.appendChild(newLi);
        this.container.style.display = "none";
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
        this.container.style.display = "flex";
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
  const bypassText = new BypassText();
};
