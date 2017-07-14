window.onload = init()
function init () {
  if (!getData()) {
    console.log('init')
    fetchData()
    .then(renderCheckStudents)
  } else {
    console.log('get')
    renderCheckStudents()
  }
}

//
// Local Storage Process
//

function fetchData() {
  return new Promise(function (resolve, reject) {
    const dataUrl = 'students.json'
    axios.get(dataUrl)
      .then((rawData) => {
        resolve(saveData(rawData.data))
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function saveData(data) {
  return new Promise(function (resolve, reject) {
    console.log('save')
    localStorage.setItem('studentsData', JSON.stringify(data))
    resolve()
  })
}

function getData () {
  let studentsData = localStorage.getItem('studentsData')
  if (!studentsData) return null
  studentsData = JSON.parse(studentsData)
  return studentsData
}

//
// Render students info
//

function renderCheckStudents () {
  const studentsData = getData()
  for (let ID in studentsData) {
    showCheckStudentData(ID, studentsData[ID])
  }
  updateStatistics()
}

function showCheckStudentData (ID, data) {
  let dom = `
     <ul id="${ID}" class="${(data.check ? '' : 'hide')}">
      <li class="id">${ID}</li>
      <li class="name">${data.name}</li>
      <li class="size">${data.size}</li>
      <li class="size">${data.college}</li>
      <li class="check">${(data.checkTime)?data.checkTime:'Not Yet'}</li>
      <li class="animate">
        <button data-type=${data.college} class="play">Play</button>
      </li>
    </ul>
  `
  const checkText = document.getElementById('check')
  const checkedText = document.getElementById('checked')
  const list = document.querySelector('.list-item')
  if (!data.check) {
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
// Search Process
//

document.search.addEventListener('submit', searchStudent)

function searchStudent (e) {
  e.preventDefault()
  const data = getData()
  const studentID = document.search.searchID.value.toUpperCase()
  if (data[studentID]) {
    showCurrentStudentData(studentID, data[studentID])
  } else {
    const flashText = document.querySelector('.flash-text')
    flashText.innerText = '查無此學號'
  }
}

function showCurrentStudentData (ID, data) {
  const flashText = document.querySelector('.flash-text')
  if (data.check) {
    flashText.innerText = '此學員已報到'
  } else {
    flashText.innerText = ''
    const student = document.querySelector(`#${ID}`)
    student.querySelector('.check').innerHTML = `<button data-id=${ID} class="checkIn">Check</button>`
    const checkInButton = document.querySelector('.checkIn')
    checkInButton.addEventListener('click', checkIn)
    student.classList.remove('hide')
  }
}

//
// Check In Process
//

function checkIn () {
  const checkText = document.getElementById('check')
  const checkedText = document.getElementById('checked')
  showNewBlock(this)
    .then(function (data) {
      saveData(data)
    }).then(function () {
      const audio = new Audio('checkIn.wav')
      audio.play()
    }).then(function () {
      checkText.dataset.count--
      checkedText.dataset.count++
      checkText.innerText = `未報到：${checkText.dataset.count}`
      checkedText.innerText = `已報到：${checkedText.dataset.count}, `
    })
    .catch(function (err) {
      console.log(err)
    })
}

function showNewBlock (button) {
  return new Promise(function (resolve, reject) {
    const ID = button.dataset.id
    const data = getData()
    // data[ID].check = 1
    data[ID].checkTime = moment(Date.now()).utcOffset(8).format('MM/DD, h:mm a')
    button.parentNode.innerHTML = data[ID].checkTime
    resolve(data)
  })
}

//
// Play Animation
//

const playButtons = document.querySelectorAll('.play')
const videoBlock = document.querySelector('.animation')
playButtons.forEach((playButton) => {
  playButton.addEventListener('click', play)
})

function play () {
  const animationTable = {
    'apple': 'A',
    'orange': 'B'
  }
  console.log('play')
  videoBlock.classList.add('active')
  const video = document.getElementById(animationTable[this.dataset.type])
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
}

//
// Reset Check in data
//

const resetBtn = document.querySelector('.reset')
resetBtn.addEventListener('click', reset)

function reset () {
  localStorage.removeItem('studentsData')
  window.location.reload()
}

//
// Toggle not check Students
//

const showBtn = document.querySelector('.show-button')
showBtn.addEventListener('click', showAllStudents)
function showAllStudents () {
  let students = document.querySelectorAll('.hide')
  if (!students.length) {
    students = document.querySelectorAll('.temp-show')
    this.innerHTML = 'Show All'
  } else {
    this.innerHTML = 'Hide'
  }
  students.forEach(student => {
    student.classList.toggle('temp-show')
    student.classList.toggle('hide')
  })
}
