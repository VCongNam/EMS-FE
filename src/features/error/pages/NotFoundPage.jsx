import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const NotFoundPage = () => {
    return (
        <div className="container py-32 text-center">
            <h1 className="text-[8rem] font-bold text-primary leading-none">404</h1>
            <h2 className="text-3xl font-bold mb-5">Ôi không! Trang không tồn tại</h2>
            <p className="text-text-muted mb-10 text-xl max-w-lg mx-auto">
                Có vẻ như đường dẫn bạn đang truy cập đã bị thay đổi hoặc không còn tồn tại.
            </p>
            <Link to="/">
                <Button size="lg">Quay lại trang chủ</Button>
            </Link>
        </div>
    );
};

export default NotFoundPage;

