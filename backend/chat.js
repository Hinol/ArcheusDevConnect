function showLoading() {
  document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
  const socket = await new io('http://localhost:3000');
  showLoading()
  const chatInput = document.getElementById('chatinput');
  const sendMsgBtn = document.getElementById('sendmsgbtn');
  const container = document.getElementById('container');
  const userId = localStorage.getItem('user');
  const homeBtn = document.getElementById('home')
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
  hideLoading()
  socket.on('messages', (messages) => {
    messages.forEach((message) => {
      const newmsg = container.cloneNode(true);
      newmsg.innerHTML = `
        <h1>${message.userId}</h1>
        <p>${message.message}</p>
        <span class="time-right">${message.timestamp}</span>
      `;
      newmsg.style.display = 'block'; 
      container.parentNode.appendChild(newmsg);
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
  
      const newmsg = container.cloneNode(true);
      newmsg.innerHTML = `
        <h1>${data.userId}</h1>
        <p>${data.message}</p>
        <span class="time-right">${data.timestamp}</span>
      `;
      newmsg.style.display = 'block'; 
      container.parentNode.appendChild(newmsg);
    }
  });
  homeBtn.addEventListener('click', () => {
    window.location.replace('index.html')
  })
  
  socket.on('message', (data) => {
    let formattedMessage = data.message;
    if (data.message.startsWith('```')) {
      formattedMessage = `<code>${data.message.substring(3)}</code>`;
    }
    
    const newmsg = container.cloneNode(true);
    newmsg.innerHTML = `
      <h1>${data.userId}</h1>
      <p>${formattedMessage}</p>
      <span class="time-right">${data.timestamp}</span>
    `;
    newmsg.style.display = 'block'; 
    container.parentNode.appendChild(newmsg);
  });
});