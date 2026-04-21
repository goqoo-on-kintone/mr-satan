import type { IndexEvent, DetailEvent, SubmitEvent } from '../../types';

// アプリ固有のレコード型（システムフィールドを含む Saved 版を採用）
export type Sample1Record = kintone.types.SavedSample1Fields;

// イベント型は汎用型にレコード型を食わせるだけ
export type Sample1IndexEvent = IndexEvent<Sample1Record>;
export type Sample1DetailEvent = DetailEvent<Sample1Record>;
export type Sample1SubmitEvent = SubmitEvent<Sample1Record>;

// common.js でグローバル公開する共通オブジェクトの型
export type Sample1Common = {
  hasValue: (field: { value: unknown } | undefined) => boolean;
  today: () => string;
};

declare global {
  interface Window {
    __sample1Common: Sample1Common;
  }
}
