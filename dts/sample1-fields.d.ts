// @goqoo/trunks で生成したフィールド型定義のサンプル（sample1 アプリ）
// 実アプリでは `npx @goqoo/trunks` で再生成される
declare namespace kintone.types {
  interface Sample1Fields {
    件名: kintone.fieldTypes.SingleLineText;
    本文: kintone.fieldTypes.MultiLineText;
    担当者: kintone.fieldTypes.UserSelect;
    期日: kintone.fieldTypes.Date;
  }
  interface SavedSample1Fields extends Sample1Fields {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新者: kintone.fieldTypes.Modifier;
    作成者: kintone.fieldTypes.Creator;
    レコード番号: kintone.fieldTypes.RecordNumber;
    更新日時: kintone.fieldTypes.UpdatedTime;
    作成日時: kintone.fieldTypes.CreatedTime;
  }
}
