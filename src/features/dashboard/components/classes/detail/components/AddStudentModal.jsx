import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import Button from "../../../../../../components/ui/Button";

const AddStudentModal = ({ isOpen, onClose, onAdd }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    if (!isOpen) return null;

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        setHasSearched(true);
        
        // Mock search logic fetching from API
        setTimeout(() => {
            if (searchQuery.includes('STU') || searchQuery.includes('@')) {
                setSearchResult({
                    id: searchQuery.includes('STU') ? searchQuery : 'STU099',
                    name: 'Học viên tìm thấy',
                    email: searchQuery.includes('@') ? searchQuery : 'student@example.com',
                    phone: '0987654321',
                    status: 'active'
                });
            } else {
                setSearchResult(null);
            }
            setIsSearching(false);
        }, 600);
    };

    const handleAdd = () => {
        if (searchResult) {
            onAdd(searchResult);
            // Reset state
            setSearchQuery('');
            setSearchResult(null);
            setHasSearched(false);
            onClose();
        }
    };

    const inputClasses = "w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main hover:border-text-muted/30 placeholder:text-text-muted/50";

    return ReactDOM.createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
                <div
                    className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up pointer-events-auto flex flex-col relative custom-scrollbar"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border rounded-t-3xl shrink-0">
                        <div className="flex items-center !text-primary !gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Icon icon="solar:user-plus-bold-duotone" className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl !text-primary sm:text-2xl font-bold font-['Outfit']">Thêm học viên vào lớp</h2>
                                <p className="text-xs sm:text-sm text-text-muted mt-1">Tìm kiếm và thêm học viên đã có trên hệ thống</p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0"
                        >
                            <Icon icon="material-symbols:close-rounded" className="text-xl" />
                        </button>
                    </div>

                    <div className="!p-6 md:!p-8 !space-y-6 flex-1 flex flex-col relative">
                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="!space-y-4 shrink-0">
                            <label className="block text-sm font-semibold text-text-main">
                                Tìm kiếm học viên <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row !gap-3">
                                <div className="relative flex-1 group">
                                    <Icon icon="solar:rounded-magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Nhập Mã học sinh (STU...) hoặc Email..."
                                        className={inputClasses}
                                    />
                                </div>
                                <Button type="submit" variant="primary" className="!px-6 !text-primary shadow-primary/30 shadow-lg shrink-0 flex items-center justify-center min-w-[120px] w-full sm:w-auto" disabled={isSearching}>
                                    {isSearching ? (
                                        <Icon icon="solar:spinner-linear" className="animate-spin !text-primary text-xl text-white" />
                                    ) : (
                                        <>
                                            <Icon icon="solar:rounded-magnifer-bold-duotone" className="text-xl !mr-2 !text-primary text-white" />
                                            Tìm kiếm
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        {/* Search Results */}
                        <div className="flex-1 min-h-[200px] border border-border/50 rounded-2xl bg-background/50 !p-4">
                            {!hasSearched && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center !mb-3 border border-border">
                                        <Icon icon="solar:user-rounded-linear" className="text-3xl text-text-muted" />
                                    </div>
                                    <p className="text-text-muted text-sm max-w-[250px]">Nhập thông tin và nhấn Tìm kiếm để hiển thị kết quả.</p>
                                </div>
                            )}

                            {hasSearched && !isSearching && !searchResult && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-70 animate-fade-in">
                                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center !mb-3 border border-border">
                                        <Icon icon="solar:ghost-smile-bold-duotone" className="text-3xl text-text-muted" />
                                    </div>
                                    <p className="text-text-main font-semibold !mb-1">Không tìm thấy học viên</p>
                                    <p className="text-text-muted text-sm max-w-[250px]">Vui lòng kiểm tra lại Mã học sinh hoặc Email đã nhập.</p>
                                </div>
                            )}

                            {hasSearched && !isSearching && searchResult && (
                                <div className="h-full animate-fade-in flex flex-col">
                                    <h4 className="text-sm font-semibold text-text-muted !mb-3">Kết quả tìm kiếm:</h4>
                                    <div className="bg-surface border border-primary/30 rounded-xl !p-4 flex items-center justify-between shadow-sm shadow-primary/5">
                                        <div className="flex items-center !gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-lg uppercase shrink-0">
                                                {searchResult.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-main flex items-center !gap-2">
                                                    {searchResult.name}
                                                    <span className="text-xs font-mono text-text-muted bg-background !px-2 !py-0.5 rounded-md border border-border">{searchResult.id}</span>
                                                </h3>
                                                <div className="flex items-center !gap-3 !mt-1 text-sm text-text-muted">
                                                    <span className="flex items-center !gap-1.5"><Icon icon="solar:letter-linear" className="text-primary" /> {searchResult.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shrink-0 hidden sm:block">
                                            <span className="inline-flex items-center !px-2.5 !py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20">
                                                Khả dụng
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="!pt-6 border-t border-border flex flex-col-reverse sm:flex-row justify-end !gap-3 sm:!gap-4 w-full mt-auto shrink-0">
                            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto justify-center">
                                Hủy bỏ
                            </Button>
                            <Button 
                                type="button" 
                                variant="!primary" 
                                onClick={handleAdd}
                                disabled={!searchResult}
                                className="w-full sm:w-auto !p-3 justify-center shadow-primary/30 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Icon icon="solar:user-check-bold-duotone" className="text-xl text-primary !mr-2 group-not-disabled:group-hover:scale-110 transition-transform" />
                                Thêm vào lớp
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default AddStudentModal;
