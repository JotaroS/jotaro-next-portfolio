---
type: 'blog post'
title: 'Next.jsでポートフォリオサイトをつくる'
date: '2024-02-25'
tags: ['research']
---

# ポートフォリオサイトのアップデート

これまで`Hugo`というツールでポートフォリオサイトを管理していたが、アプデでロクにビルドしなくなって更新できなくなったので、流行りの `Next.js`に乗り換えることにした。とはいえ、最近はReactをいじったこともないし、Typescriptなんてものも触ったことがなかった。

ただ、v0.devやchatGPT、github copilotに教えてもらいながら作業することで、ほとんど勉強することなく作れてしまったのでここでとりあえず記録に残しておく。そういう意味ではとてもいい時代になったものだが、最近はあらゆるアプリがWebベースで作られており、画面上のパフォーマンスを重視するUI研究者としては少し複雑な気分になる。（まぁ静的サイトに限って言えば問題ないのだが・・・）

## next-appの準備

単純に`create-next-app`を用いてテンプレを作成。
Github Pagesにホスティングするため、静的ページを生成するように、`next.config.ts`を設定しておく。`next build`で、`out`ディレクトリに静的サイトのためのファイル一式が生成されるようになる。

```ts
import type { NextConfig } from "next";
const nextConfig:NextConfig = {
  output: "export",
};
export default nextConfig;
```

## 研究業績：コンポーネントのデザインとリスト化

コンポーネントはあらかたのデザインをv0.devやchatGPTに伺って、自分で手を加えてファインチューニングした。
研究や業績リストを同一のコンポーネントのコピペで記述するのはあまりに面倒くさかったので、一旦`.json`ファイルに、研究のタイトル・学会名・authors・award情報を格納し、
コンポーネント側からファイルシステムをつうじて読み込ませた。


```ts
  try {
    const res = await fs.readFile('public/lectures.json', 'utf-8');
    const data = JSON.parse(res);
    // if (!res.ok) throw new Error('Failed to fetch lectures');
    lectureItems = { lectures: await data };
  } catch (error) {
    console.error('Error fetching lectures:', error);
  }
```

研究業績には一般的に複数のリンクが付随する（project page, youtube, acm dl, ieee explore, arXivなど）ので、リンクが存在する場合にはバッジを追加するような記述もした。


```ts
{props.link_arxiv && <button className="relative inline-flex items-center justify-center p-0.5 mt-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-700 to-red-500 group-hover:from-red-600 group-hover:to-blue-500 hover:text-white dark:text-white" 
onClick={() => window.open(props.link_arxiv)}>
<span className="font-bold relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xs">
arXiv
</span>
</button>}
```

## ブログ記事への対応

`marked`ライブラリを用いて、ファイルシステム内の`.md`ファイルをコンパイルさせ、`tailwind-css`で体裁を整えたものを使った。
なお、`marked`ライブラリ単体では、ブログ内に数式を対応させられないので、別途`marked-katex-extension`プラグインを導入しておく。

```ts
import markedKatex from 'marked-katex-extension'

///...

marked.use(markedkatex);
```



## Unum aquam votique quae agitque

Lorem markdownum praemia Achilli poterit; hic crinem prioribus ocior
virginitate? Nec placabat quod: conponere spumis Cereri parentis.

- Sit mater acres inrita quique verbaque potentia
- Exhortatur veris Dryope Aiax vulnera aeque putat
- Eumque populos
  

$$
-\dfrac{\hslash^2}{2m} \, \dfrac{\mathrm{d}^2 \psi}{\mathrm{d} x^2}
$$
