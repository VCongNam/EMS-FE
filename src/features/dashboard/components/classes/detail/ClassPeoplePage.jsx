import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../store/authStore';
import { getApiUrl } from '../../../../../config/api';

const ClassPeoplePage = () => {
    // Lấy classId từ URL (ví dụ: /teacher/classes/123-abc/people -> classId: '123-abc')
    const { classId } = useParams();
    
    // Lấy token từ Zustand thay vì LocalStorage thủ công
    const token = useAuthStore(state => state.user?.token);
    
    // Khai báo các State
    const [members, setMembers] = useState([]);
    const [tas, setTas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentIdInput, setStudentIdInput] = useState('');
    const [adding, setAdding] = useState(false);

    const [taIdInput, setTaIdInput] = useState('');
    const [taPermissionInput, setTaPermissionInput] = useState('Trợ giảng');
    const [taSalaryInput, setTaSalaryInput] = useState('');
    const [addingTa, setAddingTa] = useState(false);

    // Chỉnh sửa inline quyền trợ giảng
    const [editingTaId, setEditingTaId] = useState(null);
    const [editingPermission, setEditingPermission] = useState('');
    const [updatingTa, setUpdatingTa] = useState(false);

    const handleEditTaClick = (ta, e) => {
        e.stopPropagation();
        setEditingTaId(ta.taId);
        setEditingPermission(ta.permission);
    };

    const handleUpdateTaPermission = async (taId, e) => {
        e.stopPropagation();
        if (!editingPermission.trim() || !classId || !token) return;
        setUpdatingTa(true);
        try {
            const payload = { permission: editingPermission.trim() };
            const response = await fetch(getApiUrl(`/api/Class/${classId}/tas/${taId}/permission`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Lỗi lưu trữ cập nhật.');
            }

            alert('Cập nhật quyền thành công!');
            setEditingTaId(null);
            fetchClassTAs();
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdatingTa(false);
        }
    };

    // ==== CHỨC NĂNG GIAO VIỆC (CREATE TASK) ====
    const [taskModal, setTaskModal] = useState({ isOpen: false, ta: null });
    const [taskData, setTaskData] = useState({ title: '', dueDate: '', type: 'Grading' });
    const [submittingTask, setSubmittingTask] = useState(false);

    const handleOpenTaskModal = (ta, e) => {
        e.stopPropagation();
        setTaskModal({ isOpen: true, ta });
        setTaskData({ title: '', dueDate: '', type: 'Grading' });
    };

    const handleCloseTaskModal = () => {
        setTaskModal({ isOpen: false, ta: null });
    };

    const handleSubmitTask = async (e) => {
        e.preventDefault();
        if (!taskModal.ta || !token) return;
        setSubmittingTask(true);
        try {
            // Chuyển datetime-local mướt mờ thành ISO 8601
            const isoDueDate = new Date(taskData.dueDate).toISOString();
            
            const payload = {
                classTAID: taskModal.ta.taId, // ID của TA
                title: taskData.title,
                dueDate: isoDueDate,
                type: taskData.type
            };

            const response = await fetch(getApiUrl('/api/Class/createTask'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Lỗi khi giao việc!');
            }

            alert('Giao việc cho trợ giảng thành công!');
            handleCloseTaskModal();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmittingTask(false);
        }
    };

    const handleAddTA = async (e) => {
        e.preventDefault();
        if (!taIdInput.trim() || !classId || !token) return;
        
        setAddingTa(true);
        try {
            const payload = {
                taId: taIdInput.trim(),
                permission: taPermissionInput.trim(),
                salaryPerSession: parseFloat(taSalaryInput) || 0
            };

            const response = await fetch(getApiUrl(`/api/Class/${classId}/tas/assign`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Lỗi khi phân công trợ giảng do Server từ chối.');
            }

            alert('Phân công trợ giảng thành công!');
            setTaIdInput('');
            setTaPermissionInput('Trợ giảng');
            setTaSalaryInput('');
            fetchClassTAs(); // Tự động load lại danh sách TA sau khi thêm
        } catch (err) {
            alert(err.message);
        } finally {
            setAddingTa(false);
        }
    };

    // ==== CHỨC NĂNG XEM CÔNG VIỆC CỦA TA ====
    const [viewTasksModal, setViewTasksModal] = useState({ isOpen: false, ta: null, tasks: [], loading: false, error: null });

    const handleOpenViewTasks = async (ta, e) => {
        e.stopPropagation();
        setViewTasksModal({ isOpen: true, ta, tasks: [], loading: true, error: null });
        if (!token) return;

        try {
            const response = await fetch(getApiUrl(`/api/Class/classta/${ta.taId}`), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errData = await response.json().catch(()=>({}));
                throw new Error(errData.message || 'Không thể lấy danh sách công việc.');
            }
            const result = await response.json();
            // Theo ảnh Swagger thì result format là { "data": [ {taTaskID, title, dueDate...} ] }
            setViewTasksModal(prev => ({ ...prev, tasks: result.data || [], loading: false }));
        } catch (err) {
            setViewTasksModal(prev => ({ ...prev, loading: false, error: err.message }));
        }
    };

    const handleCloseViewTasks = () => {
        setViewTasksModal({ isOpen: false, ta: null, tasks: [], loading: false, error: null });
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!studentIdInput.trim() || !classId || !token) return;
        
        setAdding(true);
        try {
            const response = await fetch(getApiUrl(`/api/Class/${classId}/assignStudent`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ studentID: studentIdInput.trim() })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Lỗi khi thêm học viên. Hệ thống có thể không tìm thấy ID này.');
            }

            alert('Thêm học viên thành công!');
            setStudentIdInput(''); // Xóa ô input
            fetchClassMembers(); // Tự động load lại danh sách sau khi thêm
        } catch (err) {
            alert(err.message);
        } finally {
            setAdding(false);
        }
    };

    // 1. Hàm gọi API Lấy danh sách thành viên
    const fetchClassMembers = async () => {
        // Nếu không có ID lớp hoặc chưa đăng nhập, hủy gọi API
        if (!classId || !token) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // endpoint sử dụng backticks để gắn biến classId động
            const response = await fetch(getApiUrl(`/api/Class/${classId}/members`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Mang token đi để chứng minh quyền xem lớp
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Không thể tải danh sách thành viên do lỗi từ máy chủ.');
            }

            // Gán dữ liệu trả về từ Server vào biến `members`
            const result = await response.json();
            // Trích xuất mảng data nằm sau lớp vỏ bọc { message, totalCount, data: [] }
            setMembers(result.data || []);
        } catch (err) {
            console.error("Lỗi fetchClassMembers:", err);
            setError(err.message);
        } finally {
            setLoading(false); // Xóa trạng thái loading dù có lỗi hay k
        }
    };

    // Lấy danh sách Trợ Giảng (TA)
    const fetchClassTAs = async () => {
        if (!classId || !token) return;
        try {
            const response = await fetch(getApiUrl(`/api/Class/${classId}/tas`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                setTas(result.data || []);
            }
        } catch (err) {
            console.error("Lỗi fetchClassTAs:", err);
        }
    };

    // 2. Tự động gọi hàm mỗi khi Trang này vừa load lên (Mount), hoặc classId thay đổi
    useEffect(() => {
        fetchClassMembers();
        fetchClassTAs();
    }, [classId, token]);

    return (
        <div className="bg-surface rounded-2xl border border-border !p-8 shadow-sm animate-fade-in-up min-h-[400px]">
            {/* Các công cụ Ghi danh */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 !mb-8">
                {/* Form thêm học viên bằng ID */}
                <form onSubmit={handleAddStudent} className="flex flex-col gap-4 bg-blue-50 !p-5 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="font-bold text-blue-800 flex items-center gap-2">
                        <Icon icon="solar:user-plus-bold-duotone" className="text-xl" />
                        Ghi danh Học viên mới
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center !pl-4 pointer-events-none">
                                <Icon icon="material-symbols:badge-outline-rounded" className="text-blue-400 text-xl" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nhập ID Học viên... (3fa85...)"
                                value={studentIdInput}
                                onChange={(e) => setStudentIdInput(e.target.value)}
                                className="w-full !pl-12 !pr-4 !py-3 bg-white border border-blue-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm text-text-main placeholder:text-blue-300"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={adding || !studentIdInput.trim()}
                            className="!px-5 !py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            {adding ? <Icon icon="material-symbols:sync-rounded" className="animate-spin text-lg" /> : <Icon icon="material-symbols:add-circle-rounded" className="text-xl" />}
                            <span>Thêm Học viên</span>
                        </button>
                    </div>
                </form>

                {/* Form phân công Trợ giảng bằng ID */}
                <form onSubmit={handleAddTA} className="flex flex-col gap-4 bg-purple-50 !p-5 rounded-2xl border border-purple-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <h3 className="font-bold text-purple-800 flex items-center gap-2">
                        <Icon icon="solar:user-hand-up-bold-duotone" className="text-xl" />
                        Phân công Trợ giảng
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center !pl-4 pointer-events-none">
                                <Icon icon="material-symbols:badge-outline-rounded" className="text-purple-400 text-xl" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nhập ID Trợ giảng... (3254...)"
                                value={taIdInput}
                                onChange={(e) => setTaIdInput(e.target.value)}
                                className="w-full !pl-11 !pr-3 !py-2 bg-white border border-purple-200 rounded-lg outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-sm text-text-main placeholder:text-purple-300"
                                required
                            />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Quyền (Vd: Grading)"
                                value={taPermissionInput}
                                onChange={(e) => setTaPermissionInput(e.target.value)}
                                className="w-full !px-4 !py-2 bg-white border border-purple-200 rounded-lg outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-sm text-text-main placeholder:text-purple-300"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="number"
                                placeholder="Mức lương / buổi (VNĐ)"
                                value={taSalaryInput}
                                onChange={(e) => setTaSalaryInput(e.target.value)}
                                className="w-full !px-4 !py-2 bg-white border border-purple-200 rounded-lg outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium text-sm text-text-main placeholder:text-purple-300"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={addingTa || !taIdInput.trim() || !taPermissionInput.trim() || !taSalaryInput}
                            className="!px-5 !py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 hover:-translate-y-0.5 transition-all shadow-md shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            {addingTa ? <Icon icon="material-symbols:sync-rounded" className="animate-spin text-lg" /> : <Icon icon="material-symbols:add-circle-rounded" className="text-xl" />}
                            <span>Phân công</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Thanh Header danh sách */}
            <div className="flex items-center justify-between !mb-8 pb-4 border-b border-border">
                <h2 className="text-2xl font-bold text-text-main flex items-center gap-3">
                    <Icon icon="material-symbols:group-rounded" className="text-primary text-3xl" />
                    Danh sách Mọi người
                    <span className="bg-background !px-3 !py-1 rounded-full text-base text-text-muted border border-border">
                        {members.length}
                    </span>
                </h2>
                <button 
                    onClick={fetchClassMembers} 
                    className="flex items-center gap-2 !px-4 !py-2 rounded-xl border border-border hover:bg-background transition-colors text-sm font-semibold text-text-muted"
                >
                    <Icon icon="material-symbols:refresh-rounded" className={loading ? "animate-spin" : ""} />
                    Làm mới
                </button>
            </div>

            {/* Render hiển thị dữ liệu tuỳ theo State */}
            {loading ? (
                /* Đang tải... */
                <div className="flex flex-col items-center justify-center !py-16">
                    <Icon icon="material-symbols:sync-rounded" className="animate-spin text-5xl text-primary !mb-4 opacity-70" />
                    <p className="text-text-muted font-medium">Đang tải danh sách thành viên...</p>
                </div>
            ) : error ? (
                /* Báo lỗi API */
                <div className="bg-red-50 border border-red-200 text-red-600 !p-6 rounded-xl text-center">
                    <Icon icon="material-symbols:error-circle-rounded" className="text-4xl mx-auto !mb-2" />
                    <p className="font-bold">{error}</p>
                </div>
            ) : (
                /* HIỂN THỊ DANH SÁCH ROLE: TRỢ GIẢNG TRƯỚC VÀ HỌC SINH SAU */
                <div className="!space-y-10">
                    {/* KHU VỰC TRỢ GIẢNG */}
                    {tas.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-primary !mb-4 flex items-center gap-2 border-b border-border pb-2">
                                <Icon icon="solar:user-hand-up-bold-duotone" className="text-xl" />
                                Đội ngũ Trợ giảng ({tas.length})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {tas.map((ta, index) => (
                                    <div key={index} className="flex items-center gap-4 !p-4 border border-primary/20 bg-primary/5 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-100"></div>
                                        <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-xl flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            {ta.fullName ? ta.fullName[0].toUpperCase() : 'T'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-text-main truncate text-base">{ta.fullName}</h4>
                                            <div className="flex flex-col gap-1 text-sm text-text-muted !mt-1">
                                                <div className="flex items-center gap-2">
                                                    <Icon icon="material-symbols:mail-rounded" className="opacity-70 text-lg" />
                                                    <span className="truncate">{ta.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Icon icon="solar:verified-check-bold" className="opacity-70 text-lg text-green-500" />
                                                    {editingTaId === ta.taId ? (
                                                        <div className="flex items-center gap-2 flex-1 relative z-10">
                                                            <input 
                                                                type="text" 
                                                                value={editingPermission} 
                                                                onChange={(e) => setEditingPermission(e.target.value)}
                                                                className="flex-1 w-full bg-white border border-primary/40 rounded px-2 py-1 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-main shadow-inner"
                                                                autoFocus
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <button 
                                                                onClick={(e) => handleUpdateTaPermission(ta.taId, e)}
                                                                disabled={updatingTa}
                                                                className="p-1 min-w-[28px] flex items-center justify-center bg-green-500 text-white rounded hover:bg-green-600 transition-colors shadow shadow-green-500/30 disabled:opacity-50"
                                                                title="Lưu quyền"
                                                            >
                                                                <Icon icon={updatingTa ? "line-md:loading-loop" : "fa6-solid:check"} className="text-xs" />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setEditingTaId(null); }}
                                                                disabled={updatingTa}
                                                                className="p-1 min-w-[28px] flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow shadow-red-500/30 disabled:opacity-50"
                                                                title="Hủy bỏ"
                                                            >
                                                                <Icon icon="fa6-solid:xmark" className="text-xs" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="truncate flex-1 text-xs font-medium text-text-main">{ta.permission || 'Trợ giảng'}</span>
                                                            <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 shadow-sm bg-white rounded-md border border-border/50 p-0.5 relative z-10">
                                                                <button 
                                                                    onClick={(e) => handleEditTaClick(ta, e)}
                                                                    className="p-1 text-primary hover:bg-primary/20 rounded-md transition-all"
                                                                    title="Chỉnh sửa quyền trợ giảng"
                                                                >
                                                                    <Icon icon="solar:pen-new-round-bold-duotone" className="text-sm" />
                                                                </button>
                                                                <div className="w-[1px] h-3 bg-border"></div>
                                                                <button 
                                                                    onClick={(e) => handleOpenTaskModal(ta, e)}
                                                                    className="p-1 text-blue-500 hover:bg-blue-50 rounded-md transition-all"
                                                                    title="Giao việc cho TA này"
                                                                >
                                                                    <Icon icon="solar:clipboard-add-bold-duotone" className="text-sm" />
                                                                </button>
                                                                <div className="w-[1px] h-3 bg-border"></div>
                                                                <button 
                                                                    onClick={(e) => handleOpenViewTasks(ta, e)}
                                                                    className="p-1 text-orange-500 hover:bg-orange-50 rounded-md transition-all"
                                                                    title="Xem công việc đã giao"
                                                                >
                                                                    <Icon icon="solar:clipboard-list-bold-duotone" className="text-sm" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-orange-500 bg-orange-500/10 w-max !px-2 !py-0.5 rounded">
                                                    Lương: {ta.salaryPerSession.toLocaleString('vi-VN')} đ/buổi
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* KHU VỰC HỌC VIÊN */}
                    <div>
                        <h3 className="text-lg font-bold text-text-main !mb-4 flex items-center gap-2 border-b border-border pb-2">
                            <Icon icon="solar:users-group-rounded-bold-duotone" className="text-xl text-blue-500" />
                            Học viên chính thức ({members.length})
                        </h3>
                        {members.length === 0 ? (
                            <div className="text-center !py-12 border-2 border-dashed border-border rounded-xl">
                                <Icon icon="material-symbols:person-off-outline-rounded" className="text-5xl text-text-muted mx-auto !mb-3 opacity-50" />
                                <p className="text-text-muted">Chưa có học sinh nào được ghi danh vào lớp này.</p>
                            </div>
                        ) : (
                /* Danh sách thành viên xịn xò (Giả định UI) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {members.map((member, index) => (
                        <div key={index} className="flex items-center gap-4 !p-4 border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-background/50 group cursor-pointer relative overflow-hidden">
                            {/* Accent line */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
                            
                            {/* Avatar Tự động render bằng ký tự đầu của tên */}
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xl flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                {member.fullName ? member.fullName[0].toUpperCase() : 'U'}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-text-main truncate text-base">{member.fullName || 'Người dùng ẩn danh'}</h4>
                                
                                <div className="flex flex-col gap-1 text-sm text-text-muted !mt-2">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="material-symbols:mail-rounded" className="opacity-70 text-lg" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                    {member.parentName && (
                                        <div className="flex items-center gap-2 bg-surface !py-1 !px-2 rounded border border-border/50 w-max">
                                            <Icon icon="material-symbols:family-restroom-rounded" className="opacity-70 text-lg text-primary" />
                                            <span className="truncate text-xs font-semibold">Phụ huynh: {member.parentName} - {member.parentPhone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status / Role Label */}
                            {member.status && (
                                <span className={`text-[11px] font-bold !px-2.5 !py-1.5 rounded-lg uppercase tracking-wider whitespace-nowrap 
                                    ${member.status.toLowerCase() === 'active' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-600'}`}>
                                    {member.status}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                        )}
                    </div>
                </div>
            )}

            {/* ====== MODAL GIAO VIỆC (CREATE TASK) ====== */}
            {taskModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseTaskModal}></div>
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col animate-fade-in-up">
                        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-blue-50/50">
                            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                                <Icon icon="solar:clipboard-check-bold-duotone" className="text-2xl" />
                                Giao việc cho Trợ giảng
                            </h3>
                            <button onClick={handleCloseTaskModal} className="p-2 text-text-muted hover:bg-blue-100 hover:text-blue-800 rounded-xl transition-colors">
                                <Icon icon="material-symbols:close-rounded" className="text-xl" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitTask} className="p-6 flex flex-col gap-5">
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                                    {taskModal.ta?.fullName[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-blue-600/80 font-bold uppercase tracking-wider">Người nhận việc</p>
                                    <p className="text-base font-bold text-blue-900 truncate">{taskModal.ta?.fullName}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                                        Tiêu đề công việc <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ví dụ: Chấm bài tập Toán cao cấp..."
                                        value={taskData.title}
                                        onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                                        Loại hình <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={taskData.type}
                                        onChange={(e) => setTaskData({...taskData, type: e.target.value})}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Grading">Chấm bài (Grading)</option>
                                        <option value="Attendance">Điểm danh (Attendance)</option>
                                        <option value="Tutoring">Phụ đạo (Tutoring)</option>
                                        <option value="Material Prep">Chuẩn bị tài liệu (Material Prep)</option>
                                        <option value="Other">Khác (Other)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                                        Kỳ hạn (Deadline) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={taskData.dueDate}
                                        onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-text-main"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 justify-end border-t border-border mt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseTaskModal}
                                    className="px-5 py-2.5 font-bold text-text-muted hover:bg-background rounded-xl transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingTask || !taskData.title.trim() || !taskData.dueDate}
                                    className="px-6 py-2.5 bg-blue-600 text-white font-bold inline-flex items-center gap-2 rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                                >
                                    {submittingTask ? <Icon icon="line-md:loading-loop" className="text-xl" /> : <Icon icon="solar:round-transfer-diagonal-bold-duotone" className="text-xl" />}
                                    Chốt giao việc
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ====== MODAL XEM CÔNG VIỆC ĐÃ GIAO ====== */}
            {viewTasksModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseViewTasks}></div>
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative z-10 flex flex-col animate-fade-in-up max-h-[85vh] overflow-hidden">
                        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-orange-50/50">
                            <h3 className="text-xl font-bold text-orange-800 flex items-center gap-2">
                                <Icon icon="solar:clipboard-list-bold-duotone" className="text-2xl" />
                                Danh sách công việc của Trợ giảng
                            </h3>
                            <button onClick={handleCloseViewTasks} className="p-2 text-text-muted hover:bg-orange-100 hover:text-orange-800 rounded-xl transition-colors">
                                <Icon icon="material-symbols:close-rounded" className="text-xl" />
                            </button>
                        </div>
                        
                        <div className="bg-orange-50/30 px-6 py-4 border-b border-border flex items-center gap-3 w-full">
                            <div className="w-12 h-12 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center font-bold text-xl shadow-inner border border-white">
                                {viewTasksModal.ta?.fullName[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-orange-600/80 font-bold uppercase tracking-wider">Trợ giảng được phân công</p>
                                <p className="text-lg font-bold text-orange-900 truncate">{viewTasksModal.ta?.fullName}</p>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-surface scrollbar-hide">
                            {viewTasksModal.loading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Icon icon="line-md:loading-twotone-loop" className="text-5xl text-orange-500 mb-4 opacity-80" />
                                    <p className="text-text-muted font-bold text-sm">Đang tải danh sách công việc...</p>
                                </div>
                            ) : viewTasksModal.error ? (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <Icon icon="material-symbols:error-rounded" className="text-4xl mb-2" />
                                    <p className="font-bold">{viewTasksModal.error}</p>
                                </div>
                            ) : viewTasksModal.tasks.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-orange-200 rounded-3xl bg-orange-50/50">
                                    <div className="w-20 h-20 bg-orange-100 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon icon="solar:clipboard-remove-bold-duotone" className="text-4xl" />
                                    </div>
                                    <h4 className="text-lg font-bold text-orange-900 mb-1">Chưa có công việc nào</h4>
                                    <p className="text-orange-800/60 font-medium text-sm">Trợ giảng này hiện chưa được giao bất kỳ công việc nào trong lớp.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {viewTasksModal.tasks.map((task, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border/80 bg-white rounded-2xl hover:border-orange-300 hover:shadow-lg transition-all gap-4 group cursor-default relative overflow-hidden">
                                            {/* Line accent depending on status */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.status === 'Completed' ? 'bg-green-500' : task.status === 'Pending' ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                                            
                                            <div className="flex-1 pl-2">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-black text-orange-700 bg-orange-100 px-2.5 py-1 rounded-md uppercase tracking-widest border border-orange-200/50 shadow-sm">
                                                        {task.type || 'Chung'}
                                                    </span>
                                                    <h4 className="font-bold text-text-main text-base line-clamp-1">{task.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-muted font-medium bg-background w-max px-3 py-1.5 rounded-lg border border-border">
                                                    <Icon icon="solar:calendar-bold-duotone" className="text-lg text-primary/70" />
                                                    <span>Hạn chót: {new Date(task.dueDate).toLocaleString('vi-VN', {
                                                        hour: '2-digit', minute: '2-digit',
                                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end gap-2 pr-1">
                                                <span className={`px-4 py-1.5 font-bold text-xs rounded-xl shadow-sm border ${
                                                    task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                    task.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                                }`}>
                                                    <span className="flex items-center gap-1.5">
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            task.status === 'Completed' ? 'bg-green-500' : 
                                                            task.status === 'Pending' ? 'bg-yellow-500' : 
                                                            'bg-gray-500'
                                                        }`}></span>
                                                        {task.status || 'Chưa rõ'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassPeoplePage;
