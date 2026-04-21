// @goqoo/trunks で生成したフィールド型定義のサンプル（sample2 アプリ：顧客コンタクト管理を想定）
declare namespace kintone.types {
  interface Sample2Fields {
    会社名: kintone.fieldTypes.SingleLineText;
    担当者名: kintone.fieldTypes.SingleLineText;
    メール: kintone.fieldTypes.Link;
    ステータス: kintone.fieldTypes.DropDown;
    最終連絡日: kintone.fieldTypes.Date;
  }
  interface SavedSample2Fields extends Sample2Fields {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新者: kintone.fieldTypes.Modifier;
    作成者: kintone.fieldTypes.Creator;
    レコード番号: kintone.fieldTypes.RecordNumber;
    更新日時: kintone.fieldTypes.UpdatedTime;
    作成日時: kintone.fieldTypes.CreatedTime;
  }
}
