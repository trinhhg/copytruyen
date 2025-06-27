document.getElementById("extractBtn").addEventListener("click", () => {
  const inputText = document.getElementById("inputText").value.trim();
  const startText = document.getElementById("startInput").value.trim();
  const endText = document.getElementById("endInput").value.trim();
  const output = document.getElementById("output");
  const extractBtn = document.getElementById("extractBtn");

  // Kiểm tra đầu vào
  if (!inputText) {
    output.value = "🚫 Vui lòng dán nội dung từ zingtruyen.store.";
    return;
  }
  if (!startText || !endText) {
    output.value = "🚫 Vui lòng nhập cả từ khóa bắt đầu và kết thúc.";
    return;
  }

  // Vô hiệu hóa nút khi xử lý
  extractBtn.disabled = true;
  output.value = "⏳ Đang xử lý nội dung...";

  try {
    const startIndex = inputText.indexOf(startText);
    const endIndex = inputText.indexOf(endText, startIndex + 1);

    if (startIndex === -1 || endIndex === -1) {
      output.value = "❌ Không tìm thấy từ khóa. Vui lòng kiểm tra lại.";
      return;
    }

    const result = inputText.slice(startIndex + startText.length, endIndex).trim();
    output.value = result;
  } catch (error) {
    output.value = "🚫 Lỗi khi xử lý nội dung: " + error.message;
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
