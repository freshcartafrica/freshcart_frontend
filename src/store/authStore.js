import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: '',
      user: null,
      onboardingRecords: {},
      setSession: ({ token, user }) => set({ token, user }),
      completeOnboarding: ({ user, data }) =>
        set((state) => ({
          onboardingRecords: {
            ...state.onboardingRecords,
            [user.id]: {
              role: user.role,
              completed: true,
              completedAt: new Date().toISOString(),
              data,
            },
          },
        })),
      resetOnboarding: (user) =>
        set((state) => ({
          onboardingRecords: {
            ...state.onboardingRecords,
            [user.id]: {
              role: user.role,
              completed: false,
              data: {},
            },
          },
        })),
      clearSession: () => set({ token: '', user: null }),
    }),
    { name: 'freshcart-auth' },
  ),
)
