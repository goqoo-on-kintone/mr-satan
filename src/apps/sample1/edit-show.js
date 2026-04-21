//@ts-check
// 編集画面の表示イベントのサンプル
// 事前に common.js が読み込まれている前提（global.js は使わないのでアプリ側の読み込み順のみ意識すればよい）
{
  const { hasValue, today } = window.__sample1Common;

  kintone.events.on(
    [
      'app.record.create.show',
      'app.record.edit.show',
      'app.record.index.edit.show',
      'mobile.app.record.create.show',
      'mobile.app.record.edit.show',
      'mobile.app.record.index.edit.show',
    ],
    (/** @type {import('./types').Sample1DetailEvent} */ event) => {
      const { record } = event;

      // 例 1: 件名に値が入っていれば本文を編集不可にする
      if (hasValue(record.件名)) {
        record.本文.disabled = true;
      }

      // 例 2: 期日が未入力なら今日の日付を初期値として入れる
      if (!hasValue(record.期日)) {
        record.期日.value = today();
      }

      return event;
    },
  );
}
