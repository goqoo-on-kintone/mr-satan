//@ts-check
// 保存時バリデーションのサンプル
// このアプリはこの一本だけの単純な構成。アプリ固有の共通ヘルパはファイル内に閉じる
// 事前に global.js（kintoneシステム管理で登録）が読み込まれている前提
{
  const { log } = window.__global;

  /** @param {string} email */
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  kintone.events.on(
    [
      'app.record.create.submit',
      'app.record.edit.submit',
      'mobile.app.record.create.submit',
      'mobile.app.record.edit.submit',
    ],
    (/** @type {import('./types').Sample2SubmitEvent} */ event) => {
      const { record } = event;

      // 会社名は必須
      if (!record.会社名.value) {
        record.会社名.error = '会社名は必須です';
      }

      // メールは任意入力だが、入力されている場合は形式を検証する
      if (record.メール.value && !isValidEmail(record.メール.value)) {
        record.メール.error = 'メールアドレスの形式が不正です';
      }

      // フィールドレベルのエラーが一つでもあれば保存を中断
      if (record.会社名.error || record.メール.error) {
        event.error = '入力内容にエラーがあります';
        log('sample2', 'バリデーションで保存を中断', {
          company: record.会社名.error,
          email: record.メール.error,
        });
      }

      return event;
    },
  );
}
