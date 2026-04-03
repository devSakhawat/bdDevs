/**
 * form-base.js - Reusable Form utilities
 *
 * Provides utility functions for form handling:
 * - Kendo Validator initialization
 * - Form data collection
 * - Server error display
 * - Double submit prevention
 * - Form reset
 * - Required field marking
 */

'use strict';

window.bdFormBase = (function () {

    /**
     * Initialize Kendo Validator on a form
     * @param {string|jQuery} formSelector - Form selector or jQuery object
     * @param {object} rules - Custom validation rules
     * @param {object} messages - Custom validation messages
     * @returns {kendo.ui.Validator} Validator instance
     */
    function initValidator(formSelector, rules, messages) {
        const form = $(formSelector);
        if (form.length === 0) {
            console.warn('[bdFormBase] Form not found:', formSelector);
            return null;
        }

        const validatorOptions = {
            rules: rules || {},
            messages: messages || {}
        };

        // Add common validation rules
        if (!validatorOptions.rules.emailFormat) {
            validatorOptions.rules.emailFormat = function (input) {
                if (input.is('[type=email]') && input.val() !== '') {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.val());
                }
                return true;
            };
            validatorOptions.messages.emailFormat = 'Please enter a valid email address';
        }

        if (!validatorOptions.rules.phoneFormat) {
            validatorOptions.rules.phoneFormat = function (input) {
                if (input.is('[data-validate=phone]') && input.val() !== '') {
                    return /^[\d\s\-\+\(\)]+$/.test(input.val());
                }
                return true;
            };
            validatorOptions.messages.phoneFormat = 'Please enter a valid phone number';
        }

        const validator = form.kendoValidator(validatorOptions).data('kendoValidator');
        return validator;
    }

    /**
     * Collect form data as an object
     * @param {string|jQuery} formSelector - Form selector or jQuery object
     * @returns {object} Form data as key-value pairs
     */
    function collectData(formSelector) {
        const form = $(formSelector);
        if (form.length === 0) {
            console.warn('[bdFormBase] Form not found:', formSelector);
            return {};
        }

        const data = {};
        const formArray = form.serializeArray();

        formArray.forEach(function (field) {
            // Handle multiple values for same name (checkboxes)
            if (data[field.name]) {
                if (!Array.isArray(data[field.name])) {
                    data[field.name] = [data[field.name]];
                }
                data[field.name].push(field.value);
            } else {
                data[field.name] = field.value;
            }
        });

        // Handle unchecked checkboxes
        form.find('input[type=checkbox]:not(:checked)').each(function () {
            const name = $(this).attr('name');
            if (name && !data[name]) {
                data[name] = false;
            }
        });

        return data;
    }

    /**
     * Display server validation errors
     * @param {object|Array} errors - Server validation errors
     * Format: { fieldName: ['error1', 'error2'] } or [{ field: 'fieldName', message: 'error' }]
     */
    function showServerErrors(errors) {
        if (!errors) {
            return;
        }

        // Clear existing errors
        $('.bd-form-error').remove();
        $('.bd-field-error').removeClass('bd-field-error');

        let errorList = [];

        // Convert to array format if object
        if (typeof errors === 'object' && !Array.isArray(errors)) {
            for (const field in errors) {
                const messages = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
                messages.forEach(function (message) {
                    errorList.push({ field: field, message: message });
                });
            }
        } else if (Array.isArray(errors)) {
            errorList = errors;
        }

        // Display errors
        errorList.forEach(function (error) {
            const field = $('[name="' + error.field + '"]');
            if (field.length > 0) {
                field.addClass('bd-field-error');
                field.after('<span class="bd-form-error">' + error.message + '</span>');
            } else {
                // Show general error if field not found
                if (window.bdNotify) {
                    window.bdNotify.error(error.message);
                }
            }
        });

        // Scroll to first error
        const firstError = $('.bd-field-error').first();
        if (firstError.length > 0) {
            firstError[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    /**
     * Prevent double form submission
     * @param {string|jQuery} buttonSelector - Submit button selector or jQuery object
     */
    function preventDoubleSubmit(buttonSelector) {
        const button = $(buttonSelector);
        if (button.length === 0) {
            return;
        }

        let isSubmitting = false;

        button.closest('form').on('submit', function (e) {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }

            isSubmitting = true;

            // Disable button and show loading state
            button.prop('disabled', true);
            const originalText = button.html();
            button.data('original-text', originalText);
            button.html('<span class="k-icon k-i-loading"></span> Processing...');

            // Re-enable after 5 seconds as failsafe
            setTimeout(function () {
                isSubmitting = false;
                button.prop('disabled', false);
                button.html(button.data('original-text'));
            }, 5000);
        });
    }

    /**
     * Reset form to initial state
     * @param {string|jQuery} formSelector - Form selector or jQuery object
     */
    function resetForm(formSelector) {
        const form = $(formSelector);
        if (form.length === 0) {
            console.warn('[bdFormBase] Form not found:', formSelector);
            return;
        }

        // Reset form fields
        form[0].reset();

        // Clear validation errors
        $('.bd-form-error').remove();
        $('.bd-field-error').removeClass('bd-field-error');

        // Reset Kendo widgets
        form.find('[data-role]').each(function () {
            const widget = $(this).data('kendoDropDownList') ||
                          $(this).data('kendoComboBox') ||
                          $(this).data('kendoDatePicker') ||
                          $(this).data('kendoNumericTextBox');
            if (widget && widget.value) {
                widget.value('');
            }
        });

        // Focus first input
        form.find('input, select, textarea').filter(':visible').first().focus();
    }

    /**
     * Mark fields as required
     * @param {Array<string>} fields - Array of field names to mark as required
     */
    function markAsRequired(fields) {
        if (!Array.isArray(fields)) {
            return;
        }

        fields.forEach(function (fieldName) {
            const field = $('[name="' + fieldName + '"]');
            if (field.length > 0) {
                field.attr('required', 'required');

                // Add asterisk to label
                const label = $('label[for="' + field.attr('id') + '"]');
                if (label.length > 0 && !label.hasClass('bd-required')) {
                    label.addClass('bd-required');
                }
            }
        });
    }

    /**
     * Clear all validation errors
     * @param {string|jQuery} formSelector - Form selector or jQuery object
     */
    function clearErrors(formSelector) {
        const form = $(formSelector);
        if (form.length === 0) {
            return;
        }

        form.find('.bd-form-error').remove();
        form.find('.bd-field-error').removeClass('bd-field-error');
    }

    // Public API
    return {
        initValidator: initValidator,
        collectData: collectData,
        showServerErrors: showServerErrors,
        preventDoubleSubmit: preventDoubleSubmit,
        resetForm: resetForm,
        markAsRequired: markAsRequired,
        clearErrors: clearErrors
    };

})();
