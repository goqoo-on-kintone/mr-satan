//@ts-check
// sample アプリ内の各カスタマイズで共通利用する定数・関数
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

  // グローバル公開（他ファイルからは window.__sampleCommon で参照）
  /** @type {any} */ (window).__sampleCommon = Object.freeze({
    hasValue,
  });
}
