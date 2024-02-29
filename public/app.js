const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('list');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('chat message', { message: input.value });
    input.value = '';

  }
})


socket.on('chat message', (msg) => {
  const item = document.createElement('li');


  if (msg.sender === socket.id) {
    item.classList.add('sent-by-me')
  }
  else {
    item.classList.add('sent-by-others')
  }
  const messageText = msg.message.message;
  item.textContent = messageText;
  messages.appendChild(item);

  //scroll to bottom after new message
  messages.scrollTop = messages.scrollHeight;
})
