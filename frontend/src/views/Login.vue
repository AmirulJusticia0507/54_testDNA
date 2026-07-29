<script setup>
import { useRouter } from 'vue-router'
import { useAppState } from '../composables/useAppState'

const router = useRouter()
const { auth, data } = useAppState()

const { loginForm, loginError, loginLoading, showForgotPassword,
  forgotForm, forgotLoading, forgotMessage, forgotError,
  resetFormState, resetLoading, resetMessage, resetError,
  login, forgotPassword, resetPassword } = auth

const { visibleResources } = data

async function doLogin() {
  await login(visibleResources, { value: 'dashboard' }, { value: 'korban' })
  if (!loginError.value) {
    Swal.fire({ icon: 'success', title: 'Login berhasil!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false, timerProgressBar: true })
    setTimeout(() => router.push({ name: 'dashboard' }), 1200)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-white mb-4">
          <path d="M12 8C12 8 16 16 16 20C16 24 12 32 12 32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M28 8C28 8 24 16 24 20C24 24 28 32 28 32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M12 20H28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M14 14H26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
          <path d="M14 26H26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
          <circle cx="12" cy="8" r="3" fill="currentColor"/><circle cx="28" cy="8" r="3" fill="currentColor"/>
          <circle cx="12" cy="32" r="3" fill="currentColor"/><circle cx="28" cy="32" r="3" fill="currentColor"/>
          <circle cx="12" cy="20" r="2.5" fill="currentColor" opacity="0.7"/>
          <circle cx="28" cy="20" r="2.5" fill="currentColor" opacity="0.7"/>
        </svg>
        <h1 class="text-3xl font-bold text-white">DNA Analysis</h1>
        <p class="text-indigo-200 mt-2">Sistem manajemen data genetik</p>
      </div>

      <div v-if="!showForgotPassword" class="rounded-2xl bg-white p-8 shadow-2xl">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Masuk ke akun Anda</h2>
        <div v-if="loginError" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ loginError }}</div>
        <form @submit.prevent="doLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input v-model="loginForm.email" type="email" required placeholder="admin@dna.com"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input v-model="loginForm.password" type="password" required placeholder="Masukkan password"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <button :disabled="loginLoading" type="submit"
            class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60">
            {{ loginLoading ? 'Masuk...' : 'Masuk' }}
          </button>
        </form>
        <div class="mt-4 flex items-center justify-between">
          <button @click="showForgotPassword = true" class="text-sm text-indigo-600 hover:underline">Lupa password?</button>
          <button @click="router.push({ name: 'landing' })" class="text-sm text-slate-500 hover:underline">&larr; Kembali</button>
        </div>
      </div>

      <!-- FORGOT PASSWORD -->
      <div v-else class="rounded-2xl bg-white p-8 shadow-2xl">
        <h2 class="text-xl font-bold text-slate-900 mb-2">Lupa Password</h2>
        <p class="text-sm text-slate-500 mb-6">Masukkan email untuk mendapatkan token reset password</p>
        <div v-if="forgotError" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ forgotError }}</div>
        <div v-if="forgotMessage" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 break-all">{{ forgotMessage }}</div>
        <form @submit.prevent="forgotPassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input v-model="forgotForm.email" type="email" required placeholder="admin@dna.com"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <button :disabled="forgotLoading" type="submit"
            class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60">
            {{ forgotLoading ? 'Mengirim...' : 'Kirim Token Reset' }}
          </button>
        </form>

        <div class="mt-6 border-t pt-4">
          <h3 class="text-sm font-semibold text-slate-700 mb-3">Reset Password dengan Token</h3>
          <div v-if="resetError" class="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ resetError }}</div>
          <div v-if="resetMessage" class="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{{ resetMessage }}</div>
          <form @submit.prevent="resetPassword" class="space-y-3">
            <input v-model="resetFormState.token" type="text" required placeholder="Token reset"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm" />
            <input v-model="resetFormState.password" type="password" required placeholder="Password baru"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm" />
            <input v-model="resetFormState.confirmPassword" type="password" required placeholder="Konfirmasi password baru"
              class="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm" />
            <button :disabled="resetLoading" type="submit"
              class="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60 text-sm">
              {{ resetLoading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </form>
        </div>

        <div class="mt-4 text-center">
          <button @click="showForgotPassword = false" class="text-sm text-indigo-600 hover:underline">Kembali ke login</button>
        </div>
      </div>
    </div>
  </div>
</template>
