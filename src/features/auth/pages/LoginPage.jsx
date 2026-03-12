import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import RoleSelector from '../components/RoleSelector';
import { authService } from '@/services/authService';

const LoginPage = () => {
    const [role, setRole] = useState('student');
    const [focusedField, setFocusedField] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // 1. THÊM STATE ĐỂ LƯU DỮ LIỆU NGƯỜI DÙNG NHẬP VÀO
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // 2. THÊM HÀM LẮNG NGHE SỰ THAY ĐỔI CỦA INPUT
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. THÊM HÀM GỌI API KHI BẤM ĐĂNG NHẬP
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            // Gửi role (vai trò) kèm theo email và password lên server
            const data = await authService.login(formData.email, formData.password, role);
            console.log('Đăng nhập thành công:', data);

            // Giả lập lưu token (nếu API có trả về token)
            if (data?.token) {
                localStorage.setItem('accessToken', data.token);
            }

            // Chuyển trang sau khi đăng nhập thành công
            // (Bạn đổi '/dashboard' thành đường dẫn thực tế của bạn)
            navigate('/dashboard'); 

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'Sai thông tin đăng nhập!');
            } else {
                setErrorMessage('Không thể kết nối đến máy chủ!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Đăng nhập 👋"
            subtitle="Chào mừng bạn quay lại! Vui lòng chọn vai trò và nhập thông tin để truy cập."
        >
            <RoleSelector activeRole={role} onRoleChange={setRole} />

            <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg shadow-primary/10 mb-6">
                
                {/* 4. GẮN HÀM XỬ LÝ VÀO FORM */}
                <form className="space-y-5" onSubmit={handleLogin}>
                    
                    {/* HIỂN THỊ THÔNG BÁO LỖI NẾU CÓ */}
                    {errorMessage && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm border border-red-200 text-center font-medium">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-text-main">
                            {role === 'student' ? 'Mã học sinh / Email' : 'Email công việc'}
                        </label>
                        <input
                            type="email"
                            name="email"                    // Bổ sung name
                            value={formData.email}          // Bổ sung value
                            onChange={handleChange}         // Bổ sung onChange
                            placeholder="example@ems.com"
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-5 py-4 rounded-xl bg-white/60 border transition-all duration-300 outline-none ${focusedField === 'email'
                                ? 'border-primary shadow-lg shadow-primary/20 bg-white/80 scale-105'
                                : 'border-white/40 hover:border-white/60 hover:bg-white/70'
                                }`}
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-text-main">Mật khẩu</label>
                            <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">Quên mật khẩu?</a>
                        </div>
                        <input
                            type="password"
                            name="password"                 // Bổ sung name
                            value={formData.password}       // Bổ sung value
                            onChange={handleChange}         // Bổ sung onChange
                            placeholder="••••••••"
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-5 py-4 rounded-xl bg-white/60 border transition-all duration-300 outline-none ${focusedField === 'password'
                                ? 'border-primary shadow-lg shadow-primary/20 bg-white/80 scale-105'
                                : 'border-white/40 hover:border-white/60 hover:bg-white/70'
                                }`}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-white/60 text-primary accent-primary cursor-pointer transition-all hover:border-primary"
                        />
                        <label htmlFor="remember" className="text-sm text-text-muted cursor-pointer hover:text-primary transition-colors">Ghi nhớ đăng nhập</label>
                    </div>

                    {/* 5. CẬP NHẬT NÚT BẤM (GẮN TRẠNG THÁI LOADING) */}
                    <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg" 
                        className="w-full flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
                    </Button>

                    <div className="mt-8 pt-6 border-t border-white/40 text-center text-text-muted">
                        {role === 'teacher' ? (
                            <p>Bạn chưa có tài khoản? <Link to="/register" className="text-primary font-bold hover:text-primary-hover transition-colors">Đăng ký ngay</Link></p>
                        ) : (
                            <p>Học sinh được cấp tài khoản bởi Nhà trường/Giáo viên.</p>
                        )}
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;