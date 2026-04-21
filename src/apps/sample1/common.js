//@ts-check
// sample1 アプリ内の各カスタマイズで共通利用する定数・関数
// アプリ内の他 JS（edit-show.js など）より先に読み込むこと
{
  /**
   * フィールドに値が入っているかを判定する
   * @param {{ value: unknown } | undefined} field
   */
  function hasValue(field) {
    if (!field) return false;
    const v = field.value;
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v !== '';
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }

  /** 今日の日付を kintone の Date フィールド互換フォーマット（yyyy-MM-dd）で返す */
  function today() {
    return luxon.DateTime.now().toFormat('yyyy-MM-dd');
  }

  // グローバル公開（他ファイルからは window.__sample1Common で参照）
  /** @type {any} */ (window).__sample1Common = Object.freeze({
    hasValue,
    today,
  });
}
