import { reactive, ref } from 'vue'

const token = ref(localStorage.getItem('token') || '')
const currentUser = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const loginForm = reactive({ email: '', password: '' })
const loginError = ref('')
const loginLoading = ref(false)
const showForgotPassword = ref(false)
const forgotForm = reactive({ email: '' })
const forgotLoading = ref(false)
const forgotMessage = ref('')
const forgotError = ref('')
const resetFormState = reactive({ token: '', password: '', confirmPassword: '' })
const resetLoading = ref(false)
const resetMessage = ref('')
const resetError = ref('')

function authHeaders() {
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

function setAuth(tokenVal, userVal) {
  token.value = tokenVal
  currentUser.value = userVal
  localStorage.setItem('token', tokenVal)
  localStorage.setItem('user', JSON.stringify(userVal))
}

function logout(currentPage, selected) {
  Swal.fire({
    title: 'Keluar?',
    text: 'Anda akan logout dari sistem.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6366f1',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, keluar',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      token.value = ''
      currentUser.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      currentPage.value = 'landing'
      loginForm.email = ''
      loginForm.password = ''
      selected.value = 'korban'
      Swal.fire({ title: 'Berhasil!', text: 'Anda telah logout.', icon: 'success', timer: 1500, showConfirmButton: false })
    }
  })
}

async function parseResponse(response) {
  const text = await response.text()
  if (!text) return {}
  try { return JSON.parse(text) } catch { return { message: `Server mengirim respons tidak valid (${response.status}).` } }
}

function messageFrom(response, fallback) {
  return response?.message || fallback
}

async function login(visibleResources, currentPage, selected) {
  loginLoading.value = true
  loginError.value = ''
  try {
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginForm.email, password: loginForm.password })
    })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(data.error || 'Login gagal')
    setAuth(data.token, data.user)
    const firstKey = Object.keys(visibleResources.value)[0] || 'korban'
    selected.value = firstKey
    currentPage.value = 'dashboard'
  } catch (err) {
    loginError.value = err.message
  } finally {
    loginLoading.value = false
  }
}

async function forgotPassword() {
  forgotLoading.value = true
  forgotError.value = ''
  forgotMessage.value = ''
  try {
    const response = await fetch('/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotForm.email })
    })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(data.error || 'Gagal mengirim token')
    forgotMessage.value = `Token reset: ${data.resetToken}`
  } catch (err) {
    forgotError.value = err.message
  } finally {
    forgotLoading.value = false
  }
}

async function resetPassword() {
  resetLoading.value = true
  resetError.value = ''
  resetMessage.value = ''
  try {
    if (resetFormState.password !== resetFormState.confirmPassword) throw new Error('Password tidak cocok')
    const response = await fetch('/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetFormState.token, password: resetFormState.password })
    })
    const data = await parseResponse(response)
    if (!response.ok) throw new Error(data.error || 'Gagal reset password')
    resetMessage.value = 'Password berhasil direset. Silakan login.'
    setTimeout(() => { showForgotPassword.value = false }, 2000)
  } catch (err) {
    resetError.value = err.message
  } finally {
    resetLoading.value = false
  }
}

export function useAuth() {
  return {
    token, currentUser,
    loginForm, loginError, loginLoading,
    showForgotPassword, forgotForm, forgotLoading, forgotMessage, forgotError,
    resetFormState, resetLoading, resetMessage, resetError,
    authHeaders, setAuth, logout, login, forgotPassword, resetPassword,
    parseResponse, messageFrom
  }
}
