const requestsCount =  localStorage.getItem('requests')
const userid = localStorage.getItem('user')

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}


hideLoading();

document.addEventListener('DOMContentLoaded', async () => {
    showLoading()
    await requestsCount
    await userid
    hideLoading()
    document.getElementById('requests').innerText = `Total requests: ${requestsCount}`
    document.getElementById('userid').innerText = `UserId: ${userid}`
})

document.getElementById('refresh').addEventListener('click', function () {
    window.location.replace('index.html')
});