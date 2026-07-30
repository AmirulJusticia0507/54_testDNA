import { reactive, ref, computed } from 'vue'

export function useUsers(authHeaders, parseResponse, messageFrom) {
  const usersList = ref([])
  const usersLoading = ref(false)
  const showUserModal = ref(false)
  const editingUser = ref(null)
  const userForm = reactive({ name: '', email: '', password: '', role: 'user' })
  const userSaving = ref(false)
  const userError = ref('')
  const userNotice = ref('')

  const userSearchQuery = ref('')
  const userPage = ref(1)
  const userPerPage = ref(10)

  const filteredUsers = computed(() => {
    const q = userSearchQuery.value.toLowerCase().trim()
    if (!q) return usersList.value
    return usersList.value.filter(u =>
      [u.name, u.email, u.role, String(u.login_attempts || 0), u.locked_until ? 'terkunci' : 'aktif'].some(v => String(v).toLowerCase().includes(q))
    )
  })
  const totalUserPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / userPerPage.value)))
  const paginatedUsers = computed(() => {
    const start = (userPage.value - 1) * userPerPage.value
    return filteredUsers.value.slice(start, start + userPerPage.value)
  })

  async function loadUsers() {
    usersLoading.value = true
    try {
      const response = await fetch('/users', { headers: authHeaders() })
      const data = await parseResponse(response)
      if (!response.ok) throw new Error(messageFrom(data, 'Gagal mengambil data user.'))
      usersList.value = data
    } catch (err) {
      userError.value = err.message
    } finally {
      usersLoading.value = false
    }
  }

  function openCreateUser() {
    editingUser.value = null
    userForm.name = ''
    userForm.email = ''
    userForm.password = ''
    userForm.role = 'user'
    userError.value = ''
    userNotice.value = ''
    showUserModal.value = true
  }

  function openEditUser(user) {
    editingUser.value = user
    userForm.name = user.name
    userForm.email = user.email
    userForm.password = ''
    userForm.role = user.role
    userError.value = ''
    userNotice.value = ''
    showUserModal.value = true
  }

  async function saveUser() {
    userSaving.value = true
    userError.value = ''
    userNotice.value = ''
    try {
      const payload = { name: userForm.name, email: userForm.email, role: userForm.role }
      if (userForm.password) payload.password = userForm.password
      const url = editingUser.value ? `/users/${editingUser.value.id}` : '/users/signup'
      const method = editingUser.value ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload)
      })
      const data = await parseResponse(response)
      if (!response.ok) throw new Error(data.error || 'Gagal menyimpan user.')
      userNotice.value = editingUser.value ? 'User berhasil diperbarui.' : 'User berhasil dibuat.'
      await loadUsers()
      setTimeout(() => { showUserModal.value = false }, 1000)
    } catch (err) {
      userError.value = err.message
    } finally {
      userSaving.value = false
    }
  }

  async function deleteUser(user) {
    if (!window.confirm(`Hapus user ${user.name}?`)) return
    try {
      const response = await fetch(`/users/${user.id}`, { method: 'DELETE', headers: authHeaders() })
      const data = await parseResponse(response)
      if (!response.ok) throw new Error(data.error || 'Gagal menghapus user.')
      await loadUsers()
    } catch (err) {
      userError.value = err.message
    }
  }

  const showLogModal = ref(false)
  const logUser = ref(null)
  const loginLogs = ref([])
  const logLoading = ref(false)

  async function openLogModal(user) {
    logUser.value = user
    showLogModal.value = true
    logLoading.value = true
    try {
      const response = await fetch(`/users/logs/${user.id}`, { headers: authHeaders() })
      const data = await parseResponse(response)
      if (!response.ok) throw new Error(data.error || 'Gagal mengambil log.')
      loginLogs.value = data
    } catch (err) {
      userError.value = err.message
      loginLogs.value = []
    } finally {
      logLoading.value = false
    }
  }

  async function unlockUser(user) {
    try {
      const response = await fetch(`/users/unlock/${user.id}`, { method: 'POST', headers: authHeaders() })
      const data = await parseResponse(response)
      if (!response.ok) throw new Error(data.error || 'Gagal membuka akun.')
      await loadUsers()
    } catch (err) {
      userError.value = err.message
    }
  }

  return {
    usersList, usersLoading, showUserModal, editingUser, userForm, userSaving, userError, userNotice,
    userSearchQuery, userPage, userPerPage,
    filteredUsers, totalUserPages, paginatedUsers,
    loadUsers, openCreateUser, openEditUser, saveUser, deleteUser, unlockUser,
    showLogModal, logUser, loginLogs, logLoading, openLogModal
  }
}
