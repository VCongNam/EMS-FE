import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import useAuthStore from '../../../store/authStore';
import { authService } from '../api/authService';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const ROLES = [
    { id: 'student', label: 'Học viên', icon: 'ph:student-bold', color: 'blue', apiRole: 'Student' },
    { id: 'teacher', label: 'Giáo viên', icon: 'ph:chalkboard-teacher-bold', color: 'purple', apiRole: 'Teacher' },
    { id: 'TA', label: 'Trợ giảng', icon: 'ph:user-gear-bold', color: 'orange', apiRole: 'TA' },
];

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    // Login Form State
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    
    // Auth Flow State
    const [step, setStep] = useState(0); // 0: Login, 1: Profile Selection
    const [tempToken, setTempToken] = useState(null);
    const [availableProfiles, setAvailableProfiles] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const roleConfig = ROLES.find(r => r.id === selectedRole);
            const loginPayload = { 
                identifier, 
                password, 
                selectedRole: roleConfig?.apiRole || 'Student' 
            };
            console.log("[Login] Sending Payload:", loginPayload);

            const response = await authService.login(loginPayload);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log("[Login] Error Status:", response.status);
                console.log("[Login] Error Data:", errorData);
                
                const finalMessage = (errorData.message || errorData.Message || "").toLowerCase();
                const needsActivation = response.status === 403 || finalMessage.includes("xác thực") || finalMessage.includes("kích hoạt");

                // Check if account needs onboarding (verification)
                if (needsActivation) {
                    if (selectedRole === 'student') {
                        console.log("[Login] Student needs activation. Redirecting to /verify-onboarding");
                        toast.info("Tài khoản của bạn cần được kích hoạt trước khi sử dụng.");
                        navigate('/verify-onboarding');
                    } else {
                        console.log("[Login] Staff/Teacher needs OTP. Redirecting to /verify-email");
                        toast.info("Tài khoản của bạn cần được xác thực mã OTP.");
                        navigate('/verify-email', { state: { email: identifier } });
                    }
                    return;
                }

                throw new Error(errorData.message || errorData.Message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            }

            const data = await response.json();

            // Nếu Backend yêu cầu chọn profile (Học sinh)
            if (data.requiresProfileSelection) {
                setAvailableProfiles(data.availableProfiles || []);
                setTempToken(data.tempToken);
                setStep(1); // Chuyển sang bước chọn profile
                return;
            }

            // Nếu không cần chọn profile -> Đăng nhập hoàn tất
            login(data);
            handleRedirect(data.roleName || '');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProfile = async (studentId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authService.selectProfile(studentId, tempToken);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Không thể chọn hồ sơ này.');
            }
            const data = await res.json();
            
            // Lưu session hoàn tất
            login(data);
            handleRedirect(data.roleName || 'Student');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRedirect = (roleName) => {
        const role = roleName.toLowerCase();
        if (role === 'teacher') {
            navigate('/teacher/classes');
        } else if (role === 'ta') {
            navigate('/assisted-classes'); 
        } else if (role === 'student') {
            navigate('/student/classes'); 
        } else if (role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    // Render Profile Selection Step
    if (step === 1) {
        return (
            <AuthLayout
                title="Chọn hồ sơ học sinh"
                subtitle="Tài khoản của bạn liên kết với nhiều hồ sơ. Vui lòng chọn một hồ sơ để tiếp tục."
            >
                <div className="!space-y-6 animate-fade-in">
                    {error && (
                        <div className="!p-4 rounded-xl bg-red-50 border border-red-400/20 text-red-600 text-sm font-medium flex items-center !gap-3">
                            <Icon icon="solar:danger-bold-duotone" className="text-xl" />
                            {error}
                        </div>
                    )}

                    <div className="!grid !grid-cols-1 !gap-4">
                        {availableProfiles.map((p) => (
                            <button
                                key={p.studentId}
                                onClick={() => handleSelectProfile(p.studentId)}
                                disabled={loading}
                                className="!flex !items-center !gap-4 !p-4 !rounded-2xl !border-2 !border-border hover:!border-primary hover:!bg-primary/5 !transition-all !group !text-left"
                            >
                                <div className="!w-12 !h-12 !rounded-xl !bg-primary/10 !text-primary !flex !items-center !justify-center !group-hover:bg-primary !group-hover:text-white !transition-colors">
                                    <Icon icon="solar:user-circle-bold-duotone" className="!text-2xl" />
                                </div>
                                <div className="!flex-1">
                                    <h4 className="!font-black !text-text-main !group-hover:text-primary !transition-colors">{p.fullName}</h4>
                                    <p className="!text-xs !text-text-muted">Mã HS: {p.studentId.substring(0, 8).toUpperCase()}</p>
                                </div>
                                <Icon icon="solar:alt-arrow-right-bold-duotone" className="!text-text-muted !group-hover:text-primary !group-hover:translate-x-1 !transition-all" />
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => setStep(0)}
                        className="!w-full !py-3 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                    >
                        ← Quay lại đăng nhập
                    </button>
                </div>
            </AuthLayout>
        );
    }

    // Render Login Step
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
                    {/* Identifier Input */}
                    <div>
                        <label className="block text-sm font-semibold text-text-main !mb-2">
                            {selectedRole === 'student' ? 'Số điện thoại đăng nhập' : 'Email đăng nhập'}
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 !pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                                <Icon icon={selectedRole === 'student' ? "solar:phone-calling-bold-duotone" : "solar:user-bold-duotone"} className="text-xl" />
                            </div>
                            <input
                                type="text"
                                placeholder={selectedRole === 'student' ? "0xxxxxxxxx" : "name@school.edu.vn"}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
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