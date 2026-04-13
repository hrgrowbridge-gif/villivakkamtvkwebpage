const loginSection = document.getElementById('loginSection');
const entriesSection = document.getElementById('entriesSection');
const entriesBody = document.getElementById('entriesBody');
const adminMessage = document.getElementById('adminMessage');
const logoutBtn = document.getElementById('logoutBtn');
const adminLogin = document.getElementById('adminLogin');

async function fetchEntries() {
  try {
    const response = await fetch('/api/admin/entries');
    if (!response.ok) {
      throw new Error('Not authorized');
    }
    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    return null;
  }
}

function renderEntries(entries) {
  entriesBody.innerHTML = entries.map(entry => `
    <tr>
      <td>${new Date(entry.createdAt).toLocaleString('en-IN')}</td>
      <td>${entry.name}</td>
      <td>${entry.area} / ${entry.ward}</td>
      <td>${entry.phone}</td>
      <td>${entry.email}</td>
      <td>${entry.issueType}</td>
      <td>${entry.issueDescription}</td>
      <td>${entry.filePath ? `<a href="${entry.filePath}" target="_blank">${entry.fileName || 'Download'}</a>` : '—'}</td>
      <td>
        <label class="status-toggle">
          <input type="checkbox" data-id="${entry.id}" ${entry.status === 'Completed' ? 'checked' : ''} />
          <span>${entry.status || 'Pending'}</span>
        </label>
      </td>
    </tr>
  `).join('');
}

entriesBody.addEventListener('change', async (event) => {
  const checkbox = event.target;
  if (checkbox.matches('input[type="checkbox"][data-id]')) {
    const id = checkbox.dataset.id;
    const status = checkbox.checked ? 'Completed' : 'Pending';

    try {
      const response = await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (!response.ok) {
        throw new Error('Unable to update status.');
      }

      checkbox.nextElementSibling.textContent = status;
    } catch (error) {
      checkbox.checked = !checkbox.checked;
      adminMessage.textContent = error.message;
    }
  }
});

async function loadAdminPage() {
  const entries = await fetchEntries();
  if (entries) {
    loginSection.classList.add('hidden');
    entriesSection.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    renderEntries(entries);
  } else {
    loginSection.classList.remove('hidden');
    entriesSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
  }
}

adminLogin.addEventListener('submit', async (event) => {
  event.preventDefault();
  adminMessage.textContent = '';
  const formData = new FormData(adminLogin);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    await loadAdminPage();
  } catch (error) {
    adminMessage.textContent = error.message;
  }
});

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/admin/logout', { method: 'POST' });
  loginSection.classList.remove('hidden');
  entriesSection.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  adminMessage.textContent = 'Logged out successfully.';
});

loadAdminPage();
