import React from 'react';

const ClassStreamPage = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
            {/* Cột trái (25%) */}
            <div className="md:col-span-1 space-y-6">
                {/* Upcoming deadlines sẽ nằm ở đây */}
                <div className="bg-surface rounded-2xl border border-border !p-5 shadow-sm">
                    <h3 className="font-bold text-text-main !mb-2">Sắp tới</h3>
                    <p className="text-sm text-text-muted">Không có bài tập nào đến hạn sớm.</p>
                </div>
            </div>

            {/* Cột chính (75%) */}
            <div className="md:col-span-3 space-y-6">
                {/* Post Composer sẽ nằm ở đây */}
                <div className="bg-surface rounded-2xl border border-border !mb-2 !p-6 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-surface-hover transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0"></div>
                    <span className="text-text-muted">Thông báo nội dung nào đó cho lớp của bạn...</span>
                </div>

                {/* Danh sách Posts sẽ nằm ở đây */}
                <div className="bg-surface rounded-2xl border border-border !p-6 shadow-sm text-center !py-12">
                    <p className="text-text-muted">Đây là nơi giao tiếp với lớp học của bạn</p>
                    <p className="text-sm text-text-muted mt-2">Sử dụng luồng để chia sẻ thông báo, bài tập và câu hỏi</p>
                </div>
            </div>
        </div>
    );
};

export default ClassStreamPage;
