// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  /** Unix timestamp (ms) when the JWT expires */
  tokenExpiration: number | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  tokenExpiration: null,
  isAuthenticated: false,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const hydrateFromStorage = (): Partial<AuthState> => {
  if (typeof window === "undefined") return {};
  try {
    const token = localStorage.getItem("ch_token");
    const expRaw = localStorage.getItem("ch_token_exp");
    const userRaw = localStorage.getItem("ch_user");

    if (!token || !expRaw || !userRaw) return {};

    const tokenExpiration = Number(expRaw);
    if (Date.now() > tokenExpiration) {
      // Token expired — clear storage
      localStorage.removeItem("ch_token");
      localStorage.removeItem("ch_token_exp");
      localStorage.removeItem("ch_user");
      return {};
    }

    return {
      token,
      tokenExpiration,
      user: JSON.parse(userRaw) as AuthUser,
      isAuthenticated: true,
    };
  } catch {
    return {};
  }
};

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: (): AuthState => ({
    ...initialState,
    ...hydrateFromStorage(),
  }),
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
        tokenExpiration: number;
      }>
    ) {
      const { user, token, tokenExpiration } = action.payload;
      state.user = user;
      state.token = token;
      state.tokenExpiration = tokenExpiration;
      state.isAuthenticated = true;

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("ch_token", token);
        localStorage.setItem("ch_token_exp", String(tokenExpiration));
        localStorage.setItem("ch_user", JSON.stringify(user));
      }
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.tokenExpiration = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("ch_token");
        localStorage.removeItem("ch_token_exp");
        localStorage.removeItem("ch_user");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectTokenExpiration = (state: { auth: AuthState }) => state.auth.tokenExpiration;