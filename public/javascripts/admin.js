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
  console.log(user)
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