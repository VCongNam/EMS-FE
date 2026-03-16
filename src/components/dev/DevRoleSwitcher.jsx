import { Icon } from '@iconify/react';
import useAuthStore from '../../store/authStore';

const DevRoleSwitcher = () => {
    const { user, setRole } = useAuthStore();
    const currentRole = user?.role || 'none';

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] bg-surface/90 backdrop-blur-md border border-border p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col gap-2 sm:gap-3">
            <p className="text-[8px] sm:text-[10px] font-bold text-text-muted uppercase tracking-widest text-center">Dev Switch</p>
            <div className="flex gap-2">
                {[
                    { id: 'student', label: 'HS', icon: 'material-symbols:person-rounded' },
                    { id: 'teacher', label: 'GV', icon: 'material-symbols:school-rounded' },
                    { id: 'assistant', label: 'TG', icon: 'material-symbols:handshake-rounded' }
                ].map((r) => (
                    <button
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        title={r.label}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${currentRole === r.id
                            ? 'bg-primary border-primary text-white shadow-lg'
                            : 'bg-background border-border text-text-main hover:border-primary/50'
                            }`}
                    >
                        <Icon icon={r.icon} className="text-xl sm:text-2xl" />
                    </button>
                ))}
            </div>
            {currentRole === 'none' && (
                <p className="text-[10px] text-red-500 text-center animate-pulse">Click to Activate Dashboard</p>
            )}
        </div>
    );
};

export default DevRoleSwitcher;
