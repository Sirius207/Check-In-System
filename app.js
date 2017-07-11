window.onload = init()
const flashText = document.querySelector('.flash-text')

function init() {
  if (!getData()) {
    console.log('no')
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

function getData() {
  let studentsData = localStorage.getItem('studentsData')
  if (!studentsData) return null
  studentsData = JSON.parse(studentsData)
  return studentsData
}

//
// Render students info
//
function renderCheckStudents() {
  const checkText = document.getElementById('check')
  const checkedText = document.getElementById('checked')
  const studentsData = getData()
  for (let ID in studentsData) {
    showCheckStudentData(ID, studentsData[ID])
  }
}

function showCheckStudentData(ID, data) {
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
  const list = document.querySelector('.list-item')
  if (!data.check) {
    list.innerHTML = dom + list.innerHTML
  } else {
    list.innerHTML += dom
  }
}

function showCurrentStudentData(ID, data) {
  if (data.check) {
    flashText.innerHTML = '已報到'
    return
  }
  const student = document.querySelector(`#${ID}`)
  student.querySelector('.check').innerHTML = `<button data-id=${ID} class="checkIn">Check</button>`
  const checkInButton = document.querySelector('.checkIn')
  checkInButton.addEventListener('click', checkIn)
  student.classList.remove('hide')
}

//
// Check In Process
//

document.search.addEventListener('submit', searchStudent)

function searchStudent(e) {
  e.preventDefault()
  const data = getData()
  const studentID = document.search.searchID.value
  if (data[studentID]) {
    showCurrentStudentData(studentID, data[studentID])
    flashText.innerHTML = ''
  } else {
    flashText.innerHTML = '查無此學號'
  }
}

function checkIn() {
  showNewBlock(this)
    .then(function (data) {
      saveData(data)
    }).then(function () {
      const audio = new Audio('checkIn.wav')
      audio.play()
    })
    .catch(function (err) {
      console.log(err)
    })
}

function showNewBlock(button) {
  return new Promise(function (resolve, reject) {
    const ID = button.dataset.id
    const data = getData()
    data[ID].check = 1
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

function play() {
  console.log(this.dataset.type)
  videoBlock.classList.add('active')
  videoBlock.children[0].style.display = 'block'
  videoBlock.children[0].play()
}
const hideButtons = document.querySelectorAll('.hide-button')
hideButtons.forEach((hideButton) => {
  hideButton.addEventListener('click', hide)
})

function hide() {
  videoBlock.children[0].style.display = 'none'
  videoBlock.children[0].pause()
  videoBlock.classList.remove('active')
}

//
// Reset Check in data
//

const resetBtn = document.querySelector('.reset')
resetBtn.addEventListener('click', reset)

function reset() {
  localStorage.removeItem('studentsData')
  window.location.reload()
}

//
// Show not check Students
//

const showBtn = document.querySelector('.show-button')
showBtn.addEventListener('click', showAllStudents)
function showAllStudents () {
  let students = document.querySelectorAll('.hide')
  if (!students.length) students = document.querySelectorAll('.temp-show')
  students.forEach( student => {
    student.classList.toggle('temp-show')
    student.classList.toggle('hide')
  })
  this.innerHTML = 'Hide'
}