# xby-dehaze-enhance

DeepSeek Harness (DSH) 的插件：去雾

输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。

## 功能

- **set_xby_apikey** — 在聊天中设置 API 密钥（自动持久化，重启有效）
- **dehaze** — 输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件链接。
- **dehaze_for_data_base64** — 输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件的BASE64编码。
- **dehaze_for_data_file** — 输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件的文件路径。

## 安装

### 方式一：从 GitHub 直接安装（推荐）

```bash
# 格式: dsh plugin --profile <profile> add github:<owner>/<repo>
dsh plugin --profile web add github:xby_skill/xby-dehaze-enhance
```

### 方式二：从本地目录安装（开发模式）

```bash
# 仅用于本地开发调试
dsh plugin --profile web add /absolute/path/to/xby-dehaze-enhance
```

### 方式三：通过 cordis.patch.yml 开发调试

```bash
dsh web --profile web --patch /absolute/path/to/dsh-ocr-plugin/cordis.patch.yml
```



## 配置

### 获取 API 密钥

前往 [小笨羊官网](https://xiaobenyang.com) 注册并获取 API 密钥。
