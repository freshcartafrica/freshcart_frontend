import { create } from 'zustand'

export const useUiStore = create((set) => ({
  checkoutOpen: false,
  openCheckout: () => set({ checkoutOpen: true }),
  closeCheckout: () => set({ checkoutOpen: false }),
}))
