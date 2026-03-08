import React from 'react';
import { Icon } from '@iconify/react';
import CTASection from '../../../components/common/CTASection';

const mosaicImages = [
    {
        src: 'https://placehold.co/600x800/355872/ffffff?text=Đội+Ngũ',
        alt: 'Đội ngũ EMS',
        className: 'col-span-1 row-span-2 rounded-[28px] overflow-hidden shadow-xl hover:-translate-y-2',
    },
    {
        src: 'https://placehold.co/600x400/2D3142/ffffff?text=Văn+Phòng',
        alt: 'Không gian làm việc',
        className: 'col-span-2 rounded-[28px] overflow-hidden shadow-lg hover:-translate-y-1',
    },
    {
        src: 'https://placehold.co/300x400/7AAACE/ffffff?text=Học+Viên',
        alt: 'Học viên',
        className: 'col-span-1 rounded-[28px] overflow-hidden shadow-lg hover:-translate-y-1',
    },
    {
        src: 'https://placehold.co/300x400/4a6fa5/ffffff?text=Giáo+Viên',
        alt: 'Giáo viên',
        className: 'col-span-1 rounded-[28px] overflow-hidden shadow-lg hover:-translate-y-1',
    },
];

const timelineItems = [
    {
        year: '2025',
        icon: 'solar:eye-linear',
        title: 'Nhận ra vấn đề',
        desc: 'Chúng tôi nhận thấy các gia sư và trung tâm học thêm đang mất hàng giờ mỗi ngày để quản lý bằng Excel, giấy tờ và nhóm Zalo. Học phí thất thu, lịch học lộn xộn — đây là vấn đề cần giải quyết.',
        side: 'left',
    },
    {
        year: '2025',
        icon: 'solar:lightbulb-linear',
        title: 'Bắt đầu xây dựng',
        desc: 'Nhóm 5 thành viên bắt đầu nghiên cứu, phỏng vấn giáo viên và thiết kế hệ thống. Mục tiêu: đơn giản, đủ dùng, và phù hợp với thực tế Việt Nam.',
        side: 'right',
    },
    {
        year: '2026',
        icon: 'solar:rocket-2-linear',
        title: 'Ra mắt EMS',
        desc: 'Phiên bản đầu tiên được ra mắt với các tính năng cốt lõi: quản lý lớp học, theo dõi học viên, điểm danh trực tuyến và báo cáo học phí tự động.',
        side: 'left',
    },
    {
        year: 'Tương lai',
        icon: 'solar:star-linear',
        title: 'Mở rộng & phát triển',
        desc: 'Kế hoạch tích hợp AI để gợi ý nội dung học, mở rộng sang quản lý trường học quy mô lớn và hỗ trợ nhiều loại hình đào tạo hơn.',
        side: 'right',
    },
];

const MemberCard = ({ name, role, roleColor, bio, avatar, github, linkedin }) => (
    <div className="group flex flex-col items-center text-center !pt-5 p-6 rounded-[24px] hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(53,88,114,0.15)] transition-all duration-300">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg mb-5 ring-4 ring-white group-hover:ring-primary/20 transition-all duration-300 group-hover:-translate-y-1">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Name */}
        <h3 className="!pt-5 text-xl font-bold text-[#2D3142] font-['Outfit'] mb-1">{name}</h3>

        {/* Role badge */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 ${roleColor}`}>
            {role}
        </span>

        {/* Bio */}
        <p className="text-text-muted text-sm leading-relaxed mb-4">{bio}</p>

        {/* Social links */}
        <div className="flex gap-3 justify-center">
            {github && github !== '#' && (
                <a href={github} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary">
                    <Icon icon="solar:github-circle-linear" width="20" height="20" />
                </a>
            )}
            {linkedin && linkedin !== '#' && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary">
                    <Icon icon="solar:linkedin-linear" width="20" height="20" />
                </a>
            )}
        </div>
    </div>
);

const AboutUs = () => {
    return (
        <div className="overflow-x-hidden container">

            {/* ── Hero Section ── */}
            <section className="!pt-15 text-center animate-fade-in">

                {/* Badge */}
                <div className="!p-2 inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8">
                    <span>✦</span>
                    <span>Câu chuyện của chúng tôi</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl lg:text-6xl font-extrabold text-[#2D3142] font-['Outfit'] leading-tight mb-6 max-w-4xl !mx-auto">
                    Được xây dựng bởi những người{' '}
                    <span className="text-primary">yêu giáo dục</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-text-muted max-w-2xl !mx-auto leading-relaxed mb-12">
                    EMS ra đời từ một quan sát đơn giản: gia sư và giáo viên đang dành quá nhiều thời gian
                    cho thủ tục hành chính hơn là giảng dạy. Chúng tôi ở đây để thay đổi điều đó.
                </p>

                {/* Inline Stats */}
                <div className="flex flex-wrap justify-center gap-10 mb-16 text-center">
                    {[
                        { value: '2026', label: 'Năm thành lập' },
                        { value: '5', label: 'Thành viên' },
                        { value: '500+', label: 'Học viên hỗ trợ' },
                        { value: '100%', label: 'Miễn phí để bắt đầu' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-3xl font-extrabold text-[#2D3142] font-['Outfit']">{stat.value}</p>
                            <p className="text-sm text-text-muted mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Mosaic Image Grid */}
                <div className="!pt-5 grid grid-cols-3 grid-rows-2 gap-4 h-[420px] lg:h-[500px]">
                    {mosaicImages.map((img) => (
                        <div
                            key={img.alt}
                            className={`${img.className} transition-transform duration-500`}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Story Timeline Section ── */}
            <section className="!pt-15">
                {/* Section Header */}
                <div className="text-center !mb-10">
                    <h2 className="text-3xl lg:text-5xl font-extrabold text-[#2D3142] font-['Outfit'] tracking-tight">
                        Từ ý tưởng đến{' '}
                        <span className="text-primary">sản phẩm thực</span>
                    </h2>
                </div>

                {/* Timeline */}
                <div className="relative max-w-4xl !mx-auto">
                    {/* Center Line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent -translate-x-1/2" />

                    <div className="space-y-16 md:space-y-24">
                        {timelineItems.map((item, i) => (
                            <div
                                key={i}
                                className={`flex flex-col md:flex-row items-center w-full group relative ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Content */}
                                <div className={`w-full md:w-5/12 ${item.side === 'left' ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} !mb-10 text-center`}>
                                    {/* Year badge */}
                                    <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider uppercase">
                                        {item.year}
                                    </span>
                                    <h3 className="text-xl font-bold text-[#2D3142] mb-2 font-['Outfit']">
                                        {item.title}
                                    </h3>
                                    <p className="text-text-muted leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Center node */}
                                <div className="hidden md:flex w-2/12 justify-center">
                                    <div className="w-20 h-20 rounded-2xl bg-white border-2 border-primary/20 flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-lg z-10">
                                        <Icon icon={item.icon} className="text-primary" width="40" height="40" />
                                    </div>
                                </div>

                                {/* Mobile icon */}
                                <div className="flex md:hidden w-14 h-14 rounded-2xl bg-white border-2 border-primary/20 items-center justify-center shadow-md mb-4">
                                    <Icon icon={item.icon} className="text-primary" width="28" height="28" />
                                </div>

                                {/* Empty side */}
                                <div className="hidden md:block w-5/12" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Core Values Section ── */}
            <section className="!pt-15">
                <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#2D3142] via-[#355872] to-[#7AAACE] px-12 py-16 md:px-20 md:py-20">
                    {/* Decorative glows */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10 text-center mb-14">
                        <h2 className="!py-5 text-3xl lg:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                            Giá trị <span className="text-white/80">cốt lõi</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2">
                            {[
                                {
                                    icon: 'solar:widget-5-linear',
                                    title: 'Đơn giản',
                                    desc: 'Giao diện trực quan, tối giản — không cần đọc hướng dẫn dài. Chỉ cần mở ra là hiểu ngay, từ giáo viên lớn tuổi đến trợ giảng mới vào nghề.',
                                },
                                {
                                    icon: 'solar:eye-linear',
                                    title: 'Minh bạch',
                                    desc: 'Mọi thông tin về học phí, điểm danh và tiến độ học tập đều được hiển thị rõ ràng. Phụ huynh và giáo viên luôn có thể kiểm tra bất cứ lúc nào.',
                                },
                            ].map((v) => (
                                <div key={v.title} className="group !px-5 flex flex-col items-center text-center gap-4 p-8 hover:bg-white/5 rounded-2xl transition-colors duration-300">
                                    <Icon icon={v.icon} className="text-white" width="48" height="48" />
                                    <h3 className="text-xl font-bold text-white font-['Outfit']">{v.title}</h3>
                                    <p className="text-lg text-white/90 leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2">
                            {[
                                {
                                    icon: 'solar:bolt-linear',
                                    title: 'Hiệu quả',
                                    desc: 'Tự động hóa điểm danh, nhắc học phí và gửi báo cáo định kỳ — giúp giáo viên tiết kiệm hàng giờ mỗi tuần và tập trung vào điều quan trọng hơn là giảng dạy.',
                                },
                                {
                                    icon: 'solar:heart-linear',
                                    title: 'Vì người dùng',
                                    desc: 'Từng tính năng được xây dựng từ phản hồi thực tế của giáo viên và trung tâm. Chúng tôi luôn lắng nghe, cải tiến và đặt trải nghiệm người dùng lên hàng đầu.',
                                },
                            ].map((v) => (
                                <div key={v.title} className="group !px-5 !pb-5 flex flex-col items-center text-center gap-4 p-8 hover:bg-white/5 rounded-2xl transition-colors duration-300">
                                    <Icon icon={v.icon} className="text-white" width="48" height="48" />
                                    <h3 className="text-xl font-bold text-white font-['Outfit']">{v.title}</h3>
                                    <p className="text-lg text-white/90 leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Team Section ── */}
            <section className="!pt-15">
                <div className="text-center mb-14">
                    <h2 className="text-3xl lg:text-5xl font-extrabold text-[#2D3142] font-['Outfit'] tracking-tight">
                        Đội ngũ <span className="text-primary">của chúng tôi</span>
                    </h2>
                    <p className="text-text-muted text-lg mt-4 max-w-xl !mx-auto">
                        5 thành viên với cùng một đam mê: xây dựng công cụ tốt hơn cho giáo dục Việt Nam.
                    </p>
                </div>

                {/* Row 1 — 3 members */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    {[
                        {
                            name: 'Nguyễn Văn A',
                            role: 'Full-stack Developer',
                            roleColor: 'bg-blue-100 text-blue-700',
                            bio: 'Phụ trách kiến trúc hệ thống và backend API. Có kinh nghiệm với Node.js và React.',
                            avatar: 'https://placehold.co/200x200/355872/ffffff?text=A',
                            github: '#',
                            linkedin: '#',
                        },
                        {
                            name: 'Trần Thị B',
                            role: 'Frontend Developer',
                            roleColor: 'bg-indigo-100 text-indigo-700',
                            bio: 'Chuyên về giao diện người dùng, đảm bảo trải nghiệm mượt mà trên mọi thiết bị.',
                            avatar: 'https://placehold.co/200x200/2D3142/ffffff?text=B',
                            github: '#',
                            linkedin: '#',
                        },
                        {
                            name: 'Lê Văn C',
                            role: 'UI/UX Designer',
                            roleColor: 'bg-purple-100 text-purple-700',
                            bio: 'Thiết kế giao diện tối giản, tập trung vào trải nghiệm người dùng cuối là giáo viên.',
                            avatar: 'https://placehold.co/200x200/7AAACE/ffffff?text=C',
                            github: '#',
                            linkedin: '#',
                        },
                    ].map((member) => (
                        <MemberCard key={member.name} {...member} />
                    ))}
                </div>

                {/* Row 2 — 2 members centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl !mx-auto">
                    {[
                        {
                            name: 'Phạm Thị D',
                            role: 'Backend Developer',
                            roleColor: 'bg-green-100 text-green-700',
                            bio: 'Phụ trách cơ sở dữ liệu, bảo mật và tích hợp thanh toán học phí tự động.',
                            avatar: 'https://placehold.co/200x200/4a6fa5/ffffff?text=D',
                            github: '#',
                            linkedin: '#',
                        },
                        {
                            name: 'Hoàng Văn E',
                            role: 'Product Manager',
                            roleColor: 'bg-orange-100 text-orange-700',
                            bio: 'Nghiên cứu người dùng, định hướng sản phẩm và kết nối đội ngũ phát triển.',
                            avatar: 'https://placehold.co/200x200/5d8a8a/ffffff?text=E',
                            github: '#',
                            linkedin: '#',
                        },
                    ].map((member) => (
                        <MemberCard key={member.name} {...member} />
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <CTASection
                title="Cùng chúng tôi xây dựng nền giáo dục tốt hơn"
                subtitle="Bắt đầu miễn phí ngay hôm nay và trải nghiệm sự khác biệt mà EMS mang lại."
                secondaryBtnText="Liên hệ chúng tôi"
                secondaryBtnLink="/contact"
            />
        </div>
    );
};

export default AboutUs;
