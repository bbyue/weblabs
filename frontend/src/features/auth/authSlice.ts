import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'  
import axios from 'axios'

interface AuthState {
    user: null | { id: string; name: string; email: string }
    isAuthenticated: boolean  // Оригинал: iAuthenticated
    isLoading: boolean
    isError: boolean
    errorMessage: string | null
}

const initialState: AuthState = {  
    user: null,
    isAuthenticated: false,  
    isLoading: false,
    isError: false,
    errorMessage: null,
}

export const loginUser = createAsyncThunk(  
    'auth/login',
    async (credentials: { email: string; password: string }) => {  
        const response = await axios.post('/api/login', credentials)
        return response.data
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {  
            state.user = null
            state.isAuthenticated = false  
        },
    },
    extraReducers: (builder) => {  
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.errorMessage = null  
            })
            .addCase(loginUser.fulfilled, (state, action) => {  
                state.user = action.payload
                state.isLoading = false
                state.isAuthenticated = true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.errorMessage = action.error.message || 'Ошибка входа' 
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer