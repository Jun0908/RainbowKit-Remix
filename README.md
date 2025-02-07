# Remix Solidity & Next.js 学習サイト

このリポジトリは、初心者向けに **Remix Solidity** と **Next.js** を使用して学習できるサイトのプロジェクトです。

## 🚀 プロジェクト概要

このプロジェクトでは、Solidity の基本を学びながら、スマートコントラクトを Remix で開発し、Next.js を用いてフロントエンドを構築します。

---

## 📌 環境構築

### 1️⃣ 必要なツールをインストール
以下のツールが必要です。インストールしていない場合は、リンクからダウンロードしてください。

- [Node.js](https://nodejs.org/) (推奨: LTSバージョン)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) (ブラウザ拡張機能)

また、**Remix IDE** はブラウザで利用可能です。
- [Remix](https://remix.ethereum.org/)

### 2️⃣ リポジトリのクローン
```sh
git clone https://github.com/Jun0908/RainbowKit-Remix.git
cd RainbowKit-Remix
```

### 3️⃣ 依存関係のインストール
```sh
yarn install  # または npm install
```

---

## 🛠️ Solidity スマートコントラクトの開発

### 1️⃣ Remix でのスマートコントラクト作成
1. [Remix](https://remix.ethereum.org/) を開く。
2. `contracts/` フォルダを作成し、新しい `.sol` ファイルを追加。
3. 以下のシンプルな Solidity コードを入力。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message = "Hello, Solidity!";
}
```

4. **コンパイル** タブから Solidity コンパイラを選択し、コンパイルを実行。
5. **デプロイ** タブで「JavaScript VM」を選択し、コントラクトをデプロイ。

---

## 🌐 Next.js フロントエンドの構築

### 1️⃣ プロジェクトの起動
```sh
yarn dev  # または npm run dev
```

### 2️⃣ `pages/index.tsx` を編集し、スマートコントラクトと接続

```tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "デプロイしたコントラクトのアドレス";
const ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "message",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  }
];

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchMessage() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const msg = await contract.message();
        setMessage(msg);
      }
    }
    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Solidity & Next.js 学習サイト</h1>
      <p>コントラクトのメッセージ: {message}</p>
    </div>
  );
}
```

---

## 📡 スマートコントラクトのデプロイ
### 1️⃣ Ethereum Testnet へのデプロイ
1. [Alchemy](https://www.alchemy.com/) または [Infura](https://infura.io/) でアカウントを作成。
2. API キーを取得し `.env.local` に保存。
```sh
ALCHEMY_API_URL=https://eth-sepolia.alchemyapi.io/v2/YOUR_API_KEY
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
```
3. Hardhat または Foundry を使用してデプロイ。
```sh
yarn hardhat run scripts/deploy.js --network sepolia
```

### 2️⃣ Sepolia Faucet でテスト ETH を取得
1. [Sepolia Faucet](https://sepoliafaucet.com/) にアクセス。
2. MetaMask のアドレスを入力し、ETH をリクエスト。
3. 数分後にウォレットへ反映されることを確認。

---

## 📤 Vercel へのデプロイ
1. [Vercel](https://vercel.com/) にサインアップ。
2. リポジトリを Vercel に接続。
3. `yarn build` を実行し、デプロイ。

---

## 🎉 まとめ
これで Solidity & Next.js を使った学習サイトの環境構築とデプロイが完了しました！

✅ Solidity の基本を Remix で学ぶ  
✅ Next.js でフロントエンドを構築  
✅ スマートコントラクトと連携  
✅ Ethereum Sepolia Testnet へデプロイ  
✅ Faucet からテスト ETH を取得  
✅ Vercel でホスティング  

質問や改善点があれば、Issue を作成してください！🚀
