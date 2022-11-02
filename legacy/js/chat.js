import Matter from "matter-js";

const socket = io();

/**
 *
 * @param {HTMLElement} HTMLElement matter.js container
 */
function initMatter(matterHolder) {
  const chatInput = document.getElementById("chatInput");
  const textContainer = document.getElementById("textContainer");

  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World;

  // 엔진 생성
  const engine = Engine.create({ enableSleeping: true });
  const engineWorld = engine.world;
  engineWorld.gravity.y = -1;

  // 전체 캔버스 크기 선언
  const heightAdjust = 1;
  const width = matterHolder.clientWidth;
  const height = matterHolder.clientHeight * heightAdjust;

  // 렌더러 생성
  const render = Render.create({
    element: matterHolder,
    engine: engine,
    options: {
      showPerformance: true,
      wireframes: true,
      width,
      height,
    },
  });
  Render.run(render);

  // 해상도 통일
  const scale = window.devicePixelRatio;
  Render.setPixelRatio(render, scale);

  // 러너 생성
  const runner = Runner.create();
  Runner.run(runner, engine);

  // const placement = { x: 1, y: 1 };
  // const spacing = { x: 300, y: 300 };
  createBoundingBox();

  // 테두리에 튕기도록 에어리어 설정
  function createBoundingBox() {
    World.add(engineWorld, [
      Bodies.rectangle(width / 2, height + 250, width, 500, {
        isStatic: true,
        label: "_noMap",
      }),
      Bodies.rectangle(width / 2, -50, width, 100, {
        isStatic: true,
        label: "_noMap",
      }),
      Bodies.rectangle(-50, height / 2, 100, height, {
        isStatic: true,
        label: "_noMap",
      }),
      Bodies.rectangle(width + 50, height / 2, 100, height, {
        isStatic: true,
        label: "_noMap",
      }),
    ]);
  }
  // 튕길 글자 생성
  chatInput.addEventListener("input", (event) => {
    const list = document.createElement("li");
    // 이것도 개선
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    list.innerText = event.target.value;
    list.dataset.object = `${event.target.value} + ${getRandomInt(100)}`;
    textContainer.appendChild(list);
    addObject(list);
    event.target.value = "";
  });

  // 강체 생성
  function addObject(object) {
    const objWidth = object.scrollWidth;
    const objHeight = object.scrollHeight;
    const rect = function () {
      return Matter.Bodies.rectangle(
        width / 2,
        height - objHeight,
        objWidth,
        objHeight,
        {
          label: object.getAttribute("data-object"),
          density: 1,
          frictionAir: 0.01,
          restitution: 0.5,
          friction: 0.1,
          render: {
            fillStyle: "transparent",
            strokeStyle: "transparent",
          },
        }
      );
    };
    World.add(engineWorld, rect());

    // Matter.Sleeping.update(rect, 50);
    // const rotation = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1);
    // Matter.Body.rotate(rect, rotation);
  }

  // raf
  const fps = 60;
  let stop = false;
  let frameCount = 0;
  let fpsInterval, startTime, now, then, elapsed;
  const fpsMeter = document.getElementById("fps");

  function startAnimate() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    mapHTML();
  }
  startAnimate();

  function mapHTML() {
    if (stop) return;
    requestAnimationFrame(mapHTML);
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);

      // draw here
      const allBodies = Matter.Composite.allBodies(engineWorld);

      allBodies.forEach((body) => {
        const targetObject = matterHolder.querySelector(
          `[data-object="${body.label}"]`
        );
        if (body.label === "_noMap" || !targetObject) {
          return;
        }
        targetObject.style.setProperty("--move-x", `${body.position.x}px`);
        targetObject.style.setProperty("--move-y", `${body.position.y}px`);
        targetObject.style.setProperty("--rotate", `${body.angle}rad`);
        if (parseInt(targetObject.style.getPropertyValue("--move-y")) <= 10) {
          textContainer.removeChild(targetObject);
          // 이거 잘 안됨
          World.remove(engineWorld, allBodies[4]);
          // console.log(allBodies);
          socket.emit("newText", targetObject.innerText);
        }
      });

      let sinceStart = now - startTime;
      let currentFps =
        Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
      fpsMeter.innerText = `your fps: ${currentFps}`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const matterholder = document.getElementById("matter");
  if (!matterholder) return;
  initMatter(matterholder);
});
