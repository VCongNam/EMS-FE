import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (loginResponse) => {
                try {
                    const token = loginResponse.token;
                    if (token) {
                        const decoded = jwtDecode(token);
                        const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                        let role = "student";
                        if (rawRole === "Teacher") role = "teacher";
                        else if (rawRole === "TA" || rawRole === "Assistant") role = "TA";
                        
                        const userData = {
                            id: loginResponse.accountId,
                            email: loginResponse.email,
                            fullName: loginResponse.fullName,
                            role: role,
                            token: token
                        };

                        set({
                            user: userData,
                            isAuthenticated: true,
                        });
                    } else {
                        // fallback for old standard logic
                        set({
                            user: loginResponse,
                            isAuthenticated: true,
                        });
                    }
                } catch (error) {
                    console.error("Failed to decode token", error);
                    set({
                        user: loginResponse,
                        isAuthenticated: true,
                    });
                }
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
