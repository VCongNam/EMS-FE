import React from 'react';
import { Icon } from '@iconify/react';
import CTASection from '../../../components/common/CTASection';

// ── Data ────────────────────────────────────────────────────────────────────

const GROUPS = [
    {
        id: 'identity',
        icon: 'solar:shield-user-bold-duotone',
        name: 'Bảo mật & Tài khoản',
        desc: 'Kiểm soát truy cập thông minh cho mọi vai trò.',
        bullets: ['Đăng nhập bảo mật', 'Phân quyền RBAC', 'Lưu trữ tự động'],
        iconBg: 'bg-primary/10 text-primary',
        border: 'hover:border-primary/30',
    },
    {
        id: 'operation',
        icon: 'solar:widget-4-bold-duotone',
        name: 'Vận hành lớp học',
        desc: 'Quản lý lớp, lịch học và đội ngũ tập trung.',
        bullets: ['Quản lý học viên', 'Đăng ký qua mã', 'Phân công trợ giảng'],
        iconBg: 'bg-primary/10 text-primary',
        border: 'hover:border-primary/30',
    },
    {
        id: 'academic',
        icon: 'solar:book-bookmark-bold-duotone',
        name: 'Học tập & Kết quả',
        desc: 'Theo dõi điểm danh, điểm số và tiến độ học tập.',
        bullets: ['Điểm danh & ghi chú', 'Quản lý điểm số', 'Báo cáo học tập'],
        iconBg: 'bg-primary/10 text-primary',
        border: 'hover:border-primary/30',
    },
    {
        id: 'financial',
        icon: 'solar:wallet-money-bold-duotone',
        name: 'Tài chính & Thông báo',
        desc: 'Thu học phí linh hoạt và tự động thông báo phụ huynh.',
        bullets: ['Trả trước & trả sau', 'Theo dõi công nợ', 'Nhắc nhở tự động'],
        iconBg: 'bg-primary/10 text-primary',
        border: 'hover:border-primary/30',
    },
];

const DETAIL_SECTIONS = [
    {
        id: 'identity',
        no: '01',
        badge: 'Bảo mật & Tài khoản',
        badgeColor: 'bg-primary/10 text-primary',
        title: 'Bảo mật toàn diện, phân quyền rõ ràng',
        desc: 'Hệ thống xác thực và phân quyền theo vai trò giúp đảm bảo mỗi người chỉ thấy những gì họ được phép. Giáo viên kiểm soát toàn bộ, trợ giảng hỗ trợ giảng dạy, phụ huynh theo dõi con em.',
        features: [
            { icon: 'solar:lock-password-linear', text: 'Đăng nhập bảo mật & khôi phục mật khẩu cho tất cả vai trò' },
            { icon: 'solar:shield-user-linear', text: 'Phân quyền RBAC: Giáo viên, Trợ giảng, Phụ huynh' },
            { icon: 'solar:code-file-broken', text: 'Tự quản lý hồ sơ và thông tin cá nhân' },
            { icon: 'solar:archive-linear', text: 'Tự động lưu trữ & xóa dữ liệu cũ sau 30 ngày' },
        ],
        img: 'https://placehold.co/640x420/dce8f0/355872?text=Identity+%26+Security',
        side: 'right',
    },
    {
        id: 'operation',
        no: '02',
        badge: 'Vận hành lớp học',
        badgeColor: 'bg-primary/10 text-primary',
        title: 'Vận hành trơn tru từ lớp học đến lịch giảng',
        desc: 'Từ quản lý danh sách học viên, phân công trợ giảng đến phát hiện xung đột lịch — tất cả tập trung trong một màn hình duy nhất, cập nhật theo thời gian thực.',
        features: [
            { icon: 'solar:users-group-rounded-linear', text: 'Lưu trữ tập trung thông tin học viên & trạng thái' },
            { icon: 'solar:qr-code-linear', text: 'Thêm học viên nhanh qua mã mời' },
            { icon: 'solar:user-hand-up-linear', text: 'Phân công nhiệm vụ trợ giảng theo lớp' },
            { icon: 'solar:calendar-linear', text: 'Phát hiện & cảnh báo xung đột lịch học' },
        ],
        img: 'https://placehold.co/640x420/dce8f0/355872?text=Class+Operations',
        side: 'left',
    },
    {
        id: 'academic',
        no: '03',
        badge: 'Học tập & Kết quả',
        badgeColor: 'bg-primary/10 text-primary',
        title: 'Nắm bắt tiến độ học tập của từng học viên',
        desc: 'Hệ thống điểm danh, sổ điểm và thư viện tài liệu giúp giáo viên có cái nhìn toàn diện về từng học viên. Báo cáo học tập tự động gửi đến phụ huynh định kỳ.',
        features: [
            { icon: 'solar:check-read-linear', text: 'Điểm danh buổi học & thêm ghi chú nhanh' },
            { icon: 'solar:book-2-linear', text: 'Thư viện tài liệu: văn bản, bài tập, bài giảng' },
            { icon: 'solar:chart-2-linear', text: 'Sổ điểm và theo dõi kết quả học tập' },
            { icon: 'solar:document-text-linear', text: 'Xuất báo cáo học tập tự động cho phụ huynh' },
        ],
        img: 'https://placehold.co/640x420/dce8f0/355872?text=Academic+Tracking',
        side: 'right',
    },
    {
        id: 'financial',
        no: '04',
        badge: 'Tài chính & Thông báo',
        badgeColor: 'bg-primary/10 text-primary',
        title: 'Thu học phí thông minh, không bỏ sót khoản nào',
        desc: 'Hỗ trợ nhiều mô hình thanh toán linh hoạt phù hợp với từng loại trung tâm, theo dõi công nợ theo thời gian thực và tự động nhắc nhở phụ huynh kịp thời.',
        features: [
            { icon: 'solar:wallet-linear', text: 'Học phí trả trước (theo buổi) & trả sau (theo tháng)' },
            { icon: 'solar:card-linear', text: 'Giám sát trạng thái thanh toán theo thời gian thực' },
            { icon: 'solar:bell-linear', text: 'Tự động nhắc nhở học phí trễ hạn đến phụ huynh' },
            { icon: 'solar:graph-up-linear', text: 'Cập nhật điểm số & điểm danh tự động cho phụ huynh' },
        ],
        img: 'https://placehold.co/640x420/dce8f0/355872?text=Financial+Management',
        side: 'left',
    },
];

// ── Components ───────────────────────────────────────────────────────────────

const GroupCard = ({ icon, name, desc, bullets, iconBg, border }) => (
    <div className={`group !p-3 flex flex-col items-center text-center gap-4 p-6 rounded-[20px] border border-border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${border}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center  ${iconBg}`}>
            <Icon icon={icon} width="28" height="28" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-[#2D3142] font-['Outfit'] mb-1">{name}</h3>
            <p className="text-text-muted text-sm">{desc}</p>
        </div>
        <ul className="p-2 flex flex-col gap-1.5 items-start">
            {bullets.map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-text-muted">
                    <Icon icon="solar:check-circle-bold" className="text-primary flex-shrink-0" width="15" />
                    {b}
                </li>
            ))}
        </ul>
    </div>
);

const DetailSection = ({ no, badge, badgeColor, title, desc, features, img, side }) => {
    const isImgRight = side === 'right';
    return (
        <section className="!pb-15 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text side */}
            <div className={isImgRight ? 'lg:order-1' : 'lg:order-2'}>
                <span className="text-7xl font-extrabold text-[#2D3142]/5 font-['Outfit'] leading-none block mb-2 select-none">
                    {no}
                </span>
                <span className={`!p-2 inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4 ${badgeColor}`}>
                    {badge}
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2D3142] font-['Outfit'] leading-tight mb-4">
                    {title}
                </h2>
                <p className="text-text-muted leading-relaxed mb-8">{desc}</p>
                <ul className="flex flex-col gap-4">
                    {features.map(f => (
                        <li key={f.text} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon icon={f.icon} className="text-primary" width="17" />
                            </div>
                            <span className="text-[#2D3142] font-medium text-sm leading-relaxed">{f.text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Image side */}
            <div className={isImgRight ? 'lg:order-2' : 'lg:order-1'}>
                <div className="rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(53,88,114,0.25)] transition-transform duration-500 hover:-translate-y-2">
                    <img src={img} alt={title} className="w-full h-auto object-cover" />
                </div>
            </div>
        </section>
    );
};

// ── Page ─────────────────────────────────────────────────────────────────────

const Features = () => (
    <div className="overflow-x-hidden container">

        {/* Hero */}
        <section className="!pt-15  text-center">
            <div className="!p-2 inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8">
                <Icon icon="solar:star-linear" width="16" />
                <span>4 nhóm tính năng · 15 chức năng</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-[#2D3142] font-['Outfit'] leading-tight mb-6 max-w-4xl !mx-auto">
                Mọi thứ bạn cần để{' '}
                <span className="text-primary">quản lý trung tâm</span>
            </h1>
            <p className="text-xl text-text-muted max-w-2xl !mx-auto leading-relaxed">
                EMS tích hợp đầy đủ bảo mật, vận hành, học tập và tài chính — không cần bất kỳ phần mềm thứ ba nào.
            </p>
        </section>

        {/* Overview 4 cards */}
        <section className="!pt-15">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {GROUPS.map(g => <GroupCard key={g.id} {...g} />)}
            </div>
        </section>

        {/* Divider */}
        <div className="!my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Detail sections */}
        {DETAIL_SECTIONS.map((s, i) => (
            <React.Fragment key={s.id}>
                <DetailSection {...s} />
                {i < DETAIL_SECTIONS.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                )}
            </React.Fragment>
        ))}

        {/* CTA */}
        <CTASection
            title="Sẵn sàng trải nghiệm đầy đủ tính năng?"
            subtitle="Đăng ký miễn phí và khám phá toàn bộ hệ thống ngay hôm nay."
            secondaryBtnText="Xem bảng giá"
            secondaryBtnLink="/pricing"
        />
    </div>
);

export default Features;