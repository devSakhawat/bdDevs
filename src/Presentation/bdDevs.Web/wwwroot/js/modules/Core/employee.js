/**
 * Employee Module - Reference Implementation
 * Demonstrates the use of all core utilities (bdApi, bdGridBase, bdFormBase, bdPermissions, bdNotify, bdEvents)
 * This module serves as a template for implementing other modules in the application
 */

var bdEmployee = (function () {
    "use strict";

    // Private variables
    let grid = null;
    let validator = null;
    let isEditMode = false;
    let currentEmployeeId = null;
    let hasUnsavedChanges = false;

    /**
     * Initialize the employee module
     * Sets up grid, form, and event listeners
     */
    function init() {
        initializeGrid();
        initializeForm();
        initializeEventListeners();
        applyPermissions();
    }

    /**
     * Initialize Kendo Grid with configuration
     * Uses bdGridBase utility for common DataSource setup
     */
    function initializeGrid() {
        // Create DataSource using core utility
        const dataSource = bdGridBase.createDataSource({
            url: "/api/employees",
            pageSize: 20,
            schema: {
                data: "data",
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        id: { type: "number" },
                        employeeCode: { type: "string" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        email: { type: "string" },
                        phoneNumber: { type: "string" },
                        department: { type: "string" },
                        position: { type: "string" },
                        status: { type: "string" },
                        joinDate: { type: "date" },
                        salary: { type: "number" }
                    }
                }
            }
        });

        // Initialize Kendo Grid
        grid = $("#employeeGrid").kendoGrid({
            dataSource: dataSource,
            height: 600,
            sortable: true,
            filterable: false, // Using custom filter panel
            pageable: bdGridBase.getDefaultPageable(),
            columns: [
                {
                    field: "employeeCode",
                    title: "Employee Code",
                    width: 140
                },
                {
                    field: "firstName",
                    title: "First Name",
                    width: 150
                },
                {
                    field: "lastName",
                    title: "Last Name",
                    width: 150
                },
                {
                    field: "email",
                    title: "Email",
                    width: 220
                },
                {
                    field: "department",
                    title: "Department",
                    width: 150
                },
                {
                    field: "position",
                    title: "Position",
                    width: 150
                },
                {
                    field: "status",
                    title: "Status",
                    width: 120,
                    template: function (dataItem) {
                        const statusClass = dataItem.status === "Active" ? "success" : "inactive";
                        return `<span class="bd-status-badge bd-status-${statusClass}">${dataItem.status}</span>`;
                    }
                },
                {
                    title: "Actions",
                    width: 180,
                    template: function (dataItem) {
                        return `
                            <div class="bd-action-buttons">
                                <button class="bd-action-btn bd-action-view"
                                        data-permission="Employee:View"
                                        onclick="bdEmployee.viewEmployee(${dataItem.id})"
                                        title="View">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                                <button class="bd-action-btn bd-action-edit"
                                        data-permission="Employee:Edit"
                                        onclick="bdEmployee.editEmployee(${dataItem.id})"
                                        title="Edit">
                                    <i class="fa-solid fa-edit"></i>
                                </button>
                                <button class="bd-action-btn bd-action-delete"
                                        data-permission="Employee:Delete"
                                        onclick="bdEmployee.deleteEmployee(${dataItem.id})"
                                        title="Delete">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            dataBound: function (e) {
                // Apply row highlighting based on status
                bdGridBase.applyRowHighlight(grid.data("kendoGrid"), "status");

                // Apply permissions to action buttons
                bdPermissions.applyToElements();

                // Show/hide empty state
                toggleEmptyState();
            }
        }).data("kendoGrid");

        // Restore saved grid state if exists
        bdGridBase.restoreState("employee-grid", grid);
    }

    /**
     * Initialize form validation
     * Uses bdFormBase utility for Kendo Validator setup
     */
    function initializeForm() {
        // Initialize Kendo DatePickers
        $("#dateOfBirth").kendoDatePicker({
            format: "dd/MM/yyyy",
            max: new Date()
        });

        $("#joinDate").kendoDatePicker({
            format: "dd/MM/yyyy"
        });

        // Initialize form validator with custom rules
        validator = bdFormBase.initValidator("#employeeForm", {
            rules: {
                emailFormat: function (input) {
                    if (input.is("[name='email']")) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return emailRegex.test(input.val());
                    }
                    return true;
                },
                phoneFormat: function (input) {
                    if (input.is("[name='phoneNumber']")) {
                        const phoneRegex = /^[0-9+\-() ]{10,20}$/;
                        return phoneRegex.test(input.val());
                    }
                    return true;
                }
            },
            messages: {
                emailFormat: "Please enter a valid email address",
                phoneFormat: "Please enter a valid phone number"
            }
        });

        // Track unsaved changes
        $("#employeeForm").on("input change", function () {
            if (!hasUnsavedChanges) {
                hasUnsavedChanges = true;
            }
        });
    }

    /**
     * Initialize event listeners
     * Sets up module-level event subscriptions
     */
    function initializeEventListeners() {
        // Subscribe to global events using bdEvents
        bdEvents.subscribe("employee:created", onEmployeeCreated);
        bdEvents.subscribe("employee:updated", onEmployeeUpdated);
        bdEvents.subscribe("employee:deleted", onEmployeeDeleted);

        // Warn before leaving with unsaved changes
        window.addEventListener("beforeunload", function (e) {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
                return "You have unsaved changes. Are you sure you want to leave?";
            }
        });
    }

    /**
     * Apply permission-based UI restrictions
     * Uses bdPermissions utility
     */
    function applyPermissions() {
        bdPermissions.applyToElements();
    }

    /**
     * Show employee form for creating new employee
     * @param {string} mode - 'new' for create, 'edit' for update, 'view' for read-only
     */
    function showForm(mode) {
        isEditMode = mode === "edit";
        const isViewMode = mode === "view";

        // Reset form
        bdFormBase.resetForm("#employeeForm");
        bdFormBase.clearErrors("#employeeForm");
        hasUnsavedChanges = false;

        // Update modal title
        const titleMap = {
            new: "New Employee",
            edit: "Edit Employee",
            view: "View Employee"
        };
        $("#employeeModalTitle").html(`<i class="fa-solid fa-user me-2"></i>${titleMap[mode]}`);

        // Disable form fields in view mode
        if (isViewMode) {
            $("#employeeForm :input").prop("disabled", true);
            $("#btnSaveEmployee").hide();
        } else {
            $("#employeeForm :input").prop("disabled", false);
            $("#btnSaveEmployee").show();
        }

        // Switch to first tab
        switchTab("personal");

        // Show modal
        $("#employeeModalOverlay").fadeIn(200);
    }

    /**
     * Close employee form modal
     * Warns if there are unsaved changes
     */
    function closeForm() {
        if (hasUnsavedChanges) {
            if (!confirm("You have unsaved changes. Are you sure you want to close?")) {
                return;
            }
        }

        $("#employeeModalOverlay").fadeOut(200);
        currentEmployeeId = null;
        hasUnsavedChanges = false;
    }

    /**
     * Switch between form tabs
     * @param {string} tabName - Tab identifier (personal, contact, employment)
     */
    function switchTab(tabName) {
        // Remove active class from all tabs
        $(".bd-form-tab").removeClass("active");
        $(".bd-form-tab-content").removeClass("active").hide();

        // Add active class to selected tab
        $(`.bd-form-tab[data-tab="${tabName}"]`).addClass("active");
        $(`#tab-${tabName}`).addClass("active").fadeIn(200);
    }

    /**
     * Handle department change event
     * Populates position dropdown based on selected department (dependent field)
     */
    function onDepartmentChange() {
        const department = $("#department").val();
        const positionDropdown = $("#position");

        // Clear current options
        positionDropdown.empty().append('<option value="">Select position</option>');

        // Position options based on department
        const positionsByDept = {
            "IT": ["Software Engineer", "Senior Software Engineer", "Tech Lead", "Manager"],
            "HR": ["HR Executive", "HR Manager", "Recruiter", "Talent Acquisition"],
            "Finance": ["Accountant", "Senior Accountant", "Finance Manager", "CFO"],
            "Sales": ["Sales Executive", "Senior Sales Executive", "Sales Manager", "Director"],
            "Marketing": ["Marketing Executive", "Marketing Manager", "Brand Manager", "CMO"]
        };

        // Populate positions for selected department
        if (department && positionsByDept[department]) {
            positionsByDept[department].forEach(function (position) {
                positionDropdown.append(`<option value="${position}">${position}</option>`);
            });
        }
    }

    /**
     * View employee details
     * @param {number} id - Employee ID
     */
    function viewEmployee(id) {
        // Load employee data using bdApi
        bdApi.get(`/api/employees/${id}`)
            .then(function (response) {
                if (response.success) {
                    populateForm(response.data);
                    showForm("view");
                } else {
                    bdNotify.error(response.message || "Failed to load employee details");
                }
            })
            .catch(function (error) {
                bdNotify.error("Error loading employee details");
                console.error(error);
            });
    }

    /**
     * Edit employee record
     * @param {number} id - Employee ID
     */
    function editEmployee(id) {
        currentEmployeeId = id;

        // Load employee data using bdApi
        bdApi.get(`/api/employees/${id}`)
            .then(function (response) {
                if (response.success) {
                    populateForm(response.data);
                    showForm("edit");
                } else {
                    bdNotify.error(response.message || "Failed to load employee details");
                }
            })
            .catch(function (error) {
                bdNotify.error("Error loading employee details");
                console.error(error);
            });
    }

    /**
     * Populate form with employee data
     * @param {object} data - Employee data object
     */
    function populateForm(data) {
        $("#employeeId").val(data.id);
        $("#firstName").val(data.firstName);
        $("#lastName").val(data.lastName);
        $("#middleName").val(data.middleName);
        $("#dateOfBirth").data("kendoDatePicker").value(new Date(data.dateOfBirth));
        $("#gender").val(data.gender);
        $("#nationalId").val(data.nationalId);
        $("#passportNumber").val(data.passportNumber);
        $("#email").val(data.email);
        $("#phoneNumber").val(data.phoneNumber);
        $("#presentAddress").val(data.presentAddress);
        $("#permanentAddress").val(data.permanentAddress);
        $("#emergencyContactName").val(data.emergencyContactName);
        $("#emergencyContactPhone").val(data.emergencyContactPhone);
        $("#employeeCode").val(data.employeeCode);
        $("#joinDate").data("kendoDatePicker").value(new Date(data.joinDate));
        $("#department").val(data.department).trigger("change");

        // Wait for positions to load, then set position
        setTimeout(function () {
            $("#position").val(data.position);
        }, 100);

        $("#employmentType").val(data.employmentType);
        $("#status").val(data.status);
        $("#salary").val(data.salary);
        $("#reportingManagerId").val(data.reportingManagerId);
        $("#notes").val(data.notes);
    }

    /**
     * Save employee record (create or update)
     * Uses bdFormBase and bdApi utilities
     */
    function saveEmployee() {
        // Validate form
        if (!validator.validate()) {
            bdNotify.warning("Please fill in all required fields correctly");
            return;
        }

        // Prevent double submit
        bdFormBase.preventDoubleSubmit("#btnSaveEmployee");

        // Collect form data
        const formData = bdFormBase.collectData("#employeeForm");

        // Determine API endpoint and method
        const isUpdate = currentEmployeeId !== null;
        const apiCall = isUpdate
            ? bdApi.put(`/api/employees/${currentEmployeeId}`, formData)
            : bdApi.post("/api/employees", formData);

        // Save employee
        apiCall
            .then(function (response) {
                if (response.success) {
                    bdNotify.success(response.message || "Employee saved successfully");
                    hasUnsavedChanges = false;
                    closeForm();
                    refreshGrid();

                    // Publish event
                    const eventName = isUpdate ? "employee:updated" : "employee:created";
                    bdEvents.publish(eventName, response.data);
                } else {
                    bdNotify.error(response.message || "Failed to save employee");

                    // Show server validation errors if any
                    if (response.errors) {
                        bdFormBase.showServerErrors(response.errors);
                    }
                }
            })
            .catch(function (error) {
                bdNotify.error("Error saving employee");
                console.error(error);
            })
            .finally(function () {
                // Re-enable submit button
                $("#btnSaveEmployee").prop("disabled", false);
            });
    }

    /**
     * Delete employee record
     * @param {number} id - Employee ID
     */
    function deleteEmployee(id) {
        if (!confirm("Are you sure you want to delete this employee?")) {
            return;
        }

        // Delete using bdApi
        bdApi.delete(`/api/employees/${id}`)
            .then(function (response) {
                if (response.success) {
                    bdNotify.success(response.message || "Employee deleted successfully");
                    refreshGrid();

                    // Publish event
                    bdEvents.publish("employee:deleted", { id: id });
                } else {
                    bdNotify.error(response.message || "Failed to delete employee");
                }
            })
            .catch(function (error) {
                bdNotify.error("Error deleting employee");
                console.error(error);
            });
    }

    /**
     * Apply grid filters
     * Collects filter values and refreshes grid with filter parameters
     */
    function applyFilters() {
        const filters = {
            name: $("#filter-name").val(),
            email: $("#filter-email").val(),
            department: $("#filter-department").val(),
            status: $("#filter-status").val()
        };

        // Update grid DataSource with filters
        const dataSource = grid.dataSource;
        dataSource.transport.options.read.data = filters;
        dataSource.page(1); // Go to first page
    }

    /**
     * Clear all filters
     * Resets filter inputs and refreshes grid
     */
    function clearFilters() {
        $("#filter-name").val("");
        $("#filter-email").val("");
        $("#filter-department").val("");
        $("#filter-status").val("");

        // Refresh grid without filters
        const dataSource = grid.dataSource;
        dataSource.transport.options.read.data = {};
        dataSource.page(1);
    }

    /**
     * Refresh grid data
     * Reloads grid and saves current state
     */
    function refreshGrid() {
        if (grid) {
            grid.dataSource.read();
            bdGridBase.saveState("employee-grid", grid);
        }
    }

    /**
     * Export grid data to Excel
     * Uses Kendo Grid built-in export functionality
     */
    function exportToExcel() {
        if (grid) {
            grid.saveAsExcel();
        }
    }

    /**
     * Export grid data to PDF
     * Uses Kendo Grid built-in export functionality
     */
    function exportToPdf() {
        if (grid) {
            grid.saveAsPDF();
        }
    }

    /**
     * Toggle empty state visibility
     * Shows empty state when grid has no data
     */
    function toggleEmptyState() {
        const hasData = grid.dataSource.total() > 0;
        if (hasData) {
            $("#employeeGrid").show();
            $("#employeeEmptyState").hide();
        } else {
            $("#employeeGrid").hide();
            $("#employeeEmptyState").show();
        }
    }

    /**
     * Event handler: Employee created
     * @param {object} data - Created employee data
     */
    function onEmployeeCreated(data) {
        console.log("Employee created:", data);
        // Additional actions after employee creation
    }

    /**
     * Event handler: Employee updated
     * @param {object} data - Updated employee data
     */
    function onEmployeeUpdated(data) {
        console.log("Employee updated:", data);
        // Additional actions after employee update
    }

    /**
     * Event handler: Employee deleted
     * @param {object} data - Deleted employee data
     */
    function onEmployeeDeleted(data) {
        console.log("Employee deleted:", data);
        // Additional actions after employee deletion
    }

    /**
     * Toggle filter panel visibility
     */
    function toggleFilters() {
        const filterBody = $(".bd-filter-body");
        const toggleIcon = $(".bd-filter-toggle i");

        if (filterBody.is(":visible")) {
            filterBody.slideUp(200);
            toggleIcon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
        } else {
            filterBody.slideDown(200);
            toggleIcon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
        }
    }

    // Initialize module when document is ready
    $(document).ready(function () {
        init();
    });

    // Public API
    return {
        init: init,
        showForm: showForm,
        closeForm: closeForm,
        switchTab: switchTab,
        onDepartmentChange: onDepartmentChange,
        viewEmployee: viewEmployee,
        editEmployee: editEmployee,
        saveEmployee: saveEmployee,
        deleteEmployee: deleteEmployee,
        applyFilters: applyFilters,
        clearFilters: clearFilters,
        refreshGrid: refreshGrid,
        exportToExcel: exportToExcel,
        exportToPdf: exportToPdf
    };
})();

// Make toggleFilters globally accessible
function bdToggleFilters() {
    bdEmployee.toggleFilters ? bdEmployee.toggleFilters() : null;
}
