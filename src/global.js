//@ts-check
// kintone 全体で読み込む前提のグローバルユーティリティ
// kintoneシステム管理の「JavaScript / CSSでカスタマイズ」で登録し、
// すべてのアプリのカスタマイズ JS より先に読み込ませること
{
  /**
   * タグ付きでコンソール出力する。複数アプリが混在する画面で出所を判別しやすくする用
   * @param {string} tag
   * @param {...unknown} args
   */
  function log(tag, ...args) {
    console.log(`[${tag}]`, ...args);
  }

  /** @type {any} */ (window).__global = Object.freeze({
    log,
  });
}
