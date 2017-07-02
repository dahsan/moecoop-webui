
export const baseURL = 'http://api.fukuro.coop.moe'

export function getCall(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    callback(xhr)
  }
  xhr.respenseType = 'json'
  xhr.open('GET', url, true)
  xhr.send()
}


export function postCall(url, param, callback) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    callback(xhr)
  }
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify(param))
}
