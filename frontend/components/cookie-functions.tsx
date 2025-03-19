import { toast } from "sonner";

export function setCookie(numDays) {
  const d = new Date();
  d.setTime(d.getTime() + (numDays * 24 * 60 * 60 * 1000))
  return d.toUTCString()
}

export function getCookie(cName) {
  let name = cName + "="
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ""
}

export function checkCookie() {
  let username = getCookie("id")
  if (username != "") {
    toast.success("Welcome again " + username)
  }
}
