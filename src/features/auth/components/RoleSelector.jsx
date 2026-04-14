import React from 'react';

const RoleSelector = ({ activeRole, onRoleChange }) => {
    const roles = [
        { id: 'student', label: 'Học sinh' },
        { id: 'teacher', label: 'Giáo viên' },
        { id: 'TA', label: 'Trợ giảng' }
    ];

    return (
        <div className="flex p-1 bg-background rounded-xl border border-border mb-8">
            {roles.map(role => (
                <button
                    key={role.id}
                    onClick={() => onRoleChange(role.id)}
                    className={`flex-1 py-3 px-2 rounded-[10px] transition-all duration-300 font-medium text-sm flex items-center justify-center ${activeRole === role.id
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-muted hover:text-primary'
                        }`}
                >
                    {role.label}
                </button>
            ))}
        </div>
    );
};

export default RoleSelector;
