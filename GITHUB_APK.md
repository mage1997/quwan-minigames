# 用 GitHub Actions 打包 APK

按下面步骤操作，约 10 分钟可拿到安装包。

## 第一步：在 GitHub 创建仓库

1. 打开 https://github.com/new
2. 仓库名建议：`quwan-minigames`
3. 选择 **Public** 或 **Private** 均可
4. **不要**勾选 “Add a README file”
5. 点击 **Create repository**
6. 复制页面上的仓库地址，例如：
   `https://github.com/你的用户名/quwan-minigames.git`

## 第二步：上传项目到 GitHub

在本项目文件夹打开终端，依次执行（把地址换成你的）：

```bash
git init
git add .
git commit -m "init: 趣玩精品小游戏"
git branch -M main
git remote add origin https://github.com/你的用户名/quwan-minigames.git
git push -u origin main
```

首次 push 时浏览器会弹出 GitHub 登录。

> 如果提示需要 Personal Access Token，到 GitHub → Settings → Developer settings → Personal access tokens 创建一个，密码处粘贴 token。

## 第三步：触发云编译

### 方式 A：自动编译

代码 push 到 `main` 分支后会自动开始编译。

### 方式 B：手动编译

1. 打开你的 GitHub 仓库
2. 点击顶部 **Actions**
3. 左侧选择 **Build Android APK**
4. 右侧点击 **Run workflow** → 再点绿色 **Run workflow**
5. 等待约 3–5 分钟（黄色进行中 → 绿色成功）

## 第四步：下载 APK

1. 进入刚才那次成功的 workflow 运行记录
2. 页面下方 **Artifacts** 区域
3. 点击 **quwan-debug-apk** 下载 zip
4. 解压得到 `app-debug.apk`

## 第五步：安装到手机

1. 把 `app-debug.apk` 传到 Android 手机（微信、QQ、数据线均可）
2. 点击安装
3. 如提示「未知来源」，在设置里允许该来源安装应用

---

## 常见问题

**Q：Actions 页是空的？**  
A：先完成第二步 push 代码，workflow 文件在 `.github/workflows/build-android.yml`。

**Q：编译失败？**  
A：点进失败的运行记录，查看红色步骤的日志，把报错发给我。

**Q：想要正式签名版 APK（可上架商店）？**  
A：需要配置 keystore 签名，我可以帮你加 release 构建流程。

## 修改代码后重新打包

```bash
git add .
git commit -m "update: 描述你的修改"
git push
```

push 后会自动重新编译，再到 Actions 下载最新 APK 即可。
