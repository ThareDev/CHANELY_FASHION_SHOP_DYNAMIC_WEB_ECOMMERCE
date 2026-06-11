import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = { items: [], isOpen: false };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<{ id: string; size: string }>) {
      state.items = state.items.filter(
        i => !(i.id === action.payload.id && i.size === action.payload.size)
      );
    },
    updateQuantity(state, action: PayloadAction<{ id: string; size: string; quantity: number }>) {
      const item = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      );
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart(state) { state.items = []; },
    openCart(state)  { state.isOpen = true; },
    closeCart(state) { state.isOpen = false; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems   = (s: { cart: CartState }) => s.cart.items;
export const selectCartOpen    = (s: { cart: CartState }) => s.cart.isOpen;
export const selectCartTotal   = (s: { cart: CartState }) =>
  s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount   = (s: { cart: CartState }) =>
  s.cart.items.reduce((sum, i) => sum + i.quantity, 0);