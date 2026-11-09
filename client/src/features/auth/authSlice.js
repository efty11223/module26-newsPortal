import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    setUser(state, action) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
      state.token = null
    },
  },
})

export const { clearUser, setCredentials, setUser } = authSlice.actions
export default authSlice.reducer
