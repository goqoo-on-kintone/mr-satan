//@ts-check
// 一覧画面の表示イベントのサンプル
// 表示中のレコード群から、期日超過しているものをカウントしてログ出力する
// 事前に global.js（kintoneシステム管理で登録）と common.js が読み込まれている前提
{
  const { hasValue, today } = window.__sample1Common;
  const { log } = window.__global;

  kintone.events.on(
    ['app.record.index.show', 'mobile.app.record.index.show'],
    (/** @type {import('./types').Sample1IndexEvent} */ event) => {
      const { records } = event;

      const todayStr = today();
      const overdue = records.filter((r) => hasValue(r.期日) && r.期日.value < todayStr);

      log('sample1', `期日超過レコード: ${overdue.length} / ${records.length}`);

      return event;
    },
  );
}
