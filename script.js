// Lấy và lưu chế độ xưng hô từ localStorage
function loadModes() {
  let modes = JSON.parse(localStorage.getItem('modes')) || ['Mặc định'];
  if (!modes.includes('Mặc định')) modes.unshift('Mặc định'); // Đảm bảo "Mặc định" luôn có
  const select = document.getElementById('modeSelect');
  select.innerHTML = '';
  modes.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode;
    option.textContent = mode;
    if (mode === 'Mặc định') option.disabled = true; // Không cho xóa "Mặc định"
    select.appendChild(option);
  });
  return modes;
}

function saveModes(modes) {
  localStorage.setItem('modes', JSON.stringify(modes));
}

let modes = loadModes();
document.getElementById('modeSelect').value = 'Mặc định';

// Biến lưu nội dung tạm thời để không mất khi chuyển chế độ
let currentModeText = '';

// Cập nhật nội dung ô xưng hô khi thay đổi chế độ (chỉ đọc)
document.getElementById('modeSelect').addEventListener('change', () => {
  const mode = document.getElementById('modeSelect').value;
  const savedText = localStorage.getItem(mode) || '';
  document.getElementById('modeText').value = savedText; // Hiển thị nội dung lưu
  document.getElementById('editText').value = ''; // Xóa nội dung chỉnh sửa khi chuyển
  document.getElementById('modeDetail').style.display = 'block'; // Mở chế độ xem
  document.getElementById('editDetail').style.display = 'none'; // Ẩn chế độ chỉnh sửa
});

// Xử lý các nút chế độ
document.getElementById('addMode').addEventListener('click', () => {
  const newMode = prompt('Nhập tên chế độ xưng hô mới:');
  if (newMode && !modes.includes(newMode)) {
    modes.push(newMode);
    saveModes(modes);
    loadModes();
    document.getElementById('modeSelect').value = newMode;
    document.getElementById('modeDetail').style.display = 'block';
    document.getElementById('modeText').value = localStorage.getItem(newMode) || '';
    Toastify({
      text: 'Đã thêm chế độ mới!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#1A5D1A',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  } else if (newMode) {
    Toastify({
      text: 'Chế độ đã tồn tại!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#DC3545',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  }
});

document.getElementById('removeMode').addEventListener('click', () => {
  const select = document.getElementById('modeSelect');
  const mode = select.value;
  if (modes.length > 1 && mode !== 'Mặc định' && confirm(`Xác nhận xóa chế độ "${mode}"?`)) {
    modes = modes.filter(m => m !== mode);
    localStorage.removeItem(mode);
    saveModes(modes);
    loadModes();
    document.getElementById('modeDetail').style.display = 'none';
    document.getElementById('editDetail').style.display = 'none';
    document.getElementById('modeText').value = '';
    document.getElementById('editText').value = '';
    Toastify({
      text: 'Đã xóa chế độ!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#1A5D1A',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  } else if (mode === 'Mặc định') {
    Toastify({
      text: 'Chế độ "Mặc định" không thể xóa!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#DC3545',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  }
});

document.getElementById('detailMode').addEventListener('click', () => {
  const mode = document.getElementById('modeSelect').value;
  const savedText = localStorage.getItem(mode) || '';
  document.getElementById('modeText').value = savedText; // Hiển thị nội dung lưu (read-only)
  document.getElementById('modeDetail').style.display = 'block';
  document.getElementById('editDetail').style.display = 'none'; // Ẩn chế độ chỉnh sửa
});

document.getElementById('editMode').addEventListener('click', () => {
  const mode = document.getElementById('modeSelect').value;
  const savedText = localStorage.getItem(mode) || '';
  document.getElementById('editText').value = savedText; // Hiển thị nội dung để chỉnh sửa
  document.getElementById('editDetail').style.display = 'block';
  document.getElementById('modeDetail').style.display = 'none'; // Ẩn chế độ xem
});

document.getElementById('toggleMode').addEventListener('click', () => {
  const detail = document.getElementById('modeDetail');
  const editDetail = document.getElementById('editDetail');
  if (detail.style.display === 'block' || editDetail.style.display === 'block') {
    detail.style.display = 'none';
    editDetail.style.display = 'none';
  } else {
    detail.style.display = 'block'; // Mặc định mở chế độ xem khi thu gọn
  }
});

document.getElementById('saveSetting').addEventListener('click', () => {
  const editText = document.getElementById('editText').value.trim();
  if (editText) {
    const mode = document.getElementById('modeSelect').value;
    localStorage.setItem(mode, editText); // Lưu nội dung chỉnh sửa
    document.getElementById('modeText').value = editText; // Cập nhật ô xem
    document.getElementById('editDetail').style.display = 'none'; // Ẩn sau khi lưu
    Toastify({
      text: 'Đã lưu cài đặt xưng hô!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#1A5D1A',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  } else {
    Toastify({
      text: 'Vui lòng nhập xưng hô!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#DC3545',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  }
});

// Xử lý trích xuất
document.getElementById('extractBtn').addEventListener('click', () => {
  const inputText = document.getElementById('inputText').value.trim();
  const startKeyword = document.getElementById('clearKeywords').previousElementSibling.previousElementSibling.value.trim().toLowerCase();
  const endKeyword = document.getElementById('clearKeywords').previousElementSibling.value.trim().toLowerCase();
  const output = document.getElementById('output');
  const extractBtn = document.getElementById('extractBtn');

  if (!inputText) {
    Toastify({
      text: 'Vui lòng nhập nội dung vào ô Tìm kiếm văn bản!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#DC3545',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
    return;
  }
  if (!startKeyword || !endKeyword) {
    Toastify({
      text: 'Vui lòng nhập cả hai từ khóa!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#DC3545',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
    return;
  }

  extractBtn.disabled = true;
  output.value = '';

  try {
    const lowerCaseInput = inputText.toLowerCase();
    const startIndex = lowerCaseInput.indexOf(startKeyword);
    const endIndex = lowerCaseInput.indexOf(endKeyword, startIndex + 1);

    if (startIndex === -1 || endIndex === -1) {
      Toastify({
        text: 'Không tìm thấy từ khóa. Vui lòng kiểm tra lại!',
        duration: 2500,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#DC3545',
        style: { borderRadius: '8px' },
        stopOnFocus: true,
      }).showToast();
      return;
    }

    const resultWithEnd = inputText.slice(startIndex, endIndex + endKeyword.length).trim();
    const resultWithoutEnd = resultWithEnd.slice(0, -endKeyword.length).trim(); // Xóa từ khóa thứ hai
    const modeText = localStorage.getItem(document.getElementById('modeSelect').value) || '';
    output.value = resultWithoutEnd + (modeText ? '\n\n' + modeText : '');
  } catch (error) {
    Toastify({
      text: 'Lỗi khi xử lý nội dung: ' + error.message,
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#DC3545',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  } finally {
    extractBtn.disabled = false;
  }
});

// Xử lý sao chép
document.getElementById('copyBtn').addEventListener('click', async () => {
  const output = document.getElementById('output');
  const text = output.value.trim();

  if (!text) {
    Toastify({
      text: 'Không có nội dung để sao chép!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#DC3545',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    Toastify({
      text: 'Đã sao chép!',
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#1A5D1A',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  } catch (error) {
    Toastify({
      text: 'Lỗi khi sao chép: ' + error.message,
      duration: 2500,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#DC3545',
      style: { borderRadius: '8px' },
      stopOnFocus: true,
    }).showToast();
  }
});

// Xóa từ khóa
document.getElementById('clearKeywords').addEventListener('click', () => {
  document.querySelectorAll('.keyword-input').forEach(input => input.value = '');
  document.getElementById('output').value = '';
});
