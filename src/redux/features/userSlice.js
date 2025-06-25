import { createSlice, createAction } from "@reduxjs/toolkit"

// Tạo action để clear user data (sử dụng cho LogOut component)
export const clearUser = createAction("user/clearUser")

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  userRole: null,
  loginTime: null,
  customerID: null, // Thêm customerID vào state
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // Lưu thông tin đăng nhập của user vào state
      const userData = action.payload
      state.currentUser = userData
      state.isAuthenticated = true
      state.userRole = userData?.role || null
      state.loginTime = new Date().toISOString()
      state.customerID = userData?.customerID || null // Lưu customerID nếu có
    },
    logout: (state) => {
      // Xoá thông tin đăng nhập của user khỏi state
      state.currentUser = null
      state.isAuthenticated = false
      state.userRole = null
      state.loginTime = null
      state.customerID = null // Reset customerID
    },
    updateUser: (state, action) => {
      // Cập nhật thông tin user
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
        if (action.payload.customerID !== undefined) {
          state.customerID = action.payload.customerID
        }
      }
    },
    setUserRole: (state, action) => {
      // Cập nhật role của user
      state.userRole = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearUser, (state) => {
      // Xử lý action clearUser từ LogOut component
      state.currentUser = null
      state.isAuthenticated = false
      state.userRole = null
      state.loginTime = null
      state.customerID = null // Reset customerID
    })
  },
})

// Action creators are generated for each case reducer function
export const { login, logout, updateUser, setUserRole } = userSlice.actions

// Selectors để lấy data từ state
export const selectCurrentUser = (state) => state.user?.currentUser
export const selectIsAuthenticated = (state) => state.user?.isAuthenticated || false
export const selectUserRole = (state) => state.user?.userRole
export const selectLoginTime = (state) => state.user?.loginTime
export const selectCustomerID = (state) => state.user?.customerID // Selector lấy customerID

// ✅ THÊM MỚI: Selector cho fullName
export const selectUserFullName = (state) => {
  const user = state.user?.currentUser;
  if (!user) return "User";
  
  return user.fullName || user.username || "loclnx";
}

export default userSlice.reducer