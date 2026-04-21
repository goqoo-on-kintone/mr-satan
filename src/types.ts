// kintone のイベントオブジェクトの汎用型
// アプリごとの types.ts からアプリ固有レコード型を食わせて利用する
export type KintoneEvent = {
  appId: number;
  type: string;
  error?: string;
};

export type IndexEvent<T> = KintoneEvent & {
  records: T[];
  viewType: 'list' | 'calendar' | 'custom';
  viewId: number;
  viewName: string;
  offset: number | null;
  size: number | null;
  date: string | null;
};

export type DetailEvent<T> = KintoneEvent & {
  record: T;
  recordId: number;
  reuse?: boolean;
};

export type SubmitEvent<T> = KintoneEvent & {
  record: T;
  changes?: {
    field: { type: string; value: unknown };
    row?: { id: string; value: Record<string, unknown> };
  };
};

// src/global.js が window.__global に公開する、全アプリ共通のユーティリティ型
export type Global = {
  log: (tag: string, ...args: unknown[]) => void;
};

declare global {
  interface Window {
    __global: Global;
  }
}
