import React from 'react';

const RoleSelector = ({ activeRole, onRoleChange }) => {
    return (
        <div className="mb-8">
            <div className="inline-flex w-full p-1.5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-primary/10">
                <button
                    onClick={() => onRoleChange('student')}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${activeRole === 'student'
                        ? 'bg-primary text-white shadow-[0_8px_16px_0_rgba(53,88,114,0.3)] scale-105'
                        : 'text-text-muted hover:text-primary/80 hover:bg-white/20'
                        }`}
                >
                    <span className="text-xl">👨‍🎓</span>
                    Học sinh
                </button>
                <button
                    onClick={() => onRoleChange('teacher')}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${activeRole === 'teacher'
                        ? 'bg-primary text-white shadow-[0_8px_16px_0_rgba(53,88,114,0.3)] scale-105'
                        : 'text-text-muted hover:text-primary/80 hover:bg-white/20'
                        }`}
                >
                    <span className="text-xl">👨‍🏫</span>
                    Giáo viên
                </button>
            </div>
        </div>
    );
};

export default RoleSelector;
