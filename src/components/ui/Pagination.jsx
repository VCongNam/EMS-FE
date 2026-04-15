import React from 'react';
import { Icon } from '@iconify/react';

/**
 * A premium Pagination component
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Number of items per page
 * @param {number} currentPage - Current active page (1-indexed)
 * @param {function} onPageChange - Callback when page changes
 */
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const delta = 1; // Number of pages to show around current page

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 !mt-12 !mb-6 px-2">
            <div className="text-sm text-text-muted font-medium order-2 sm:order-1">
                Hiển thị <span className="text-text-main font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-text-main font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> trong tổng số <span className="text-text-main font-bold">{totalItems}</span> lớp học
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-border !bg-surface text-text-main hover:!bg-primary/5 hover:border-primary/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
                    aria-label="Trang trước"
                >
                    <Icon icon="material-symbols:chevron-left-rounded" className="text-2xl group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <div className="flex items-center gap-1.5">
                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`dots-${index}`} className="w-10 text-center text-text-muted font-bold text-lg select-none">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`
                                    w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm
                                    ${currentPage === page 
                                        ? '!bg-primary text-white shadow-primary/20 scale-105' 
                                        : '!bg-surface text-text-main border border-border hover:border-primary/30 hover:!bg-primary/5 hover:text-primary'}
                                `}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-border !bg-surface text-text-main hover:!bg-primary/5 hover:border-primary/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm"
                    aria-label="Trang sau"
                >
                    <Icon icon="material-symbols:chevron-right-rounded" className="text-2xl group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
