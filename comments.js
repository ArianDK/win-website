// Custom Comment System
// Handles comment form submission, display, and pagination

(function() {
    'use strict';

    // Configuration
    const COMMENTS_PER_PAGE = 30;
    const API_BASE = '/api/comments';
    
    // State
    let currentPage = 1;
    let totalPages = 1;
    let turnstileWidgetId = null;
    
    // Get current page path (normalize to match database format)
    let currentPagePath = window.location.pathname;
    if (currentPagePath === '/index.html' || currentPagePath.endsWith('index.html')) {
        currentPagePath = '/';
    } else if (currentPagePath === '/about.html' || currentPagePath.endsWith('about.html')) {
        currentPagePath = '/about';
    } else if (!currentPagePath || currentPagePath === '/') {
        currentPagePath = '/';
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeCommentSystem();
    });

    function initializeCommentSystem() {
        // Initialize Turnstile
        if (window.turnstile) {
            turnstileWidgetId = window.turnstile.render('#turnstile-widget', {
                sitekey: getTurnstileSiteKey(),
                theme: 'light',
                size: 'normal'
            });
        }

        // Setup form
        const form = document.getElementById('comment-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }

        // Character counter
        const commentTextarea = document.getElementById('comment-text');
        const charCount = document.getElementById('char-count');
        if (commentTextarea && charCount) {
            commentTextarea.addEventListener('input', function() {
                charCount.textContent = this.value.length;
            });
        }

        // Load comments
        loadComments(currentPage);
    }

    function getTurnstileSiteKey() {
        // For local development, you can set this in a script tag or use a default
        // In production, this should come from environment or a config
        return window.TURNSTILE_SITE_KEY || '';
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('submit-btn');
        const formError = document.getElementById('form-error');
        const formSuccess = document.getElementById('form-success');
        
        // Get form values
        const name = document.getElementById('comment-name').value.trim();
        const comment = document.getElementById('comment-text').value.trim();
        
        // Validate
        if (!comment) {
            showError('Please enter a comment');
            return;
        }

        if (comment.length > 1000) {
            showError('Comment exceeds maximum length of 1000 characters');
            return;
        }

        // Get Turnstile token
        if (!window.turnstile || !turnstileWidgetId) {
            showError('Human verification not loaded. Please refresh the page.');
            return;
        }

        const turnstileToken = window.turnstile.getResponse(turnstileWidgetId);
        if (!turnstileToken) {
            showError('Please complete the human verification');
            return;
        }

        // Disable form
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
        hideError();
        hideSuccess();

        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: currentPagePath,
                    name: name || null,
                    comment: comment,
                    turnstileToken: turnstileToken
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to post comment');
            }

            // Success
            form.reset();
            document.getElementById('char-count').textContent = '0';
            
            // Reset Turnstile
            if (window.turnstile && turnstileWidgetId) {
                window.turnstile.reset(turnstileWidgetId);
            }

            // Show success message
            showSuccess('Comment posted successfully!');

            // Reload comments (go to page 1 to show new comment)
            currentPage = 1;
            await loadComments(1);

            // Scroll to comments
            const commentsSection = document.querySelector('.comments');
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        } catch (error) {
            console.error('Error posting comment:', error);
            showError(error.message || 'Failed to post comment. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Comment';
        }
    }

    async function loadComments(page) {
        const loadingEl = document.getElementById('comments-loading');
        const listEl = document.getElementById('comments-list');
        const emptyEl = document.getElementById('comments-empty');
        const paginationEl = document.getElementById('pagination');

        // Show loading
        if (loadingEl) loadingEl.style.display = 'block';
        if (listEl) listEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'none';
        if (paginationEl) paginationEl.style.display = 'none';

        try {
            const response = await fetch(`${API_BASE}?page=${encodeURIComponent(currentPagePath)}&pageNumber=${page}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load comments');
            }

            const { comments, pagination } = data;
            currentPage = pagination.currentPage;
            totalPages = pagination.totalPages;

            // Hide loading
            if (loadingEl) loadingEl.style.display = 'none';

            // Display comments
            if (comments.length === 0) {
                if (emptyEl) emptyEl.style.display = 'block';
            } else {
                if (listEl) {
                    listEl.innerHTML = comments.map(comment => renderComment(comment)).join('');
                    listEl.style.display = 'block';
                }
                if (emptyEl) emptyEl.style.display = 'none';
            }

            // Display pagination
            if (paginationEl && totalPages > 1) {
                paginationEl.innerHTML = renderPagination(pagination);
                paginationEl.style.display = 'flex';
            } else if (paginationEl) {
                paginationEl.style.display = 'none';
            }

        } catch (error) {
            console.error('Error loading comments:', error);
            if (loadingEl) {
                loadingEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to load comments. Please refresh the page.';
            }
        }
    }

    function renderComment(comment) {
        const name = comment.name || 'Anonymous';
        const date = formatDate(comment.created_at);
        const escapedComment = escapeHtml(comment.comment);
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(name)}</span>
                    <span class="comment-date">${date}</span>
                </div>
                <div class="comment-body">${escapedComment}</div>
            </div>
        `;
    }

    function renderPagination(pagination) {
        const { currentPage, totalPages, hasPrevious, hasNext } = pagination;
        
        let html = '<div class="pagination-controls">';
        
        // Previous button
        html += `<button class="pagination-btn" ${!hasPrevious ? 'disabled' : ''} onclick="window.commentSystem.goToPage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Previous
        </button>`;
        
        // Page indicator
        html += `<span class="pagination-info">Page ${currentPage} of ${totalPages}</span>`;
        
        // Next button
        html += `<button class="pagination-btn" ${!hasNext ? 'disabled' : ''} onclick="window.commentSystem.goToPage(${currentPage + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>`;
        
        html += '</div>';
        return html;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        
        // Format as date if older than a week
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showError(message) {
        const errorEl = document.getElementById('form-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function hideError() {
        const errorEl = document.getElementById('form-error');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }

    function showSuccess(message) {
        const successEl = document.getElementById('form-success');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
            setTimeout(() => {
                successEl.style.display = 'none';
            }, 5000);
        }
    }

    function hideSuccess() {
        const successEl = document.getElementById('form-success');
        if (successEl) {
            successEl.style.display = 'none';
        }
    }

    // Expose goToPage function globally for pagination buttons
    window.commentSystem = {
        goToPage: async function(page) {
            if (page < 1 || page > totalPages) return;
            currentPage = page;
            await loadComments(page);
            
            // Scroll to comments section
            const commentsSection = document.querySelector('.comments');
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

})();

