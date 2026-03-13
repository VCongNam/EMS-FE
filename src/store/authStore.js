import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (userData) => {
                // userData should include role: 'student' | 'teacher' | 'assistant'
                set({
                    user: userData,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },

            updateProfile: (updatedData) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedData } : null,
                }));
            },

            setRole: (role) => {
                set((state) => ({
                    user: state.user ? { ...state.user, role } : { id: 'dev-user', fullName: 'Dev User', role, email: 'dev@ems.com' },
                    isAuthenticated: true,
                }));
            },
        }),
        {
            name: 'ems-auth-storage', // name of the item in the storage (must be unique)
        }
    )
);

export default useAuthStore;
