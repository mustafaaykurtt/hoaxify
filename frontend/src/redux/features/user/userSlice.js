import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, setAuthorizationHeader, signup } from "../../../api/apiCalls";
import { clearLocalStorage, getLocalStorage, saveStateToLocalStorage } from "../../../utils/LocalStorage";

const initialState = {
    username: undefined,
    displayName: undefined,
    image: undefined,
    password: undefined,
    isLoggedIn: false,
    errors: {}
};

const hoax_auth = getLocalStorage();
let stateFromLocalStorage = initialState;
if (hoax_auth) {
    const { username, password, isLoggedIn } = hoax_auth;
    setAuthorizationHeader(username, password, isLoggedIn);
    stateFromLocalStorage = hoax_auth
}

export const loginHandler = createAsyncThunk('loginHandler', async (credentials, { rejectWithValue }) => {
    try {
        const response = await login(credentials);
        const authState = {
            ...response.data,
            password: credentials.password
        };
        return authState;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
}
);

export const signUpHandler = createAsyncThunk('signUpHandler', async (user, { rejectWithValue, dispatch }) => {
    try {
        const response = await signup(user);
        dispatch(loginHandler(user));
        return response;
    } catch (err) {
        return rejectWithValue(err.response.data.validationErrors);
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState: stateFromLocalStorage,
    reducers: {
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        onLogoutSuccess: () => {
            clearLocalStorage();
            setAuthorizationHeader(null, null, false);
            return { ...initialState }
        },
        updateSuccess: (state, {payload}) => {
            const userState = {
                ...state,
                ...payload,
            }
           saveStateToLocalStorage(userState);
        return userState;
        }

    }, extraReducers: (builder) => {
        builder.addCase(loginHandler.fulfilled, (state, action) => {
            const userState = {
                ...state,
                ...action.payload,
                isLoggedIn: true,
                errors: {}
            }
           saveStateToLocalStorage(userState);
            return userState;
        });
        builder.addCase(loginHandler.rejected, (state, action) => {
            state.errors = { message: action.payload.message }
        });
        builder.addCase(signUpHandler.rejected, (state, action) => {
            state.errors = action.payload;
        });
    }
})


export const { onLogoutSuccess, setErrors, updateSuccess } = userSlice.actions;
export default userSlice.reducer;

