import { useAuth } from './useAuth'
import { useData } from './useData'
import { useUsers } from './useUsers'
import { useAnalysis } from './useAnalysis'

let _instance = null

export function useAppState() {
  if (!_instance) {
    const auth = useAuth()
    const data = useData(auth.currentUser)
    const users = useUsers(auth.authHeaders, auth.parseResponse, auth.messageFrom)
    const analysis = useAnalysis(auth.currentUser, data.selected)
    _instance = { auth, data, users, analysis }
  }
  return _instance
}
