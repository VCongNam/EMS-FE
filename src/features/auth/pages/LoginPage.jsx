import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import useAuthStore from '../../../store/authStore';
import { authService } from '../api/authService';
import { Icon } from '@iconify/react';

const ROLES = [
    { id: 'student', label: 'Học viên', icon: 'ph:student-bold', color: 'blue' },
    { id: 'teacher', label: 'Giáo viên', icon: 'ph:chalkboard-teacher-bold', color: 'purple' },
    { id: 'TA', label: 'Trợ giảng', icon: 'ph:user-gear-bold', color: 'orange' },
];

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login({ email, password });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            }

            const data = await response.json();

            // Hàm login trong store đã được viết để xử lý token và decode -> lấy ra role tự động
            login(data);

            // Decode role từ store vừa cập nhật
            const stateStore = useAuthStore.getState();
            const role = stateStore.user?.role;

            // KIỂM TRA ROLE ĐỐI CHIẾU VỚI LỰA CHỌN CỦA NGƯỜI DÙNG
            if (role !== selectedRole) {
                // Nếu không khớp -> Logout ngay lập tức để xóa session vừa tạo
                stateStore.logout();
                
                const roleLabels = {
                    student: 'Học viên',
                    teacher: 'Giáo viên',
                    TA: 'Trợ giảng',
                };
                
                throw new Error(`Tài khoản của bạn thuộc vai trò ${roleLabels[role] || role}. Vui lòng chọn đúng vai trò để đăng nhập!`);
            }
            
            // Redirect based on user role
            if (role === 'teacher') {
                navigate('/teacher/classes');
            } else if (role === 'TA') {
                navigate('/dashboard'); 
            } else if (role === 'student') {
                navigate('/dashboard'); 
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Chào mừng trở lại!"
            subtitle="Đăng nhập vào tài khoản của bạn để tiếp tục."
        >
            <form className="animate-fade-in-up !space-y-6" onSubmit={handleLogin}>
                {error && (
                    <div className="!p-4 rounded-xl bg-red-50 border border-border-red-400/20 text-red-600 text-sm font-medium flex items-center !gap-3 animate-shake">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                            <Icon icon="solar:danger-bold-duotone" className="text-xl" />
                        </div>
                        {error}
                    </div>
                )}
                
                {/* Role Selector */}
                <div className="!space-y-3">
                    <label className="block text-sm font-bold text-text-main uppercase tracking-widest text-[10px]">
                        Tôi là...
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ROLES.map((role) => (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => setSelectedRole(role.id)}
                                className={`
                                    relative flex flex-col items-center !gap-2 !p-3 rounded-2xl border-2 transition-all duration-300
                                    ${selectedRole === role.id 
                                        ? `bg-primary/5 border-primary shadow-md shadow-primary/10 translate-y-[-2px]` 
                                        : 'bg-background border-border hover:border-primary/30 hover:bg-surface'}
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                    ${selectedRole === role.id ? 'bg-primary text-white scale-110' : 'bg-surface text-text-muted'}
                                `}>
                                    <Icon icon={role.icon} className="text-xl" />
                                </div>
                                <span className={`text-[11px] font-bold uppercase tracking-tight ${selectedRole === role.id ? 'text-primary' : 'text-text-muted'}`}>
                                    {role.label}
                                </span>
                                {selectedRole === role.id && (
                                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center animate-scale-in">
                                        <Icon icon="material-symbols:check-small-rounded" className="text-sm" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="!space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-semibold text-text-main !mb-2">
                            Tên đăng nhập / Email
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 !pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                                <Icon icon="solar:user-bold-duotone" className="text-xl" />
                            </div>
                            <input
                                type="text"
                                placeholder="name@school.edu.vn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full !pl-12 !pr-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex items-center justify-between !mb-2">
                            <label className="text-sm font-semibold text-text-main">
                                Mật khẩu
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark hover:underline transition-colors">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 !pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                                <Icon icon="solar:lock-password-bold-duotone" className="text-xl" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full !pl-12 !pr-16 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50 font-mono tracking-wider"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 !pr-4 flex items-center text-sm font-semibold text-text-muted hover:text-primary transition-colors"
                            >
                                <Icon icon={showPassword ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="!pt-2">
                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={loading}
                        className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
                    </Button>
                </div>

                <div className="text-center !mt-6">
                    <p className="text-text-muted font-medium">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-primary font-bold hover:underline transition-all">
                            Đăng ký
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
