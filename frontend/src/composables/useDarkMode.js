import { ref } from 'vue'

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

function setCookie(name, value) {
  document.cookie = `${name}=${value};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`
}

const isDark = ref(false)

function init() {
  const saved = getCookie('darkMode')
  if (saved === '1') isDark.value = true
  else if (saved === '0') isDark.value = false
  else isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', isDark.value)
}

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  setCookie('darkMode', isDark.value ? '1' : '0')
}

init()

export function useDarkMode() {
  return { isDark, toggleDark }
}
