// Hàm đếm từ giống Microsoft Word (dựa trên tài liệu và thực tiễn)
function countWords(text) {
  if (!text) return 0;
  // Loại bỏ khoảng trắng thừa và ký tự không mong muốn
  const cleanedText = text
    .replace(/[\uFEFF\xA0]+/g, ' ') // Xóa non-breaking space và BOM
    .replace(/[^\w\s.,!?()'-]/g, ' ') // Giữ lại ký tự chữ, số, dấu câu cơ bản
    .replace(/\s+/g, ' ') // Thay nhiều khoảng trắng bằng một khoảng
    .trim();
  if (!cleanedText) return 0;
  // Tách từ dựa trên khoảng trắng và dấu câu, lọc từ có độ dài > 0
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
    output.value = "🚫 Vui lòng nhập nội dung vào ô bên trái";
    document.getElementById("outputWordCount").textContent = "Words: 0";
    return;
  }
  if (!startText || !endText) {
    output.value = "🚫 Vui lòng nhập cả từ khóa bắt đầu và kết thúc.";
    document.getElementById("outputWordCount").textContent = "Words: 0";
    return;
  }

  extractBtn.disabled = true;
  output.value = "⏳ Đang xử lý nội dung...";
  document.getElementById("outputWordCount").textContent = "Words: 0";

  try {
    const lowerCaseInput = inputText.toLowerCase();
    const startIndex = lowerCaseInput.indexOf(startText);
    const endIndex = lowerCaseInput.indexOf(endText, startIndex + 1);

    if (startIndex === -1 || endIndex === -1) {
      output.value = "❌ Không tìm thấy từ khóa. Vui lòng kiểm tra lại.";
      document.getElementById("outputWordCount").textContent = "Words: 0";
      return;
    }

    const result = inputText.slice(startIndex, endIndex).trim();
    output.value = result;
    document.getElementById("outputWordCount").textContent = `Words: ${countWords(result)}`;
  } catch (error) {
    output.value = "🚫 Lỗi khi xử lý nội dung: " + error.message;
    document.getElementById("outputWordCount").textContent = "Words: 0";
  } finally {
    extractBtn.disabled = false;
  }
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const output = document.getElementById("output");
  const text = output.value;

  if (!text || text.startsWith("⏳") || text.startsWith("🚫") || text.startsWith("❌")) {
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
