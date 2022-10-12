/**
 * Emit socket message
 * @param {String} eName
 * @param {String} eVal
 */
function emitMessage(eName, eVal) {
  const socket = io();
  if (eVal !== undefined) {
    socket.emit(eName, eVal);
  }
}

/**
 * 선형 보간
 * @param {Number} a
 * @param {Number} b
 * @param {Number} n a와 b사이에서 n만큼 보간
 * @returns
 */
const lerp = (a, b, n) => parseFloat((1 - n) * a + n + b);

export { emitMessage, lerp };
