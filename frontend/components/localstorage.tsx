export function getToken() {
  return localStorage.getItem('token')
}
export function setToken(token: string) {
  localStorage.setItem('token', token)
}

//Use the decrypt route to decrypt token
