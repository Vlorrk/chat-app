const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("list");
const messageSound = document.getElementById("messageSound");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", (msg) => {
  const item = document.createElement("li");

  if (msg.sender === socket.id) {
    item.classList.add("shared", "sent-by-me");
  } else if (msg.sender === "server") {
    item.classList.add("sent-by-server");
  } else {
    item.classList.add("shared", "sent-by-others");
  }
  const messageText = msg.message;
  item.textContent = messageText;
  messages.appendChild(item);

  if (msg.sender != "server") {
    playMessageSounds();
  }
  //scroll to bottom after new message
  messages.scrollTop = messages.scrollHeight;
});

function playMessageSounds() {
  messageSound.volume = 0.1;
  messageSound.play();
}
