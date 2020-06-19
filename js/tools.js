function createElement(name, classArr, styleObj) {
  var dom = document.createElement(name)

  for (let i = 0; i < classArr.length; i++) {
    var element = classArr[i];
    dom.classList.add(element)
  }
  for (let key in styleObj) {
    dom.style[key] = styleObj[key]
  }
  return dom
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, 0)
  const day = date.getDate().toString().padStart(2, 0)
  const hour = date.getHours().toString().padStart(2, 0)
  const second = date.getSeconds().toString().padStart(2, 0)
  const minute = date.getMinutes().toString().padStart(2, 0)
  return year + '.' + month + '.' + day + ' ' + hour + ':' + minute + ':' + second
}

function setLocalStorage (key, value) {
  if(value instanceof Object) {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

function getLocalStorage (key) {
  var value  = window.localStorage.getItem(key)
  if(value === null) {
    return value
  }
  if(value[0] == '{' || value[0] === "[") {
    value = JSON.parse(value)
  }
  return value
}