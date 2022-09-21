import Matter from "matter-js";
const socket = io();
/**
 *
 * @param {HTMLElement} HTMLElement matter.js container
 */
function initMatter(matterHolder) {
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
  window.requestAnimationFrame(mapHTML);

  const placement = { x: 1, y: 1 };
  const spacing = { x: 300, y: 300 };
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
  socket.on("getText", (key) => {
    const list = document.createElement("li");
    list.innerText = key;
    // 이것도 개선
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    list.dataset.object = getRandomInt(100);
    textContainer.appendChild(list);
    addObject(list);
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

  function mapHTML() {
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
    });

    window.requestAnimationFrame(mapHTML);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const matterholder = document.getElementById("matter");
  if (!matterholder) return;
  initMatter(matterholder);
});
