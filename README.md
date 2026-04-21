# Mr. Satan

kintone アプリのカスタマイズ開発と設定管理のためのテンプレートリポジトリ。

## コンセプト

kintone のカスタマイズ開発には、大きく分けて 2 つの方向性があります。

1. **webpack などでバンドルしてアップロードする構成**（例: [Goqoo on kintone](https://github.com/goqoo-on-kintone/goqoo)）  
   TypeScript や最新 JS 構文、npm エコシステムをフル活用できる反面、kintone にアップロードされるのはバンドル後の成果物です。開発環境を持っている担当者でないと手を入れられず、kintone の「JavaScript / CSS でカスタマイズ」画面からコードを直接編集することはできません。本格開発には最適ですが、ちょっとした定数の差し替えにも開発環境での再ビルド・再アップロードが必要になります。

2. **素の `.js` をそのままアップロードする構成**  
   kintone 上で直接編集できるので手軽ですが、型補完・型チェック・モジュール分割といったモダンな開発体験は諦めることになります。

このテンプレート *Mr. Satan* は、その**中間**を狙ったものです。

- `.js` をビルドせずそのまま kintone にアップロード → kintone 上でそのまま編集できる余地を残す
- 開発中は `types.ts` に型定義を書き、`.js` からは JSDoc の `@type {import('./types').Foo}` で参照 → VS Code 上では型補完・型チェックが効く
- ビルド工程がないので「ソースと本番の同期ズレ」が原理的に起きない

想定しているユースケース:

- 納品後、顧客やエンドユーザーにも定数の差し替えなど軽微な変更を任せたい案件
- 保守契約を結ばず納品完結するスモールな案件で、後から第三者が手を入れられる状態にしておきたい
- 「ビルド構成までは過剰。でも何の型補完もない素の JS を書き続けるのは辛い」という妥協点を求めている場面

本格的なフロントエンド構成が必要な案件であれば [Goqoo on kintone](https://github.com/goqoo-on-kintone/goqoo) の採用を検討してください。こちらはその手前の、軽量で編集余地を残したい場面向けの選択肢です。

## 生成 AI での開発を推奨

`.js` + JSDoc 型参照 + `types.ts` という構成自体は以前から成立していました。しかし実際のところ、`@type {import('./types').Foo}` の付け直しや `types.ts` 側の変更への追従といった JSDoc のメンテナンスは、人手でやると地味に頭を使う作業です。結果として「もう全部 TypeScript にして webpack でビルドしてしまえ」となりがちで、このパターンが人間単独の開発で長続きすることは稀でした。

Claude Code をはじめとする生成 AI は JSDoc 周りの機械的な追従を苦にしません。このテンプレートを公開するに至った動機の一つが、ここにあります。**生成 AI と協働する前提**で使うことを推奨します（もちろん人手のみでも動作します）。リポジトリには AI 向けのガイドとして [CLAUDE.md](CLAUDE.md) を同梱してあります。

## 特徴

- **ビルドレス運用**: `.js` をそのまま kintone にアップロードできる。バンドラや変換ツールを挟まない
- **型安全**: `.ts` で型定義だけを書いて、`.js` から JSDoc の `@type {import('...')...}` で参照する。`@ts-check` により VS Code 上で静的型チェックが効く
- **ginue で設定を Git 管理**: フィールド定義・フォームレイアウト・プロセス管理・アクセス権などを [ginue](https://github.com/goofmint/ginue) で pull / push して Git で追跡
- **trunks で型定義を一括生成**: [`@goqoo/trunks`](https://github.com/goqoo-on-kintone/trunks)（`@kintone/dts-gen` のラッパー）で複数アプリのフィールド型を `trunks.config.ts` から一発生成
- **公式 SDK / UI ライブラリ対応**: `@kintone/rest-api-client` / `kintone-ui-component` / `luxon` をグローバル読み込み前提で使う構成

## テンプレートとして使い始める

GitHub の「**Use this template**」ボタンから自分のリポジトリを作り、clone した後に以下を実行する。

1. `npm install`
2. `package.json` の `name` / `description` を自プロジェクトに合わせて書き換え
3. `.ginuerc.js` のドメイン（`your-dev.cybozu.com` / `your-prod.cybozu.com`）と `appId` を実際の値に差し替え
4. `npx @goqoo/trunks init` で `trunks.config.ts` を対話的に作成
5. `.env` を作り `KINTONE_USERNAME` / `KINTONE_PASSWORD`（または `KINTONE_API_TOKEN`）を記入（`.gitignore` 済み）
6. `src/apps/sample/` と `dts/sample-fields.d.ts` は動作確認用の雛形。不要なら削除、使うなら自アプリ名にリネーム

## クイックスタート

```bash
# 依存関係をインストール
npm install

# フィールド型定義を生成（trunks.config.ts に記載した全アプリ分）
npx @goqoo/trunks

# kintone から設定をダウンロード
npx ginue pull development

# 特定アプリのみ
npx ginue pull development -A sample

# kintone に設定をアップロード
npx ginue push development -A sample

# 型チェック（ビルドはしない）
npm run typecheck

# コードフォーマット
npm run format

# フォーマット確認のみ（コミット前や CI 向け）
npm run format:check
```

## ディレクトリ構成

```
.
├── dts/                      # 型定義ファイル
│   ├── globals.d.ts          # グローバル変数の型（luxon / KintoneRestAPIClient / Kuc）
│   └── *-fields.d.ts         # アプリのフィールド型（@goqoo/trunks で生成）
├── src/apps/                 # kintone JS カスタマイズ（ここを kintone にアップロード）
│   └── sample/               # アプリごとのカスタマイズ
│       ├── common.js         # アプリ内で共有する定数・ユーティリティ
│       ├── edit-show.js      # 編集画面の表示イベント向け
│       └── types.ts          # アプリ固有の型定義（JSDoc から参照）
└── kintone-settings/         # ginue で pull した設定
    ├── development/
    └── production/
```

## 型チェックの仕組み

`tsconfig.json` で `allowJs: true` + `strict: true` を有効にしている。`.js` ファイルの先頭に `//@ts-check` を付けると、VS Code 上で以下の補助が効く。

```javascript
//@ts-check
{
  /**
   * @param {import('./types').SampleRecord} record
   */
  function doSomething(record) {
    record.件名.value = '...'; // ← フィールド名が補完される
  }
}
```

型定義 (`types.ts`) のみ TypeScript として書き、実際の処理は `.js` に書く。ビルド成果物は生成しないのでそのまま kintone にアップロードできる。

## グローバルライブラリ

kintone の [JavaScript / CSS カスタマイズ](https://jp.cybozu.help/k/ja/user/app_settings/js_customize.html) で、以下を CDN 経由で読み込んでおく想定：

| ライブラリ | CDN の例 | 型定義 |
|-----------|---------|--------|
| [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client) | `https://js.cybozu.com/kintone-rest-api-client/6.1.3/KintoneRestAPIClient.min.js` | `declare const KintoneRestAPIClient` |
| [kintone-ui-component](https://github.com/kintone-labs/kintone-ui-component) | `https://unpkg.com/kintone-ui-component/umd/kuc.min.js` | `declare const Kuc` |
| [Luxon](https://moment.github.io/luxon/) | `https://js.cybozu.com/luxon/3.7.2/luxon.min.js` | `declare const luxon` |

型定義は [`dts/globals.d.ts`](dts/globals.d.ts) で宣言済み。不要なら削除、追加したければ同ファイルに追記。

## 環境

`.ginuerc.js` に development / production 環境とそれぞれの app ID を定義する。デフォルトでは仮の値になっているので、実プロジェクトの値に書き換えること。

## 認証情報の扱い

- **ginue**: コマンド実行時に対話的に入力
- **trunks**: プロジェクトルートの `.env`（`KINTONE_USERNAME` / `KINTONE_PASSWORD` / `KINTONE_API_TOKEN`）または `~/.netrc` から読み込む。未設定時は stdin で対話入力

`.env` および `kintone-settings/` 配下の認証関連ファイルはコミットしないこと（`.gitignore` で除外済み）。

## ライセンス

MIT
