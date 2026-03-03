import React from 'react';

const RoleSelector = ({ activeRole, onRoleChange }) => {
    return (
        <div className="flex p-1 bg-background rounded-2xl border border-border mb-8">
            <button
                onClick={() => onRoleChange('student')}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 ${activeRole === 'student'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-muted hover:text-primary'
                    }`}
            >
                <span className="text-xl">👨‍🎓</span>
                Học sinh
            </button>
            <button
                onClick={() => onRoleChange('teacher')}
                className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 ${activeRole === 'teacher'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-muted hover:text-primary'
                    }`}
            >
                <span className="text-xl">👨‍🏫</span>
                Giáo viên
            </button>
        </div>
    );
};

export default RoleSelector;
