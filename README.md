# 趣玩 · 精品小游戏

四款精心打磨的休闲小游戏合集，支持 **Android 安装包**、**PWA 添加到主屏幕**、键盘与触屏操作。

## 游戏列表

- **2048** — 滑动合并数字，挑战 2048 及更高分
- **贪吃蛇** — 经典街机玩法，越吃越长
- **记忆翻牌** — 16 张卡牌配对，考验记忆力
- **反应力** — 绿光出现瞬间点击，测试反应速度

## 方式一：安装 Android App（APK）

### 前置要求

1. 安装 [Android Studio](https://developer.android.com/studio)
2. 在 Android Studio 中安装 **Android SDK** 和 **SDK Platform Tools**
3. 准备一台 Android 手机，开启 **开发者选项 → USB 调试**

### 构建步骤

```bash
# 1. 安装依赖
npm install

# 2. 构建并同步到 Android 工程
npm run build:app

# 3. 用 Android Studio 打开项目
npm run android
```

在 Android Studio 中：

1. 等待 Gradle 同步完成
2. 连接手机或启动模拟器
3. 点击 **Run ▶** 安装到设备

### 生成 APK 安装包

在 Android Studio 菜单：

**Build → Build Bundle(s) / APK(s) → Build APK(s)**

生成的 APK 路径：

```
android/app/build/outputs/apk/debug/app-debug.apk
```

把 APK 传到手机安装即可（需允许「未知来源」）。

---

## 方式一-B：在线云编译 APK（推荐，无需 Android Studio）

项目已配置 **GitHub Actions**，在 GitHub 云端自动编译 APK，完全免费。

### 步骤

1. 在 [GitHub](https://github.com) 注册账号并新建仓库
2. 将本项目上传到仓库（需包含 `android/` 目录）
3. 打开仓库 → **Actions** → **Build Android APK** → **Run workflow**
4. 等待约 3–5 分钟编译完成
5. 进入该次运行记录 → **Artifacts** → 下载 `quwan-debug-apk`
6. 解压得到 `app-debug.apk`，传到手机安装

也可以每次推送到 `main` 分支时自动编译。

### 其他在线编译平台

| 平台 | 费用 | 说明 |
|------|------|------|
| [GitHub Actions](https://github.com/features/actions) | 免费 | 已内置配置，见上方步骤 |
| [Codemagic](https://codemagic.io/) | 有免费额度 | 连接 GitHub 后选 Capacitor 模板 |
| [Appflow](https://ionic.io/appflow) | 付费 | Ionic 官方云构建 |

### 在线部署网页版（无需 APK）

若只需手机浏览器使用，可部署到 [Vercel](https://vercel.com)：

1. 把项目推到 GitHub
2. Vercel 导入仓库，框架选 **Vite**
3. 构建命令 `npm run build`，输出目录 `dist`
4. 部署后手机打开链接 → **添加到主屏幕** 即可

项目已包含 `vercel.json`，可直接部署。

---

## 方式二：PWA 添加到手机主屏幕

无需 Android Studio，适合快速体验：

```bash
npm run build
npm run preview
```

手机与电脑在同一 WiFi 下，用手机浏览器访问预览地址，选择：

- **Android Chrome**：菜单 → 「添加到主屏幕」
- **iPhone Safari**：分享 → 「添加到主屏幕」

部署到公网（Vercel、腾讯云等）后，任何手机浏览器均可安装。

---

## 本地开发

```bash
npm run dev
```

浏览器访问 `http://127.0.0.1:5173/`

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建网页版 |
| `npm run build:app` | 构建并同步 Android 工程 |
| `npm run android` | 用 Android Studio 打开 |
| `npm run android:run` | 构建并在已连接设备上运行 |
| `npm run icons` | 重新生成 App 图标 |

## 技术栈

- React 19 + TypeScript + Vite 6
- Capacitor 7（Android 原生壳）
- vite-plugin-pwa（可添加到主屏幕）
- 纯 CSS，无 UI 框架依赖

## App 信息

- **应用名**：趣玩
- **包名**：`com.quwan.minigames`
- **版本**：1.0.0
