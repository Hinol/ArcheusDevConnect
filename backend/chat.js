function showLoading() {
  document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
  const socket = await new io('http://localhost:3000');
  showLoading();
  const chatInput = document.getElementById('chatInput');
  const sendMsgBtn = document.getElementById('sendMsgBtn');
  const container = document.getElementById('container');
  const userId = localStorage.getItem('user');
  const homeBtn = document.getElementById('home');
  socket.emit('status');
  
  socket.on('status', (status) => {
    if (status) {
      socket.emit('getMessages', userId);
    } else {
      Swal.fire({
        title: 'Error',
        text: 'We are having some problems with the chat. Please try again later',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
  
  hideLoading();
  
  socket.on('messages', (messages) => {
    messages.forEach((message) => {
      const newMsg = container.cloneNode(true);
      newMsg.innerHTML = `
        <h1>${message.userId}</h1>
        <p>${message.message}</p>
        <span class="timeRight">${message.timestamp}</span>
      `;
      newMsg.style.display = 'block'; 
      container.parentNode.appendChild(newMsg);
    });
    Swal.fire({
      title: 'Chat',
      text: 'Hello, welcome to Archeus DevChat in this place you can talk with other devs about your code. If you want to send code write ``` before the code',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  });
  
  sendMsgBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message !== "") {
      let formattedMessage = message;
      if (message.startsWith('```')) {
        formattedMessage = `<code>${message.substring(3)}</code>`;
      }
  
      const data = {
        userId: userId,
        message: formattedMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      socket.emit('message', data);
      chatInput.value = "";
  
      const newMsg = container.cloneNode(true);
      newMsg.innerHTML = `
        <h1>${data.userId}</h1>
        <p>${data.message}</p>
        <span class="timeRight">${data.timestamp}</span>
      `;
      newMsg.style.display = 'block'; 
      container.parentNode.appendChild(newMsg);
    }
  });
  
  homeBtn.addEventListener('click', () => {
    window.location.replace('index.html');
  });
  
  socket.on('message', (data) => {
    let formattedMessage = data.message;
    if (data.message.startsWith('```')) {
      formattedMessage = `<code>${data.message.substring(3)}</code>`;
    }
    
    const newMsg = container.cloneNode(true);
    newMsg.innerHTML = `
      <h1>${data.userId}</h1>
      <p>${formattedMessage}</p>
      <span class="timeRight">${data.timestamp}</span>
    `;
    newMsg.style.display = 'block'; 
    container.parentNode.appendChild(newMsg);
  });
});
