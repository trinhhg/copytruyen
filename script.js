// Hàm đếm từ giống Microsoft Word (tách bởi dấu cách, dấu chấm câu, bỏ khoảng trắng thừa, điều chỉnh để chính xác hơn)
function countWords(text) {
  if (!text) return 0;
  // Loại bỏ khoảng trắng thừa và tách theo dấu cách, dấu chấm, dấu phẩy, v.v., xử lý ký tự đặc biệt tiếng Việt
  const cleanedText = text.replace(/[\s\uFEFF\xA0]+/g, ' ').trim(); // Xử lý cả non-breaking space và ký tự không mong muốn
  if (!cleanedText) return 0;
  const words = cleanedText.split(/[,\.;!?()\s]+/).filter(word => word.length > 0);
  return words.length;
}

// Cập nhật bộ đếm từ khi trích xuất
document.getElementById("extractBtn").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value.trim();
  const startText = document.getElementById("startInput").value.trim().toLowerCase(); // Không phân biệt hoa/thường
  const endText = document.getElementById("endInput").value.trim().toLowerCase(); // Không phân biệt hoa/thường
  const output = document.getElementById("output");
  const extractBtn = document.getElementById("extractBtn");

  // Kiểm tra đầu vào
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

  // Vô hiệu hóa nút khi xử lý
  extractBtn.disabled = true;
  output.value = "⏳ Đang xử lý nội dung...";
  document.getElementById("outputWordCount").textContent = "Words: 0";

  try {
    const lowerCaseInput = inputText.toLowerCase(); // Chuyển toàn bộ text thành chữ thường để so sánh
    const startIndex = lowerCaseInput.indexOf(startText);
    const endIndex = lowerCaseInput.indexOf(endText, startIndex + 1);

    if (startIndex === -1 || endIndex === -1) {
      output.value = "❌ Không tìm thấy từ khóa. Vui lòng kiểm tra lại.";
      document.getElementById("outputWordCount").textContent = "Words: 0";
      return;
    }

    // Bao gồm từ khóa bắt đầu, dừng trước từ khóa kết thúc
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
    alert("⚠️ Không có nội dung hợp lệ để sao chép!");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    alert("📋 Đã sao chép nội dung!");
  } catch (error) {
    alert("🚫 Lỗi khi sao chép: " + error.message);
  }
});
