// Hàm đếm từ giống Microsoft Word (tách bởi dấu cách, dấu chấm câu, bỏ khoảng trắng thừa)
function countWords(text) {
  if (!text) return 0;
  const cleanedText = text.replace(/[\s\uFEFF\xA0]+/g, ' ').trim();
  if (!cleanedText) return 0;
  const words = cleanedText.split(/[,\.;!?()\s]+/).filter(word => word.length > 0);
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
      position: "center",
      backgroundColor: "#00AEEF",
      stopOnFocus: true,
    }).showToast();
  } catch (error) {
    Toastify({
      text: "Lỗi khi sao chép: " + error.message,
      duration: 2000,
      gravity: "top",
      position: "center",
      backgroundColor: "#ff4444",
      stopOnFocus: true,
    }).showToast();
  }
});

// Xóa từ khóa khi nhấn nút xóa
document.getElementById("clearStart").addEventListener("click", () => {
  document.getElementById("startInput").value = "";
});

document.getElementById("clearEnd").addEventListener("click", () => {
  document.getElementById("endInput").value = "";
});
