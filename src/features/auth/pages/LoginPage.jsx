import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import useAuthStore from '../../../store/authStore';
import { getApiUrl } from '../../../config/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(getApiUrl('/api/Auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            }

            const data = await response.json();
            
            // Hàm login trong store đã được viết để xử lý token và decode -> lấy ra role tự động
            login(data);

            // Navigate tương ứng với store set -> Cần lấy state mới nhất
            const stateStore = useAuthStore.getState();
            if (stateStore.user?.role === 'teacher') {
                navigate('/teacher/classes');
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center !p-4">
            <div className="w-full max-w-[480px] bg-surface rounded-2xl shadow-premium !p-8 !md:p-12 !border !border-border/50">
                <div className="text-center !mb-10">
                    <h1 className="text-5xl font-['Outfit'] font-bold text-primary !mb-2 tracking-tight">EMS</h1>
                    <p className="text-text-muted font-medium">Hệ thống Quản lý Giáo dục</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập hoặc Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full !px-5 !py-4 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/70"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full !px-5 !py-4 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/70"
                        />
                    </div>

                    <Button 
                        variant="primary" 
                        size="lg" 
                        disabled={loading}
                        className="w-full !py-4 text-lg rounded-xl mt-2 font-bold shadow-md hover:shadow-lg transition-all bg-primary text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>

                    <div className="text-center !pt-4">
                        <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
