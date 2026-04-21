// kintone のイベントオブジェクトのベース型
type KintoneEvent = {
  appId: number;
  type: string;
  error?: string;
};

type IndexEvent<T> = KintoneEvent & {
  records: T[];
  viewType: 'list' | 'calendar' | 'custom';
  viewId: number;
  viewName: string;
  offset: number | null;
  size: number | null;
  date: string | null;
};

type DetailEvent<T> = KintoneEvent & {
  record: T;
  recordId: number;
  reuse?: boolean;
};

type SubmitEvent<T> = KintoneEvent & {
  record: T;
  changes?: {
    field: { type: string; value: unknown };
    row?: { id: string; value: Record<string, unknown> };
  };
};

// アプリ固有のレコード型（システムフィールドを追加したい場合はここで拡張）
export type SampleRecord = kintone.types.SavedSampleFields;

export type SampleIndexEvent = IndexEvent<SampleRecord>;
export type SampleDetailEvent = DetailEvent<SampleRecord>;
export type SampleSubmitEvent = SubmitEvent<SampleRecord>;

// common.js でグローバル公開する共通オブジェクトの型
export type SampleCommon = {
  hasValue: (field: { value: unknown } | undefined) => boolean;
};

declare global {
  interface Window {
    __sampleCommon: SampleCommon;
  }
}
