export function buildFormFromMetadata(metadata: any, containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const form = document.createElement('form');
    form.className = 'bd-card';

    (metadata.formFields || []).forEach((f: any) => {
        const row = document.createElement('div');
        row.className = 'bd-form-row';

        const label = document.createElement('label');
        label.className = 'bd-label';
        label.innerText = f.label || f.fieldName;
        if (f.validation && f.validation.required) {
            label.innerHTML += ' <span style="color:var(--bd-danger)">*</span>';
        }

        const input = document.createElement('input');
        input.className = 'bd-input';
        input.name = f.fieldName;

        row.appendChild(label);
        row.appendChild(input);

        form.appendChild(row);
    });

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'flex-end';
    footer.style.gap = '8px';
    footer.style.marginTop = '12px';

    const cancel = document.createElement('button');
    cancel.className = 'bd-btn bd-btn--secondary';
    cancel.type = 'button';
    cancel.innerText = 'Cancel';

    const save = document.createElement('button');
    save.className = 'bd-btn bd-btn--primary';
    save.type = 'button';
    save.innerText = 'Save';

    footer.appendChild(cancel);
    footer.appendChild(save);
    form.appendChild(footer);

    container.appendChild(form);
}