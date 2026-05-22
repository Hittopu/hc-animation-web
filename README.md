# HC Animation Web

一个科普向交互网页：从“中国高铁站和地点坐标”的类比引入，再用无理数缠绕动画解释 Hyper-Compression 如何把权重组压成轨迹位置 `θ`。

## 本地运行

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

1. 把本目录作为 GitHub 仓库推到 `main` 分支。
2. 在仓库设置里启用 GitHub Pages，Source 选择 GitHub Actions。
3. 每次 push 到 `main` 会自动构建并发布 `dist`。

如果仓库不是部署在域名根路径，修改 `vite.config.js` 里的 `base`。
