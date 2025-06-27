document.getElementById("extractBtn").addEventListener("click", async () => {
  const link = document.getElementById("linkInput").value.trim();
  const startText = document.getElementById("startInput").value.trim();
  const endText = document.getElementById("endInput").value.trim();
  const output = document.getElementById("output");
  const extractBtn = document.getElementById("extractBtn");

  // Kiểm tra đầu vào
  if (!link.includes("zingtruyen.store")) {
    output.value = "🚫 Vui lòng nhập link hợp lệ từ zingtruyen.store.";
    return;
  }
  if (!startText || !endText) {
    output.value = "🚫 Vui lòng nhập cả từ khóa bắt đầu và kết thúc.";
    return;
  }

  // Vô hiệu hóa nút khi đang tải
  extractBtn.disabled = true;
  output.value = "⏳ Đang tải nội dung...";

  try {
    const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(link);
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Phản hồi mạng không ổn định");

    const data = await response.json();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, "text/html");
    const text = doc.body.innerText;

    const startIndex = text.indexOf(startText);
    const endIndex = text.indexOf(endText, startIndex + 1);

    if (startIndex === -1 || endIndex === -1) {
      output.value = "❌ Không tìm thấy từ khóa. Vui lòng kiểm tra lại.";
      return;
    }

    const result = text.slice(startIndex + startText.length, endIndex).trim();
    output.value = result;
  } catch (error) {
    output.value = "🚫 Lỗi: Không thể tải nội dung từ link. Có thể bị chặn hoặc sai link.";
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
