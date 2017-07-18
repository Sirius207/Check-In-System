window.onload = init()

function init () {
  console.log('init')
  fetchData()
    .then(function () {
      updateStatistics()
    })
    .catch(function (err) {
      console.log(err)
    })
}

function fetchData () {
  return new Promise(function (resolve, reject) {
    const dataUrl = '/apis/user'
    axios.get(dataUrl)
      .then((rawData) => {
        resolve(renderStudents(rawData.data.users))
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function renderStudents (users) {
  users.forEach(function (user) {
    checkStatistics(user)
  })
}

function checkStatistics (user) {
  let dom = `
     <ul id="${user.user_id}" class=${user.condition ? '' : 'temp-show'}>
      <li class="id">${user.user_id}</li>
      <li class="name">${user.name}</li>
      <li class="size">${user.size}</li>
      <li class="size">${user.college}</li>
      <li class="check">${(user.condition) ? user.checkedTime : 'Not Yet'}</li>
      <li class="animate">
        <button data-type=${user.college} class="play">Play</button>
      </li>
    </ul>
  `
  const checkText = document.getElementById('check')
  const checkedText = document.getElementById('checked')
  const list = document.querySelector('.list-item')
  if (!user.condition) {
    list.innerHTML = dom + list.innerHTML
    checkText.dataset.count++
  } else {
    list.innerHTML += dom
    checkedText.dataset.count++
  }
}

function updateStatistics () {
  const checkText = document.getElementById('check')
  const checkedText = document.getElementById('checked')
  checkText.innerText = `未報到：${checkText.dataset.count}`
  checkedText.innerText = `已報到：${checkedText.dataset.count}, `
}

//
// Play Animation
//

document.querySelector('.list-item').addEventListener('click', function (e) {
  if (e.target && e.target.className === 'play') {
    play(e.target)
  }
})

const videoBlock = document.querySelector('.animation')
function play (button) {
  const animationTable = {
    '米斯提爾': 'A',
    '奧莉薇雅': 'B',
    '梅里雷特': 'A',
    '噩斯邦迪': 'B'
  }
  console.log('play')
  videoBlock.classList.add('active')
  const video = document.getElementById(animationTable[button.dataset.type])
  video.style.display = 'block'
  video.classList.add('playing')
  video.play()
}

//
// hide screen
//

const hideButtons = document.querySelectorAll('.hide-button')
hideButtons.forEach((hideButton) => {
  hideButton.addEventListener('click', hide)
})

function hide () {
  const video = document.querySelector('.playing')
  video.style.display = 'none'
  video.classList.remove('playing')
  video.pause()
  videoBlock.classList.remove('active')
  document.querySelector('.current').classList.add('hide')
  document.querySelector('.current').classList.remove('current')
}

// reset
const reset = document.querySelector('.reset')
reset.addEventListener('click', function () {
  const dataUrl = `/apis/reset`
  axios.put(dataUrl).then(function(){
    history.go(0)
  })
})