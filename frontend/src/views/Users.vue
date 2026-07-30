<script setup>
import { onMounted } from 'vue'
import { useAppState } from '../composables/useAppState'

const { data, users } = useAppState()

const { usersList, usersLoading, showUserModal, editingUser, userForm, userSaving, userError, userNotice,
  userSearchQuery, userPage, userPerPage,
  filteredUsers, totalUserPages, paginatedUsers,
  loadUsers, openCreateUser, openEditUser, saveUser, deleteUser, unlockUser,
  showLogModal, logUser, loginLogs, logLoading, openLogModal } = users

const { error } = data

onMounted(() => { loadUsers() })
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Pengaturan</p>
        <h1 class="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Manage Users</h1>
        <p class="mt-2 text-slate-600 dark:text-slate-400">Kelola akun pengguna sistem.</p>
      </div>
      <button @click="openCreateUser" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition">+ Tambah User</button>
    </div>

    <div v-if="error" class="mb-5 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 p-4 text-red-700 dark:text-red-300">{{ error }}</div>

    <section class="overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-5">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Daftar Users</h2>
        <div class="flex items-center gap-3">
          <input v-model="userSearchQuery" @input="userPage = 1" type="text" placeholder="Cari user..."
            class="w-48 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          <button class="rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-2 text-sm font-semibold" @click="userSearchQuery = ''; userPage = 1; loadUsers()">Muat ulang</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <tr>
              <th class="whitespace-nowrap px-4 py-3">Nama</th>
              <th class="whitespace-nowrap px-4 py-3">Email</th>
              <th class="whitespace-nowrap px-4 py-3">Role</th>
              <th class="whitespace-nowrap px-4 py-3 text-center">Percobaan</th>
              <th class="whitespace-nowrap px-4 py-3">Status</th>
              <th class="whitespace-nowrap px-4 py-3">Dibuat</th>
              <th class="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="usersLoading"><td colspan="7" class="p-6 text-center text-slate-500 dark:text-slate-400">Memuat data...</td></tr>
            <tr v-else-if="!paginatedUsers.length"><td colspan="7" class="p-6 text-center text-slate-500 dark:text-slate-400">{{ userSearchQuery ? 'User tidak ditemukan.' : 'Belum ada user.' }}</td></tr>
            <tr v-for="user in paginatedUsers" :key="user.id" class="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <td class="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{{ user.name }}</td>
              <td class="px-4 py-3 text-slate-600 dark:text-slate-400">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="user.role === 'superadmin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : user.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-mono text-sm">{{ user.login_attempts || 0 }}</td>
              <td class="px-4 py-3">
                <span v-if="user.locked_until && new Date(user.locked_until) > new Date()" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">Terkunci</span>
                <span v-else class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">Aktif</span>
              </td>
              <td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{{ new Date(user.created_at).toLocaleDateString('id-ID') }}</td>
              <td class="whitespace-nowrap px-4 py-3">
                <button v-if="user.locked_until && new Date(user.locked_until) > new Date()" class="mr-2 font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400" @click="unlockUser(user)">Buka</button>
                <button class="mr-2 font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400" @click="openLogModal(user)">Log</button>
                <button class="mr-2 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400" @click="openEditUser(user)">Ubah</button>
                <button v-if="user.role !== 'superadmin'" class="font-semibold text-red-600 hover:text-red-700 dark:text-red-400" @click="deleteUser(user)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-3">
        <span class="text-xs text-slate-500 dark:text-slate-400">Menampilkan {{ paginatedUsers.length }} dari {{ filteredUsers.length }} user</span>
        <div class="flex items-center gap-1">
          <button :disabled="userPage <= 1" @click="userPage--"
            class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40">&laquo;</button>
          <template v-for="p in totalUserPages" :key="p">
            <button v-if="p === userPage" class="rounded bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">{{ p }}</button>
            <button v-else-if="Math.abs(p - userPage) <= 2 || p === 1 || p === totalUserPages" @click="userPage = p"
              class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">{{ p }}</button>
            <span v-else-if="Math.abs(p - userPage) === 3" class="px-1 text-xs text-slate-400 dark:text-slate-500">...</span>
          </template>
          <button :disabled="userPage >= totalUserPages" @click="userPage++"
            class="rounded px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40">&raquo;</button>
        </div>
      </div>
    </section>

    <!-- LOGIN LOG MODAL -->
    <div v-if="showLogModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showLogModal = false">
      <div class="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Riwayat Login</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400" v-if="logUser">{{ logUser.name }} ({{ logUser.email }})</p>
          </div>
          <button @click="showLogModal = false" class="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300">&times;</button>
        </div>
        <div class="max-h-96 overflow-y-auto px-6 py-4">
          <div v-if="logLoading" class="py-8 text-center text-slate-500 dark:text-slate-400">Memuat log...</div>
          <div v-else-if="!loginLogs.length" class="py-8 text-center text-slate-500 dark:text-slate-400">Belum ada riwayat login.</div>
          <div v-else class="space-y-3">
            <div v-for="log in loginLogs" :key="log.id" class="flex items-start gap-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 p-4">
              <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ new Date(log.logged_in_at).toLocaleString('id-ID', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }) }}</p>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">{{ log.user_agent || '-' }}</p>
                <p class="text-xs text-slate-400 dark:text-slate-500">IP: {{ log.ip_address || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end border-t border-slate-200 dark:border-slate-700 px-6 py-4">
          <button @click="showLogModal = false" class="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">Tutup</button>
        </div>
      </div>
    </div>

    <!-- USER MODAL -->
    <div v-if="showUserModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showUserModal = false">
      <div class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl">
        <h2 class="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">{{ editingUser ? 'Ubah User' : 'Tambah User Baru' }}</h2>
        <div v-if="userError" class="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-300">{{ userError }}</div>
        <div v-if="userNotice" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 p-3 text-sm text-emerald-700 dark:text-emerald-300">{{ userNotice }}</div>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama</label>
            <input v-model="userForm.name" type="text" required class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input v-model="userForm.email" type="email" required class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ editingUser ? 'Password (kosongkan jika tidak diubah)' : 'Password' }}</label>
            <input v-model="userForm.password" type="password" :required="!editingUser" class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
            <select v-model="userForm.role" class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div class="flex gap-3 pt-2">
            <button :disabled="userSaving" type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
              {{ userSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button type="button" class="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 font-semibold text-slate-700 dark:text-slate-300" @click="showUserModal = false">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
