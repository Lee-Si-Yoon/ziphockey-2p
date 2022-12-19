<div align="center">
  <img src="https://user-images.githubusercontent.com/76679207/208438943-f5c45117-e75c-4b59-b7a0-3ad44402268f.jpg" width="400" alt="logo"/>
  <br/>
  <p>Airhockey multiplayer webgame <br/> 멀티플레이어 에어하키 모바일 게임</p>
</div>

## Preview

<div align="center">
  <h3>2P play</h3>
  <img src="https://user-images.githubusercontent.com/76679207/208439209-738afc44-20c5-4e15-a897-a14d695193b6.gif" width="400" alt="2pPlay"/>
  <h3>3P play</h3>
  <img src="https://user-images.githubusercontent.com/76679207/208439492-f2bc30ae-dd7e-4e37-9423-029fd5fe49f0.gif" width="400" alt="3pPlay"/>
</div>

## Project Goal

Nostalgia about retro games, especially how we played it. We were at the same place, right next to each other, keeping our eyes on the game screen and also to the other players. Though family console games now take the role of those experiences, I wanted a web version of it for better accessibility.

레트로 게임의 플레이방식에 대한 그리움으로 히번 프로젝트를 진행해봤습니다. 같은 장소에서 서로 부대끼며 게임에 집중하되 상대방의 눈치도 봐야하는 그러한 플레이 경험을 만들어보고 싶었습니다. 지금은 가족용 콘솔 게임이 그런 경험을 이어오고 있지만, 접근성이 훨씬 좋은 웹버전으로 만들어보고자 했습니다.

## Using

socket.io, nodejs, express, pug, gsap

## Structure

<div align="center">
  <img src="https://user-images.githubusercontent.com/76679207/208455758-2b420638-8f15-4ce3-877c-b73382186857.PNG" width="600" alt="2pPlay"/>
</div>

$${\color{yellow}Yellow \color{black} \space is \space emitters}$$

$${\color{green}Green \color{black} \space is \space followers}$$

## Bugs not fixed

1. failed to disable mobile Safari's **pinch zoom**
<table >
  <tr>
    <td align="top">
      <img src="https://user-images.githubusercontent.com/76679207/208458915-3ce0daa3-4a0d-40e7-94b0-e2e0eb5d9056.gif" width="200" alt="3pPlay"/>
    </td>
    <td align="top">
      <img src="https://user-images.githubusercontent.com/76679207/208459192-c16ccda3-998c-4a69-b926-c17f38f566f1.gif" width="200" alt="3pPlay"/> 
    </td>
  </tr>
  <tr>
    <td align="center">chrome</td>
    <td align="center">safari</td>
  </tr>
</table>

**Trials tried**

```css
-webkit-user-select: none;
user-select: none;
-ms-touch-action: none;
-webkit-touch-callout: none;
```

```js
document.addEventListener(
  "touchstart",
  (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
      event.stopPropagation();
    }
  },
  { passive: false }
);

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
```

2. position lag
   <br/>caculated position by server → emit position if difference occurred → linear interpolation by client → rendered with _gsap_'s ease
   <br/>still finding way how to fix it

---

## Notes

- 서버비용으로 인해 사이트를 닫아뒀습니다
- 3P도 마찬가지의 이유로 인해 레포를 비공개했습니다
