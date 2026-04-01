export function buildGridFromMetadata(metadata: any, containerId: string) {
    // skeleton implementation: create a table and columns
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'bd-card';

    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    (metadata.gridColumns || []).forEach((col: any) => {
        const th = document.createElement('th');
        th.style.width = col.widthPx ? col.widthPx + 'px' : 'auto';
        th.innerText = col.title || col.field;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    // sample empty state row
    const trEmpty = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = Math.max(1, (metadata.gridColumns || []).length);
    td.className = 'bd-grid-empty';
    td.innerText = 'No data to display';
    trEmpty.appendChild(td);
    tbody.appendChild(trEmpty);

    table.appendChild(tbody);
    container.appendChild(table);
}