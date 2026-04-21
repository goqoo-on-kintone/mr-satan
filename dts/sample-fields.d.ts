// @kintone/dts-gen で生成したフィールド型定義のサンプル
// 実際のアプリからは `npx @kintone/dts-gen -d your-domain.cybozu.com -u username -p password --app-id 1 -o dts/sample-fields.d.ts` で生成する
declare namespace kintone.types {
  interface SampleFields {
    件名: kintone.fieldTypes.SingleLineText;
    本文: kintone.fieldTypes.MultiLineText;
    担当者: kintone.fieldTypes.UserSelect;
    期日: kintone.fieldTypes.Date;
  }
  interface SavedSampleFields extends SampleFields {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新者: kintone.fieldTypes.Modifier;
    作成者: kintone.fieldTypes.Creator;
    レコード番号: kintone.fieldTypes.RecordNumber;
    更新日時: kintone.fieldTypes.UpdatedTime;
    作成日時: kintone.fieldTypes.CreatedTime;
  }
}
