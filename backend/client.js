function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

async function checkIp() {
    try {
        showLoading();
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
            const data = await response.json();
            hideLoading();
            return data;
        } else {
            throw new Error('Failed to fetch IP');
        }
    } catch (error) {
        console.error('Error:', error.message);
        hideLoading();
        return null;
    }
}

hideLoading();

let requestsCount = localStorage.getItem('requests') ? parseInt(localStorage.getItem('requests')) : 0;

document.getElementById('api-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    requestsCount += 1;
    localStorage.setItem('requests', requestsCount);
    
    showLoading();

    const method = document.getElementById('method').value;
    const url = document.getElementById('url').value;
    const headers = document.getElementById('headers').value;
    const body = document.getElementById('body').value;

    const options = {
        method: method,
        headers: headers ? JSON.parse(headers) : {},
        body: method !== 'GET' && method !== 'HEAD' ? body : undefined
    };

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();
        const responseElement = document.getElementById('response');
        responseElement.style.display = 'flex';
        responseElement.textContent = JSON.stringify(responseData, null, 2);
    } catch (error) {
        document.getElementById('response').textContent = `Error: ${error.message}`;
    } finally {
        hideLoading();
    }
});

function generateUser() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let userId = '';
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        userId += characters[randomIndex];
    }
    localStorage.setItem('user', userId);
}

document.getElementById('refresh').addEventListener('click', function () {
    window.location.reload();
});

document.getElementById('requestsbtn').addEventListener('click', function () {
    document.getElementById('requests').style.display = 'block';
    document.getElementById('ip-look').style.display = 'none';
});

document.getElementById('iplookbtn').addEventListener('click', function () {
    document.getElementById('requests').style.display = 'none';
    document.getElementById('ip-look').style.display = 'block';
    Swal.fire({
        title: 'Wait!',
        text: 'Our application uses an external API to check IP: https://www.ipify.org We do not save your IP address or any other data!',
        icon: 'warning',
        confirmButtonText: 'OK'
    });
});

document.getElementById('checkip').addEventListener('click', async function () {
    const reselem = document.getElementById('ipresponse');
    const ipData = await checkIp();
    reselem.style.display = 'flex';
    reselem.textContent = ipData.ip;
});

document.getElementById('infobtn').addEventListener('click', function () {
    window.location.replace('info.html');
});


document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('user')) {
        return;
    } else {
        await generateUser();
        Swal.fire({
            title: 'User',
            text: `We have generated a new Archeus ID, now you can check your statistics in the info tab :) Your Archeus ID: ${localStorage.getItem('user')}`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
});
