const socket = new WebSocket('ws://localhost:8080');
let isOpened = false;

export async function getSocket() {
  if (isOpened) {
    return socket;
  }
  await new Promise((resolve) => {
    socket.addEventListener('open', () => {
      isOpened = true;
      resolve(true);
    });
  });
  return socket;
}
