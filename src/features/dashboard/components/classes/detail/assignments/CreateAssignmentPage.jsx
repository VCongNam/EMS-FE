import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignmentService } from '../../../../api/assignmentService';
import { gradebookService } from '../../../../api/gradebookService';
import useAuthStore from '../../../../../../store/authStore';
import { toast } from 'react-toastify';

const CreateAssignmentPage = () => {
    const navigate = useNavigate();
    const { classId, assignmentId } = useParams();
    const isEditMode = !!assignmentId;
    const { user } = useAuthStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [gradeCategoryId, setGradeCategoryId] = useState(''); 
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [allowLateSubmission, setAllowLateSubmission] = useState(true);
    const [attachments, setAttachments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!classId) return;
            try {
                setIsLoadingCategories(true);
                const res = await gradebookService.getGradeCategories(classId, user?.token);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                    // Nếu không phải chế độ edit, mặc định lấy hạng mục đầu tiên
                    if (!isEditMode && data.length > 0 && !gradeCategoryId) {
                        setGradeCategoryId(data[0].id || data[0].gradeCategoryId);
                    }
                }
            } catch (error) {
                console.error("Lỗi lấy danh mục điểm:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        
        fetchCategories();
    }, [classId, user?.token, isEditMode]);

    useEffect(() => {
        const fetchAssignmentInfo = async () => {
            if (isEditMode) {
                try {
                    const res = await assignmentService.getAssignmentById(assignmentId, user?.token);
                    if (res.ok) {
                        const data = await res.json();
                        setTitle(data.title || '');
                        setDescription(data.description || '');
                        if (data.gradeCategoryId) setGradeCategoryId(data.gradeCategoryId);
                        
                        if (data.dueDate) {
                            // C# trả về ISO date string e.g. "2026-05-10T00:00:00"
                            const d = new Date(data.dueDate);
                            if (!isNaN(d)) {
                                setDueDate(d.toISOString().split('T')[0]); // YYYY-MM-DD
                                setDueTime(d.toTimeString().slice(0, 5)); // HH:MM
                            }
                        }
                        
                        // Parse true/false properly
                        setAllowLateSubmission(data.allowLateSubmission === true || data.allowLateSubmission === 'True');
                        
                        // Nếu backend có trả về attachments cũ
                        if (Array.isArray(data.attachments)) {
                            // Cần ánh xạ attachments cũ này thành danh sách chỉ để hiển thị. 
                            const oldAtts = data.attachments.map(att => ({
                                id: att.id || Math.random().toString(36),
                                name: att.fileName || att.name || 'Tệp đính kèm',
                                size: '...',
                                type: 'other',
                                isOldDbFile: true // Cờ xác định tệp cũ (không có File object)
                            }));
                            setAttachments(oldAtts);
                        }
                    }
                } catch (error) {
                    console.error("Lỗi lấy thông tin bài tập:", error);
                }
            }
        };
        fetchAssignmentInfo();
    }, [isEditMode, assignmentId, user?.token]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newAttachments = files.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file: file, // Giữ lại bản cứng File Object để append
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: file.type.includes('image') ? 'image'
                    : file.name.endsWith('.pdf') ? 'pdf'
                    : file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc'
                    : file.type.includes('video') ? 'video' : 'other',
            }));
            setAttachments([...attachments, ...newAttachments]);
        }
        e.target.value = null;
    };

    const removeAttachment = (id) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    const handleCreate = async () => {
        if (!title.trim() || !dueDate) {
            toast.warning('Vui lòng nhập đầy đủ Tiêu đề và Hạn nộp');
            return;
        }

        setIsSubmitting(true);
        const token = user?.token;

        try {
            const formData = new FormData();
            formData.append('GradeCategoryId', gradeCategoryId);
            formData.append('Title', title);
            formData.append('Description', description || '');
            
            // Tạm thời fix cứng định dạng ngày giống hệt Hoppscotch (YYYY-MM-DD)
            formData.append('DueDate', dueDate);
            
            // Ép kiểu chữ True in hoa đầu giống Hoppscotch
            const allowLateStr = allowLateSubmission ? "True" : "False";
            formData.append('AllowLateSubmission', allowLateStr);

            // Append each file object individually
            // Lúc Edit thì backend yêu cầu key là 'NewAttachments'
            attachments.forEach(att => {
                if (att.file) {
                    if (isEditMode) {
                        formData.append('NewAttachments', att.file);
                    } else {
                        formData.append('Attachments', att.file);
                    }
                }
            });

            let res;
            if (isEditMode) {
                res = await assignmentService.updateAssignment(assignmentId, formData, token);
            } else {
                formData.append('ClassId', classId);
                res = await assignmentService.createAssignment(formData, token);
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Không thể lưu bài tập, kiểm tra lại dữ liệu');
            }

            toast.success(isEditMode ? 'Cập nhật bài tập thành công!' : 'Giao bài tập thành công!');
            navigate(`../classwork`, { relative: 'path' });

        } catch (error) {
            console.error('Lỗi tạo bài tập:', error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto animate-fade-in-up !pb-8">

            {/* Header */}
            <div className="flex bg-surface rounded-2xl border border-border !p-4 sm:!p-6 shadow-sm items-center gap-3 border-b-2 border-primary/20 !mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-hover text-text-muted transition-colors shrink-0"
                >
                    <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                </button>
                <Icon icon={isEditMode ? "material-symbols:edit-document-outline-rounded" : "material-symbols:assignment-add-outline-rounded"} className="text-2xl sm:text-3xl text-primary shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-text-main">{isEditMode ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}</h2>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left — Main Form */}
                <div className="md:col-span-2 space-y-6">

                    {/* Title + Description */}
                    <div className="bg-surface rounded-2xl border border-border !p-5 sm:!p-6 shadow-sm space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tiêu đề"
                            required
                            className="w-full bg-background border border-border rounded-xl !p-4 font-semibold text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-main"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Hướng dẫn (không bắt buộc)"
                            className="w-full bg-background border border-border rounded-xl !p-4 min-h-[150px] resize-y focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-main"
                        />
                    </div>

                    {/* Attachments */}
                    <div className="bg-surface rounded-2xl border border-border !p-5 sm:!p-6 shadow-sm">
                        <h4 className="font-semibold text-text-main !mb-4">Tệp đính kèm</h4>

                        {attachments.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 !mb-4">
                                {attachments.map(att => (
                                    <div key={att.id} className="flex items-center justify-between bg-background border border-border rounded-xl !p-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center shrink-0">
                                                <Icon
                                                    icon={
                                                        att.type === 'pdf' ? 'vscode-icons:file-type-pdf2' :
                                                        att.type === 'doc' ? 'vscode-icons:file-type-word' :
                                                        'material-symbols:insert-drive-file'
                                                    }
                                                    className="text-2xl"
                                                />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-text-main truncate">{att.name}</p>
                                                <p className="text-xs text-text-muted">{att.size}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeAttachment(att.id)}
                                            className="!p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                                        >
                                            <Icon icon="material-symbols:close-rounded" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center gap-2 border-2 border-dashed border-primary/50 text-primary font-semibold rounded-xl !p-3 hover:bg-primary/5 hover:border-primary transition-all w-full"
                        >
                            <Icon icon="material-symbols:upload-file-outline-rounded" className="text-xl" />
                            Đính kèm tệp
                        </button>
                    </div>
                </div>

                {/* Right — Settings */}
                <div className="md:col-span-1">
                    <div className="bg-surface rounded-2xl border border-border !p-5 sm:!p-6 shadow-sm space-y-5">

                        {/* Thay "Thang Điểm" đi, thay bằng GradeCategoryId loại điểm */}
                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Loại điểm (Grade Category)</label>
                            <select
                                value={gradeCategoryId}
                                onChange={(e) => setGradeCategoryId(e.target.value)}
                                disabled={isLoadingCategories}
                                className="w-full bg-background border border-border rounded-xl !p-3 focus:outline-none focus:border-primary text-text-main disabled:opacity-50"
                            >
                                {isLoadingCategories ? (
                                    <option>Đang tải hạng mục...</option>
                                ) : categories.length === 0 ? (
                                    <option value="">Không có hạng mục điểm</option>
                                ) : (
                                    categories.map(cat => (
                                        <option key={cat.id || cat.gradeCategoryId} value={cat.id || cat.gradeCategoryId}>
                                            {cat.name} ({cat.weight}%)
                                        </option>
                                    ))
                                )}
                            </select>
                            {categories.length === 0 && !isLoadingCategories && (
                                <p className="text-[10px] text-destructive mt-1 italic">
                                    Lưu ý: Lớp học chưa có hạng mục điểm nào. Hãy vào tab Cài đặt để cấu hình.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Hạn nộp</label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    required
                                    className="flex-1 min-w-0 bg-background border border-border rounded-xl !p-3 focus:outline-none focus:border-primary text-text-main"
                                />
                                <input
                                    type="time"
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                    className="w-[110px] shrink-0 bg-background border border-border rounded-xl !p-3 focus:outline-none focus:border-primary text-text-main"
                                />
                            </div>
                        </div>

                        {/* Thay "Chủ đề" bằng "Cho phép nộp muộn" cờ boolean */}
                        <div className="flex items-center justify-between !mt-4 border-t border-border !pt-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-main">Cho phép nộp muộn</label>
                                <span className="text-xs text-text-muted">Học viên vẫn có thể nộp sau hạn</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={allowLateSubmission}
                                    onChange={(e) => setAllowLateSubmission(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="!mt-6 rounded-2xl !p-4 sm:!p-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sticky bottom-4 z-10 bg-surface/80 backdrop-blur border border-border shadow-md">
                <button
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto !px-6 !py-2.5 text-sm font-semibold text-text-muted border border-border rounded-xl hover:bg-background hover:text-text-main transition-all disabled:opacity-50"
                >
                    Hủy
                </button>
                <button
                    onClick={handleCreate}
                    disabled={!title.trim() || !dueDate || isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 !bg-primary text-white font-bold !px-8 !py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                >
                    {isSubmitting ? (
                        <Icon icon="solar:spinner-linear" className="animate-spin text-xl text-white mr-2" />
                    ) : (
                        <Icon icon={isEditMode ? "material-symbols:save-rounded" : "material-symbols:assignment-turned-in-rounded"} className="text-lg" />
                    )}
                    {isEditMode ? 'Lưu thay đổi' : 'Giao bài'}
                </button>
            </div>
        </div>
    );
};

export default CreateAssignmentPage;