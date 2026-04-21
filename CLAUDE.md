# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

kintone アプリのカスタマイズ開発と設定管理のためのテンプレートリポジトリ。GitHub の「Use this template」で派生リポジトリを作って使う前提。

- ビルドレス運用: `.js` をそのまま kintone にアップロード
- 型安全: `types.ts` で型定義を書き、`.js` から JSDoc の `@type {import('...')...}` で参照（`@ts-check`）
- ginue で kintone 設定を Git 管理
- `@goqoo/trunks` でアプリのフィールド型定義を一括生成

## 初回セットアップ（テンプレート clone 後）

派生リポジトリを clone した直後に以下を済ませる。手順 3〜4 を飛ばすと `trunks` / `ginue` が動かない。

1. `npm install` で依存をインストール
2. `package.json` の `name` / `description` を自プロジェクトの値に書き換え
3. `.ginuerc.js` のドメイン（`your-dev.cybozu.com` / `your-prod.cybozu.com`）と `env.*.app` の `appId` を実際の値に差し替え
4. `npx @goqoo/trunks init` で `trunks.config.ts` を対話的に作成（host / apps / auth を設定）
5. プロジェクトルートに `.env` を作り `KINTONE_USERNAME` / `KINTONE_PASSWORD`（または `KINTONE_API_TOKEN`）を記入。`.env` は `.gitignore` 済み
6. `src/apps/sample1/` / `src/apps/sample2/` と `dts/sample*-fields.d.ts` は動作確認用の雛形。自プロジェクトで使わないなら削除、使うなら自アプリ名にリネーム（後述「新規アプリを追加する」参照）
7. `npx ginue pull development` と `npx @goqoo/trunks` がエラーなく通ることを確認

## 主要コマンド

```bash
# 依存関係
npm install

# kintone から設定をダウンロード
npx ginue pull development
npx ginue pull production

# 特定アプリのみ
npx ginue pull development -A sample1

# kintone へ設定をアップロード
npx ginue push development -A sample1

# フィールド型定義の生成（複数アプリ一括）
npx @goqoo/trunks

# trunks の設定ファイルを対話的に作成
npx @goqoo/trunks init

# 型チェック（tsc --noEmit）
npm run typecheck

# コードフォーマット（.md は対象外）
npm run format

# フォーマット確認のみ
npm run format:check
```

## フィールド型生成（trunks）

フィールド型定義は [`@goqoo/trunks`](https://github.com/goqoo-on-kintone/trunks) で生成する。trunks は `@kintone/dts-gen` のラッパーで、`trunks.config.ts` に登録した複数アプリ分の型を一発で `dts/{appName}-fields.d.ts` に出力する。

- 設定ファイル: `trunks.config.ts`（`defineConfig({ host, apps, auth })`）
- 認証情報は `.env`（`KINTONE_USERNAME` / `KINTONE_PASSWORD` / `KINTONE_API_TOKEN`）または `~/.netrc` から読む。config 直書きは `.gitignore` 必須なので避ける
- 出力先はデフォルト `dts/`、namespace は `kintone.types`（既存の `dts/sample*-fields.d.ts` と互換）

新規アプリ追加時の具体的な手順は後述「新規アプリを追加する」を参照。

## ディレクトリ構成

```
dts/                        # 型定義
├── globals.d.ts            # グローバル変数の型
└── *-fields.d.ts           # アプリのフィールド型（@goqoo/trunks で生成）

src/
├── global.js               # kintoneシステム管理で登録する全アプリ共通 JS（window.__global）
├── types.ts                # 全アプリ共通の汎用型（KintoneEvent / IndexEvent<T> / DetailEvent<T> / SubmitEvent<T> / Global）
└── apps/{app}/             # アプリごとの JS カスタマイズ
    ├── common.js           # （任意）アプリ内で共有する定数・ユーティリティ
    ├── {feature}.js        # 各機能のカスタマイズ
    └── types.ts            # アプリ固有の型（src/types.ts から汎用型を import し、レコード型を食わせるだけ）

kintone-settings/{env}/     # ginue の pull / push 対象
```

同梱している 2 アプリは意図的に粒度が違う:
- `sample1/` — `common.js` + `edit-show.js` + `index-show.js` + `types.ts`。共有ヘルパが要る複数機能構成の例
- `sample2/` — `edit-submit.js` + `types.ts` のみ。`common.js` なしで 1 ファイルに閉じる最小構成の例

共有ヘルパは 3 層構造:
1. **`src/global.js`** — kintoneシステム管理で登録する全アプリ共通 JS。`window.__global` から参照
2. **`src/apps/{app}/common.js`** — アプリ内の複数ファイルで共有（任意）。`window.__{app}Common` から参照
3. **ファイル内ローカル** — IIFE ブロック内に閉じる（sample2 の `isValidEmail` 参照）

## コーディング規約

- JS ファイルは `//@ts-check` を先頭に記載し、VS Code で静的型チェックを効かせる
- 複数ファイルで変数がぶつからないよう、各 JS ファイルは `{ ... }` の IIFE ブロックで囲む
- アプリ内で 2 つ以上の機能ファイル間で定数・関数を共有したいときは `common.js` に集約し、`window.__{app}Common` 経由で公開する（`sample1/` 参照）。1 ファイルで閉じるなら `common.js` は不要（`sample2/` 参照）
- 複数アプリにまたがって共有したいユーティリティは `src/global.js` に書き、kintoneシステム管理の「JavaScript / CSSでカスタマイズ」で登録する。各アプリからは `window.__global` で参照
- `common.js` を置く場合は、同一アプリ内の他 JS より先に読み込ませる（kintone 側のカスタマイズ設定でファイル順を調整）
- `window.__{app}Common` の型は `types.ts` 内で `declare global { interface Window { ... } }` 形式で拡張する（`src/apps/sample1/types.ts` 参照）。`window.__global` の型は `src/types.ts` で拡張済み
- kintone の汎用イベント型（`IndexEvent<T>` / `DetailEvent<T>` / `SubmitEvent<T>`）は `src/types.ts` に一度だけ定義されている。アプリの `types.ts` は `import type` で引き込んでレコード型を食わせるだけ
- 型は `.ts` にだけ書き、実装は `.js` に書く（ビルドしない方針）
- `tsconfig.json` は `strict` に加えて `noUncheckedIndexedAccess` / `exactOptionalPropertyTypes` / `verbatimModuleSyntax` も有効化済み。型のみの import は `import type` を使うこと

## kintone API

記憶で書かず、**公式ドキュメントを WebFetch で確認してから実装すること**。PC / モバイル、一覧画面 / 詳細画面で関数名や置き場所が異なり、推測で書くと実機で動かない。

- JS API: https://cybozu.dev/ja/kintone/docs/js-api/
- REST API: https://cybozu.dev/ja/kintone/docs/rest-api/

REST API は公式 SDK [`@kintone/rest-api-client`](https://github.com/kintone/js-sdk/blob/main/packages/rest-api-client/docs/README.md) に該当機能があれば `kintone.api()` より優先する（ページング・チャンク分割を自動化）。SDK 非対応のエンドポイント（cybozu 共通管理の User API 等）だけ `kintone.api()` を使う。

## CDN 配信のグローバルライブラリ

以下は kintone の JS/CSS カスタマイズ設定で CDN から読み込む前提。`import` せずグローバル名で直接参照する。型定義は `dts/globals.d.ts` に集約。

- `KintoneRestAPIClient` — REST API クライアント
- `Kuc` — [kintone-ui-component](https://github.com/kintone-labs/kintone-ui-component)
- `luxon` — 日付ライブラリ（`luxon.DateTime.now()...` など）

使わないライブラリが出てきたら `dts/globals.d.ts` からも削除する。

## 新規アプリを追加する

1. kintone 側でアプリを作り `appId` を控える
2. `src/apps/{app}/` を作成し、雛形をコピー
   - 共通ヘルパを使う構成なら `sample1/` 配下（`common.js` / `types.ts` / `{feature}.js` 複数）
   - 1 機能に閉じるなら `sample2/` 配下（`types.ts` + `{feature}.js` 1 本）
3. `types.ts` の `Sample1*` / `Sample2*` を `{App}*` に、必要なら `__sample1Common` を `__{app}Common` に置換。`Window` インターフェース拡張も合わせて更新。`src/types.ts` からの汎用型 import はそのまま残す（ここは触らない）
4. `trunks.config.ts` の `apps` に `{app}: <appId>` を追加 → `npx @goqoo/trunks` で `dts/{app}-fields.d.ts` を生成
5. `.ginuerc.js` の `env.*.app` に `{app}: <appId>` を追加 → `npx ginue pull development -A {app}` で設定を `kintone-settings/` に取り込み
6. kintone の「JavaScript / CSS でカスタマイズ」画面で、`common.js` → 各 `{feature}.js` の順に JS を登録（`common.js` の読み込みが先でないと `window.__{app}Common` が undefined になる。`common.js` がない構成ではこの制約はない）

## 認証について

- **ginue**: コマンド実行時にユーザー名とパスワード（または API トークン）を対話入力
- **trunks**: `.env`（`KINTONE_USERNAME` / `KINTONE_PASSWORD` / `KINTONE_API_TOKEN`）または `~/.netrc` から読む。いずれも未設定なら stdin で対話入力
