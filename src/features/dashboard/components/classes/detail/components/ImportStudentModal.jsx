import React, { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../../../../components/ui/Button';
import { classService } from '../../../../api/classService';
import useAuthStore from '../../../../../../store/authStore';

const ImportStudentModal = ({ isOpen, onClose, onImportSuccess, classId }) => {
    const { user } = useAuthStore();
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [assignmentResults, setAssignmentResults] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); // 0: upload, 1: import_results, 2: assignment_results
    const [assignmentError, setAssignmentError] = useState(null);
    const fileInputRef = useRef(null);

    // Helper to map student info for easy lookup
    const studentMap = useMemo(() => {
        const map = new Map();
        if (results) {
            [...(results.newAccounts || []), ...(results.existedAccounts || [])].forEach(s => {
                map.set(s.studentId, s);
            });
        }
        return map;
    }, [results]);

    if (!isOpen) return null;

    const TEMPLATE_URL = "https://qsckptkshhighxnxrgzh.supabase.co/storage/v1/object/public/storage/templates/ImportFileForm.xlsx";

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.xlsx')) {
                toast.error("Vui lòng chọn file định dạng Excel (.xlsx)");
                return;
            }
            setFile(selectedFile);
            setResults(null);
            setAssignmentResults(null);
            setAssignmentError(null);
            setCurrentStep(0);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsLoading(true);
        try {
            const res = await classService.importStudentsExcel(classId, file, user?.token);
            const data = await res.json();
            
            if (res.ok) {
                setResults(data);
                setCurrentStep(1); // Chuyển sang màn hình kết quả tạo tài khoản
                toast.success(`Khởi tạo tài khoản thành công!`);
            } else {
                toast.error(data.message || "Đã xảy ra lỗi khi upload file.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi kết nối máy chủ.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!results) return;
        setIsLoading(true);
        setAssignmentError(null);
        try {
            const allStudentIds = [
                ...(results.newAccounts || []).map(a => a.studentId),
                ...(results.existedAccounts || []).map(a => a.studentId)
            ].filter(id => !!id);

            if (allStudentIds.length === 0) {
                toast.warning("Không tìm thấy học sinh để gán vào lớp.");
                setIsLoading(false);
                return;
            }

            const assignRes = await classService.assignMultipleStudents(classId, allStudentIds, user?.token);
            
            if (assignRes.ok) {
                const assignData = await assignRes.json();
                setAssignmentResults(assignData);
                setCurrentStep(2); // Chuyển sang màn hình kết quả gán lớp
                toast.success(`Gán học sinh vào lớp thành công!`);
                if (onImportSuccess) onImportSuccess();
            } else {
                setAssignmentError("Không thể gán học sinh vào lớp. Có thể do lớp đã đạt sĩ số tối đa.");
                toast.error("Thêm học sinh vào lớp thất bại. Vui lòng kiểm tra lại sĩ số!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi hệ thống khi gán lớp.");
        } finally {
            setIsLoading(false);
        }
    };

    const downloadReport = () => {
        if (!results?.base64ExcelReport) return;
        
        try {
            const base64Data = results.base64ExcelReport;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Import_Report_${new Date().getTime()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download Error:", error);
            toast.error("Không thể tải xuống file kết quả.");
        }
    };

    const resetModal = () => {
        setFile(null);
        setResults(null);
        setAssignmentResults(null);
        setAssignmentError(null);
        setCurrentStep(0);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Added': return <span className="!px-2 !py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Đã thêm mới</span>;
            case 'Restored': return <span className="!px-2 !py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Đã khôi phục</span>;
            case 'AlreadyExists': return <span className="!px-2 !py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">Đã ở trong lớp</span>;
            case 'Failed': return <span className="!px-2 !py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">Thất bại</span>;
            default: return null;
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-3xl bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
                {/* Header */}
                <div className="!px-8 !py-6 border-b border-border/50 flex items-center justify-between bg-background/50">
                    <div className="flex items-center !gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                            <Icon icon={currentStep === 2 ? "solar:user-check-bold-duotone" : "solar:document-add-bold-duotone"} className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-main">
                                {currentStep === 0 && "Thêm học sinh bằng danh sách"}
                                {currentStep === 1 && "Kết quả khởi tạo tài khoản"}
                                {currentStep === 2 && "Kết quả thêm vào lớp học"}
                            </h2>
                            <p className="text-sm text-text-muted font-medium">
                                {currentStep === 0 && "Sử dụng file Excel để thêm nhanh nhiều học sinh"}
                                {currentStep === 1 && "Kiểm tra danh sách tài khoản đã được tạo/kiểm tra"}
                                {currentStep === 2 && "Dữ liệu trạng thái tham gia lớp học của từng học sinh"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-background hover:bg-danger/10 hover:text-danger text-text-muted transition-all">
                        <Icon icon="solar:close-circle-bold" className="text-2xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-8 overflow-y-auto space-y-8 custom-scrollbar">
                    {/* Step 0: Upload View */}
                    {currentStep === 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-text-main !mb-0">Tải lên tệp danh sách</h3>
                                <a href={TEMPLATE_URL} target="_blank" rel="noreferrer" className="flex items-center !gap-2 text-sm font-bold text-primary hover:underline">
                                    <Icon icon="solar:download-square-bold-duotone" className="text-lg" />
                                    Tải file mẫu (.xlsx)
                                </a>
                            </div>

                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`group border-2 border-dashed rounded-[2rem] !p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                }`}
                            >
                                <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx" onChange={handleFileChange} />
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center !mb-4 transition-all shadow-lg ${
                                    file ? 'bg-primary text-white scale-110' : 'bg-background text-text-muted'
                                }`}>
                                    <Icon icon={file ? "solar:file-check-bold-duotone" : "solar:file-send-bold-duotone"} className="text-4xl" />
                                </div>
                                <p className="font-bold text-text-main text-lg">{file ? file.name : 'Nhấp hoặc Kéo thả tệp vào đây'}</p>
                                <p className="text-sm text-text-muted !mt-1">Hỗ trợ định dạng: .xlsx</p>
                                
                                {file && (
                                    <Button onClick={(e) => { e.stopPropagation(); handleUpload(); }} isLoading={isLoading} className="!mt-8 !px-12 !py-4 rounded-2xl">
                                        Tiếp tục (Import tài khoản)
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 1: Import Results */}
                    {currentStep === 1 && results && (
                        <div className="space-y-6 animate-scale-up">
                            {assignmentError && (
                                <div className="!p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center !gap-3 font-bold text-sm">
                                    <Icon icon="solar:danger-bold-duotone" className="text-xl" />
                                    {assignmentError}
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 !gap-4">
                                <div className="!p-4 bg-background border border-border rounded-2xl text-center">
                                    <p className="text-[10px] font-bold text-text-muted uppercase !mb-1">Tổng cộng</p>
                                    <p className="text-2xl font-black">{results.totalRows || 0}</p>
                                </div>
                                <div className="!p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-center">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase !mb-1">Tài khoản mới</p>
                                    <p className="text-2xl font-black text-blue-600">{results.newAccounts?.length || 0}</p>
                                </div>
                                <div className="!p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-center">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase !mb-1">Đã tồn tại</p>
                                    <p className="text-2xl font-black text-emerald-600">{results.existedAccounts?.length || 0}</p>
                                </div>
                                <div className="!p-4 bg-danger/5 border border-danger/20 rounded-2xl text-center">
                                    <p className="text-[10px] font-bold text-danger uppercase !mb-1">Thất bại</p>
                                    <p className="text-2xl font-black text-danger">{results.errorList?.length || 0}</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-text-main text-sm">Chi tiết tài khoản Import</h4>
                                    {results.base64ExcelReport && (
                                        <button onClick={downloadReport} className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline">
                                            <Icon icon="solar:download-square-linear" /> Tải báo cáo Excel
                                        </button>
                                    )}
                                </div>

                                {/* Section 1: Tài khoản mới */}
                                {results.newAccounts?.length > 0 && (
                                    <div>
                                        <div className="flex items-center !gap-2 !mb-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"/>
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                                Tài khoản mới ({results.newAccounts.length})
                                            </p>
                                        </div>
                                        <div className="border border-blue-200 rounded-2xl overflow-hidden bg-blue-50/30">
                                            {results.newAccounts.map((acc, idx) => (
                                                <div key={idx} className="!px-4 !py-3 border-b border-blue-100 last:border-0 flex items-center justify-between hover:bg-blue-50/60 transition-colors">
                                                    <div className="flex items-center !gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                                            {acc.fullName?.charAt(0) || "S"}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold truncate text-text-main">{acc.fullName}</p>
                                                            <p className="text-xs text-text-muted truncate">{acc.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center !gap-2 shrink-0">
                                                        {acc.password && (
                                                            <span className="text-[10px] font-mono bg-white border border-blue-200 text-blue-700 !px-2 !py-0.5 rounded">
                                                                MK: {acc.password}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 !px-2 !py-0.5 rounded-full">
                                                            Mới
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Section 2: Tài khoản đã tồn tại */}
                                {results.existedAccounts?.length > 0 && (
                                    <div>
                                        <div className="flex items-center !gap-2 !mb-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"/>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                                Đã tồn tại ({results.existedAccounts.length})
                                            </p>
                                        </div>
                                        <div className="border border-emerald-200 rounded-2xl overflow-hidden bg-emerald-50/30">
                                            {results.existedAccounts.map((acc, idx) => (
                                                <div key={idx} className="!px-4 !py-3 border-b border-emerald-100 last:border-0 flex items-center justify-between hover:bg-emerald-50/60 transition-colors">
                                                    <div className="flex items-center !gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                                            {acc.fullName?.charAt(0) || "S"}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold truncate text-text-main">{acc.fullName}</p>
                                                            <p className="text-xs text-text-muted truncate">{acc.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 !px-2 !py-0.5 rounded-full shrink-0">
                                                        Đã tồn tại
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Section 3: Thất bại */}
                                {results.errorList?.length > 0 && (
                                    <div>
                                        <div className="flex items-center !gap-2 !mb-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500"/>
                                            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
                                                Thất bại ({results.errorList.length})
                                            </p>
                                        </div>
                                        <div className="border border-red-200 rounded-2xl overflow-hidden bg-red-50/30">
                                            {results.errorList.map((err, idx) => (
                                                <div key={idx} className="!px-4 !py-3 border-b border-red-100 last:border-0 flex items-center justify-between hover:bg-red-50/60 transition-colors">
                                                    <div className="flex items-center !gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                            <Icon icon="solar:close-circle-bold-duotone" className="text-lg" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold truncate text-text-main">{err.studentName}</p>
                                                            <p className="text-xs text-red-500 truncate">{err.errorMessage}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-text-muted shrink-0">
                                                        Dòng {err.rowNumber}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Assignment Results */}
                    {currentStep === 2 && assignmentResults && (
                        <div className="space-y-6 animate-scale-up">
                            <div className="flex items-center !gap-3 !p-5 bg-emerald-50 text-emerald-700 rounded-3xl border border-emerald-100">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Icon icon="solar:check-circle-bold" className="text-2xl" />
                                </div>
                                <div>
                                    <p className="font-bold">Đã xử lý gán học sinh vào lớp!</p>
                                    <p className="text-xs opacity-80">Thành công: {assignmentResults.successCount} | Đã có trong lớp: {assignmentResults.existedCount}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-text-main text-sm">Trạng thái gán lớp chi tiết</h4>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar border border-border rounded-2xl shadow-inner bg-background/30">
                                    {assignmentResults.details.map((item, idx) => {
                                        const s = studentMap.get(item.studentId);
                                        return (
                                            <div key={idx} className="!p-4 border-b border-border last:border-0 flex items-center justify-between hover:bg-white transition-all">
                                                <div className="flex items-center !gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center font-bold text-primary">{s?.fullName?.charAt(0) || 'S'}</div>
                                                    <div>
                                                        <p className="text-[14px] font-bold">{s?.fullName || 'Học sinh #' + idx}</p>
                                                        <p className="text-xs text-text-muted">{item.message}</p>
                                                    </div>
                                                </div>
                                                <div>{getStatusBadge(item.status)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="!px-8 !py-6 border-t border-border/50 bg-background/50 flex items-center justify-end !gap-4">
                    {currentStep === 1 && (
                        <>
                            <Button variant="outline" onClick={resetModal} className="!px-8 !rounded-xl">Thêm học sinh</Button>
                            <Button onClick={handleAssign} isLoading={isLoading} className="!px-8 !rounded-xl font-bold bg-primary shadow-premium-primary">
                                Thêm vào lớp
                            </Button>
                        </>
                    )}
                    {currentStep === 2 && (
                        <Button onClick={onClose} className="!px-12 !rounded-xl font-bold">Đóng</Button>
                    )}
                    {currentStep === 0 && (
                        <Button variant="outline" onClick={onClose} className="!px-8 !rounded-xl">Hủy bỏ</Button>
                    )}
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center !p-8 animate-fade-in text-center">
                        <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <h4 className="!mt-6 text-xl font-bold text-primary">Đang xử lý...</h4>
                        <p className="text-sm text-text-muted !mt-2">Vui lòng không đóng cửa sổ này.</p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ImportStudentModal;
