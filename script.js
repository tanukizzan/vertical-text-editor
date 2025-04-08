// エディタ機能
function initEditor() {
  const editor = document.getElementById("editor");
  const editorContainer = document.getElementById("editor-container");
  const boldBtn = document.getElementById("bold-btn");
  const underlineBtn = document.getElementById("underline-btn");
  const clearFormatBtn = document.getElementById("clear-format-btn");
  const clearBtn = document.getElementById("clear-btn");
  const fontSizeSlider = document.getElementById("font-size");
  const fontSizeValue = document.getElementById("font-size-value");
  const lineSpacingSlider = document.getElementById("line-spacing");
  const lineSpacingValue = document.getElementById("line-spacing-value");
  const editorHeightSlider = document.getElementById("editor-height");
  const heightValueDisplay = document.getElementById("height-value");
  const helpBtn = document.getElementById("help-btn");
  const helpModal = document.getElementById("help-modal");
  const closeHelp = document.getElementById("close-help");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettings = document.getElementById("close-settings");
  const confirmationDialog = document.getElementById(
    "confirmation-dialog"
  );
  const cancelClearBtn = document.getElementById("cancel-clear");
  const confirmClearBtn = document.getElementById("confirm-clear");

  // 保存されたデータを読み込む
  loadData();

  // プレースホルダーテキストをフォーカス時に削除
  editor.addEventListener("focus", function () {
    if (this.textContent === "ここにテキストを入力してください...") {
      this.textContent = "";
    }
  });

  // フォーマットボタン
  boldBtn.addEventListener("click", function () {
    document.execCommand("bold", false, null);
    editor.focus();
    saveEditorContent();
  });

  underlineBtn.addEventListener("click", function () {
    document.execCommand("underline", false, null);
    editor.focus();
    saveEditorContent();
  });

  // 書式のクリア
  clearFormatBtn.addEventListener("click", function () {
    document.execCommand("removeFormat", false, null);
    editor.focus();
    saveEditorContent();
  });

  // 全内容のクリア（確認ダイアログ付き）
  clearBtn.addEventListener("click", function () {
    confirmationDialog.classList.remove("hidden");
  });

  // 確認ダイアログの操作
  cancelClearBtn.addEventListener("click", function () {
    confirmationDialog.classList.add("hidden");
  });

  confirmClearBtn.addEventListener("click", function () {
    editor.innerHTML = "";
    updateCharCount();
    confirmationDialog.classList.add("hidden");
    editor.focus();
    saveEditorContent();
  });

  // 文字数カウント & エディタ内容の自動保存
  editor.addEventListener("input", function() {
    updateCharCount();
    saveEditorContent();
  });

  // 文字サイズの調整
  fontSizeSlider.addEventListener("input", function () {
    const size = this.value;
    editor.style.fontSize = size + "px";
    fontSizeValue.textContent = size + "px";
    saveSettings();
  });

  // 行間の調整
  lineSpacingSlider.addEventListener("input", function () {
    const spacing = this.value;
    editor.style.lineHeight = spacing;
    lineSpacingValue.textContent = spacing;
    saveSettings();
  });

  // エディタの高さ調整
  editorHeightSlider.addEventListener("input", function () {
    const height = this.value;
    editorContainer.style.height = `${height}px`;
    heightValueDisplay.textContent = `${height}px`;
    saveSettings();
  });

  // ヘルプモーダル
  helpBtn.addEventListener("click", function () {
    helpModal.classList.remove("hidden");
  });

  closeHelp.addEventListener("click", function () {
    helpModal.classList.add("hidden");
  });

  // 設定モーダル
  settingsBtn.addEventListener("click", function () {
    settingsModal.classList.remove("hidden");
  });

  closeSettings.addEventListener("click", function () {
    settingsModal.classList.add("hidden");
    saveSettings();
  });

  // モーダル外クリックで閉じる
  window.addEventListener("click", function (e) {
    if (e.target === helpModal) {
      helpModal.classList.add("hidden");
    }
    if (e.target === settingsModal) {
      settingsModal.classList.add("hidden");
      saveSettings();
    }
  });

  // 自動保存の設定（念のため30秒ごとに保存）
  setInterval(saveEditorContent, 30000);

  // ページを離れる前に確認（任意）
  window.addEventListener("beforeunload", function(e) {
    saveEditorContent(); // ページを離れる前に最終保存
  });
}

// エディタの内容を保存
function saveEditorContent() {
  const editor = document.getElementById("editor");
  const content = editor.innerHTML;
  
  // プレースホルダーテキストの場合は保存しない
  if (content.trim() === "ここにテキストを入力・・・" || 
      content.trim() === "") return;
      
  localStorage.setItem('verticalEditorContent', content);
}

// 設定を保存する
function saveSettings() {
  const fontSizeSlider = document.getElementById("font-size");
  const lineSpacingSlider = document.getElementById("line-spacing");
  const editorHeightSlider = document.getElementById("editor-height");

  const settings = {
    fontSize: fontSizeSlider.value,
    lineSpacing: lineSpacingSlider.value,
    editorHeight: editorHeightSlider.value
  };

  localStorage.setItem('verticalEditorSettings', JSON.stringify(settings));
}

// 保存されたデータを読み込む
function loadData() {
  loadSettings();
  loadEditorContent();
}

// 保存されたエディタの内容を読み込む
function loadEditorContent() {
  const savedContent = localStorage.getItem('verticalEditorContent');
  if (!savedContent) return; // 保存された内容がない場合は初期状態のまま
  
  const editor = document.getElementById("editor");
  editor.innerHTML = savedContent;
  updateCharCount();
}

// 保存された設定を読み込む
function loadSettings() {
  const savedSettings = localStorage.getItem('verticalEditorSettings');
  if (!savedSettings) return; // 保存された設定がない場合は初期値を使用
  
  const settings = JSON.parse(savedSettings);
  
  const editor = document.getElementById("editor");
  const editorContainer = document.getElementById("editor-container");
  const fontSizeSlider = document.getElementById("font-size");
  const fontSizeValue = document.getElementById("font-size-value");
  const lineSpacingSlider = document.getElementById("line-spacing");
  const lineSpacingValue = document.getElementById("line-spacing-value");
  const editorHeightSlider = document.getElementById("editor-height");
  const heightValueDisplay = document.getElementById("height-value");
  
  // スライダーの値を設定
  if (settings.fontSize) {
    fontSizeSlider.value = settings.fontSize;
    editor.style.fontSize = settings.fontSize + "px";
    fontSizeValue.textContent = settings.fontSize + "px";
  }
  
  if (settings.lineSpacing) {
    lineSpacingSlider.value = settings.lineSpacing;
    editor.style.lineHeight = settings.lineSpacing;
    lineSpacingValue.textContent = settings.lineSpacing;
  }
  
  if (settings.editorHeight) {
    editorHeightSlider.value = settings.editorHeight;
    editorContainer.style.height = `${settings.editorHeight}px`;
    heightValueDisplay.textContent = `${settings.editorHeight}px`;
  }
}

// 文字数カウント
function updateCharCount() {
  const editor = document.getElementById("editor");
  const text = editor.textContent.replace(/\s+/g, "");
  const count = text.length;
  document.getElementById("char-count").textContent = count;
  document.querySelector(".character-count").innerHTML = 
    `<span id="char-count">${count}</span> 文字`;
}

// 初期化
document.addEventListener("DOMContentLoaded", function () {
  initEditor();
});
