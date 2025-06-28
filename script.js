// Hàm đếm từ giống Microsoft Word
function countWords(text) {
  if (!text) return 0;
  const cleanedText = text
    .replace(/[\uFEFF\xA0]+/g, ' ')
    .replace(/[^\w\s.,!?()'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleanedText) return 0;
  const words = cleanedText.split(/[\s.,!?()]+/).filter(word => word.length > 0);
  return words.length;
}

document.getElementById("extractBtn").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value.trim();
  const startText = document.getElementById("startInput").value.trim().toLowerCase();
  const endText = document.getElementById("endInput").value.trim().toLowerCase();
  const output = document.getElementById("output");
  const extractBtn = document.getElementById("extractBtn");

  if (!inputText) {
    Toastify({
      text: "🚫 Vui lòng nhập nội dung vào ô Tìm kiếm văn bản!",
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff4444",
      stopOnFocus: true,
    }).showToast();
    return;
  }
  if (!startText || !endText) {
    Toastify({
      text: "🚫 Vui lòng nhập cả từ khóa Tìm và Thay bằng!",
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff4444",
      stopOnFocus: true,
    }).showToast();
    return;
  }

  extractBtn.disabled = true;
  output.value = "";
  document.getElementById("outputWordCount").textContent = "Words: 0";

  try {
    const lowerCaseInput = inputText.toLowerCase();
    const startIndex = lowerCaseInput.indexOf(startText);
    const endIndex = lowerCaseInput.indexOf(endText, startIndex + 1);

    if (startIndex === -1 || endIndex === -1) {
      Toastify({
        text: "❌ Không tìm thấy từ khóa. Vui lòng kiểm tra lại!",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4444",
        stopOnFocus: true,
      }).showToast();
      return;
    }

    const result = inputText.slice(startIndex, endIndex).trim();
    output.value = result;
    document.getElementById("outputWordCount").textContent = `Words: ${countWords(result)}`;
  } catch (error) {
    Toastify({
      text: "🚫 Lỗi khi xử lý nội dung: " + error.message,
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff4444",
      stopOnFocus: true,
    }).showToast();
  } finally {
    extractBtn.disabled = false;
  }
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const output = document.getElementById("output");
  const text = output.value.trim();

  if (!text || text === "") {
    Toastify({
      text: "⚠️ Không có nội dung để sao chép!",
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff4444",
      stopOnFocus: true,
    }).showToast();
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    Toastify({
      text: "Đã sao chép văn bản vào clipboard",
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: "#28A745",
      stopOnFocus: true,
    }).showToast();
  } catch (error) {
    Toastify({
      text: "Lỗi khi sao chép: " + error.message,
      duration: 2000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff4444",
      stopOnFocus: true,
    }).showToast();
  }
});

// Xóa tất cả từ khóa khi nhấn nút Xóa
document.getElementById("clearAll").addEventListener("click", () => {
  document.getElementById("startInput").value = "";
  document.getElementById("endInput").value = "";
});
