window.onload = init()

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

function renderCheckStudents() {
  const studentsData = getData()
  for (let ID in studentsData) {
    showCheckStudentData(ID, studentsData[ID])
  }
}

const flashText = document.querySelector('.flash-text')
document.search.addEventListener('submit', searchStudent)

function searchStudent(e) {
  e.preventDefault()
  const data = getData()
  const studentID = document.search.searchID.value
  if (data[studentID]) {
    showCurrentStudentData(studentID, data[studentID])
    flashText.innerHTML = ''
  } else {
    flashText.innerHTML = 'Not found'
  }
}

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

function showCheckStudentData (ID, data) {
  let dom = `
     <ul id="${ID}" class="${(data.check ? '' : 'hide')}">
     <li class="id">${ID}</li>
     <li class="name">${data.name}</li>
     <li class="size">${data.size}</li>
     <li class="size">${data.college}</li>
     <li class="check">${data.checkTime}</li>
     <li class="animate">
       <button data-type=${data.college} class="play">Play</button>
     </li>
</ul>
`
  const list = document.querySelectorAll('.list-item')
  if (!data.check) {
    list[1].innerHTML = dom + list[1].innerHTML
  } else {
    list[1].innerHTML += dom
  }
}

function showCurrentStudentData (ID, data) {
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

function checkIn () {
  showNewBlock(this)
  .then(function(data){
    saveData(data)
  }).then(function() {
    const audio = new Audio('checkIn.wav')
    audio.play()
  })
  .catch(function(err){
    console.log(err)
  })
}

function showNewBlock (button) {
  return new Promise (function (resolve, reject) {
    const ID = button.dataset.id
    const data = getData()
    data[ID].check = 1
    data[ID].checkTime = moment(Date.now()).utcOffset(8).format('MM-DD, h:mm a')
    button.parentNode.innerHTML = data[ID].checkTime
    resolve(data)
  })
}

const playButtons = document.querySelectorAll('.play')

playButtons.forEach((playButton) => {
  playButton.addEventListener('click', play)
})

function play() {
  console.log(this.dataset.type)
}