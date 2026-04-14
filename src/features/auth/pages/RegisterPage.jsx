import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../api/authService';
const RegisterPage = () => {
    const navigate = useNavigate();

    // State cho việc chọn Role MOCKUP: 'teacher' | 'ta'
    const [role, setRole] = useState('teacher');

    // Form states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp.');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register({ 
                email: email.trim(), 
                password, 
                fullName: fullName.trim(), 
                roleName: role === 'teacher' ? 'Teacher' : 'TA' 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!');
            }

            // Chuyển sang trang xác thực email, truyền theo địa chỉ email 
            navigate('/verify-email', { state: { email: email.trim() } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Khởi tạo tài khoản"
            subtitle="Bắt đầu hành trình giảng dạy hiện đại cùng EMS. Chỉ mất 2 phút."
        >
            <div className="!mb-8 w-full">
                        {/* Role Tabs Segmented Control */}
                        <div className="bg-background/80 !p-1.5 rounded-2xl flex border border-border/50 shadow-sm relative z-0">
                            {/* Animated background cho tab */}
                            <div
                                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-border/30 transition-transform duration-300 ease-out z-[-1]"
                                style={{ transform: role === 'teacher' ? 'translateX(0)' : 'translateX(100%)' }}
                            />

                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={`flex-1 !py-3 text-sm font-bold rounded-xl flex items-center justify-center transition-colors duration-300 ${role === 'teacher' ? 'text-primary' : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                Giáo viên
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('ta')}
                                className={`flex-1 !py-3 text-sm font-bold rounded-xl flex items-center justify-center transition-colors duration-300 ${role === 'ta' ? 'text-primary' : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                Trợ giảng
                            </button>
                        </div>
                    </div>

                    <form className="animate-fade-in-up !space-y-5" onSubmit={handleRegister}>
                        {error && (
                            <div className="!p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Họ và tên</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Email công việc</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="teacher@school.edu.vn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Mật khẩu</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full !pl-4 !pr-16 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50 font-mono tracking-wider"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 !pr-4 flex items-center text-sm font-semibold text-text-muted hover:text-primary transition-colors"
                                >
                                    {showPassword ? "Ẩn" : "Hiện"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Nhập lại mật khẩu</label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu của bạn"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full !pl-4 !pr-16 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50 font-mono tracking-wider"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 !pr-4 flex items-center text-sm font-semibold text-text-muted hover:text-primary transition-colors"
                                >
                                    {showConfirmPassword ? "Ẩn" : "Hiện"}
                                </button>
                            </div>
                        </div>

                        <div className="!pt-2">
                            <p className="text-xs text-text-muted !mb-5 leading-relaxed">
                                Bằng việc đăng ký, bạn đồng ý với <a href="#" className="text-primary font-medium hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-primary font-medium hover:underline">Chính sách bảo mật</a> của chứng tôi.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                type="submit"
                                disabled={loading}
                                className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? 'Đang xử lý...' : `Tạo tài khoản ${role === 'teacher' ? 'Giáo viên' : 'Trợ giảng'}`}
                            </Button>
                        </div>

                        <div className="text-center !mt-6">
                            <p className="text-text-muted font-medium">
                                Đã có tài khoản?{' '}
                                <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                                    Đăng nhập
                                </Link>
                            </p>
                        </div>
                    </form>
        </AuthLayout>
    );
};

export default RegisterPage;
