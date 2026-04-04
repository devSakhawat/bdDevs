/**
 * Menu Management Module
 * Handles CRUD operations for Menu entity
 */

(function () {
    'use strict';

    // Configuration
    const API_BASE_URL = '/api/menu';
    let currentMenuId = null;
    let menuModal = null;

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        initializeModal();
        bindEvents();
        loadMenus();
    });

    /**
     * Initialize Bootstrap Modal
     */
    function initializeModal() {
        const modalElement = document.getElementById('menuModal');
        if (modalElement) {
            menuModal = new bootstrap.Modal(modalElement);
        }
    }

    /**
     * Bind all event handlers
     */
    function bindEvents() {
        // Add new menu button
        const btnAddMenu = document.getElementById('btnAddMenu');
        if (btnAddMenu) {
            btnAddMenu.addEventListener('click', showAddMenuForm);
        }

        // Save menu button
        const btnSaveMenu = document.getElementById('btnSaveMenu');
        if (btnSaveMenu) {
            btnSaveMenu.addEventListener('click', saveMenu);
        }

        // Form submit prevention
        const menuForm = document.getElementById('menuForm');
        if (menuForm) {
            menuForm.addEventListener('submit', function (e) {
                e.preventDefault();
            });
        }
    }

    /**
     * Load all menus from API
     */
    async function loadMenus() {
        try {
            showLoading();
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load menus');
            }

            const result = await response.json();
            displayMenus(result.data || []);
        } catch (error) {
            console.error('Error loading menus:', error);
            showToast('Error loading menus', 'error');
        } finally {
            hideLoading();
        }
    }

    /**
     * Display menus in table
     */
    function displayMenus(menus) {
        const tbody = document.getElementById('menuTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!menus || menus.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No menus found</td></tr>';
            return;
        }

        menus.forEach(menu => {
            const row = createMenuRow(menu);
            tbody.appendChild(row);
        });
    }

    /**
     * Create table row for a menu
     */
    function createMenuRow(menu) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${menu.menuId}</td>
            <td>${escapeHtml(menu.menuName)}</td>
            <td>${menu.moduleId}</td>
            <td>${menu.menuPath || '<em>N/A</em>'}</td>
            <td>${menu.parentMenu || '<em>Root</em>'}</td>
            <td>${menu.sororder || 0}</td>
            <td>
                <span class="badge ${menu.isActive === 1 ? 'bg-success' : 'bg-secondary'}">
                    ${menu.isActive === 1 ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="window.menuManagement.editMenu(${menu.menuId})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="window.menuManagement.deleteMenu(${menu.menuId}, '${escapeHtml(menu.menuName)}')" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        return tr;
    }

    /**
     * Show add menu form
     */
    function showAddMenuForm() {
        currentMenuId = null;
        document.getElementById('menuModalLabel').textContent = 'Add New Menu';
        document.getElementById('menuForm').reset();
        document.getElementById('menuId').value = '';
        document.getElementById('isActive').value = '1';
        menuModal.show();
    }

    /**
     * Edit menu
     */
    async function editMenu(menuId) {
        try {
            showLoading();
            const response = await fetch(`${API_BASE_URL}/${menuId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load menu details');
            }

            const result = await response.json();
            const menu = result.data;

            if (!menu) {
                throw new Error('Menu not found');
            }

            // Populate form
            currentMenuId = menu.menuId;
            document.getElementById('menuModalLabel').textContent = 'Edit Menu';
            document.getElementById('menuId').value = menu.menuId;
            document.getElementById('menuName').value = menu.menuName;
            document.getElementById('moduleId').value = menu.moduleId;
            document.getElementById('menuPath').value = menu.menuPath || '';
            document.getElementById('parentMenu').value = menu.parentMenu || '';
            document.getElementById('sororder').value = menu.sororder || 0;
            document.getElementById('todo').value = menu.todo || 0;
            document.getElementById('isActive').value = menu.isActive || 1;

            menuModal.show();
        } catch (error) {
            console.error('Error loading menu:', error);
            showToast('Error loading menu details', 'error');
        } finally {
            hideLoading();
        }
    }

    /**
     * Save menu (create or update)
     */
    async function saveMenu() {
        const form = document.getElementById('menuForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const menuData = {
            moduleId: parseInt(document.getElementById('moduleId').value),
            menuName: document.getElementById('menuName').value.trim(),
            menuPath: document.getElementById('menuPath').value.trim() || null,
            parentMenu: document.getElementById('parentMenu').value ? parseInt(document.getElementById('parentMenu').value) : null,
            sororder: parseInt(document.getElementById('sororder').value) || 0,
            todo: parseInt(document.getElementById('todo').value) || 0,
            isActive: parseInt(document.getElementById('isActive').value)
        };

        try {
            showLoading();

            let url = API_BASE_URL;
            let method = 'POST';

            if (currentMenuId) {
                // Update
                url = `${API_BASE_URL}/${currentMenuId}`;
                method = 'PUT';
                menuData.menuId = currentMenuId;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save menu');
            }

            showToast(currentMenuId ? 'Menu updated successfully' : 'Menu created successfully', 'success');
            menuModal.hide();
            loadMenus();
        } catch (error) {
            console.error('Error saving menu:', error);
            showToast(error.message || 'Error saving menu', 'error');
        } finally {
            hideLoading();
        }
    }

    /**
     * Delete menu
     */
    async function deleteMenu(menuId, menuName) {
        if (!confirm(`Are you sure you want to delete menu "${menuName}"?`)) {
            return;
        }

        try {
            showLoading();
            const response = await fetch(`${API_BASE_URL}/${menuId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete menu');
            }

            showToast('Menu deleted successfully', 'success');
            loadMenus();
        } catch (error) {
            console.error('Error deleting menu:', error);
            showToast('Error deleting menu', 'error');
        } finally {
            hideLoading();
        }
    }

    /**
     * Show loading indicator
     */
    function showLoading() {
        // Implement your loading indicator
        console.log('Loading...');
    }

    /**
     * Hide loading indicator
     */
    function hideLoading() {
        // Implement your loading indicator hide
        console.log('Loading complete');
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        // Use your existing toast notification system
        console.log(`[${type.toUpperCase()}] ${message}`);

        // Example: If you have a toast utility
        if (window.toast && typeof window.toast.show === 'function') {
            window.toast.show(message, type);
        } else {
            alert(message);
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Expose public methods
    window.menuManagement = {
        editMenu: editMenu,
        deleteMenu: deleteMenu,
        loadMenus: loadMenus
    };

})();
