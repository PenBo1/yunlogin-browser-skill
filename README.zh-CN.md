<p align="center">
  <img src="./yunlogin-browser/assets/icon-512.png" width="144" alt="云登浏览器 Skill 图标">
</p>

<h1 align="center">YunLogin Browser Skill</h1>

<p align="center">
  通过本地 API、本地客户端 API 和管理中心 API 管理云登浏览器环境。
</p>

<p align="center">
  <a href="README.md">English</a> | <strong>简体中文</strong>
</p>

<p align="center">版本 1.1.0 · MIT</p>

## 项目简介

本仓库包含 `yunlogin-browser` Codex skill，用于以文档驱动、低依赖的方式管理云登浏览器的环境、账号、Cookie、代理、分组、标签、Token 和浏览器自动化。

Skill 明确区分三个 API 面，不能静默混用：

| API 面 | 地址 | 用途 |
| --- | --- | --- |
| 本地 API | 动态发现的回环端口，常见为 `50213`，`/api/v2/...` | 环境管理、浏览器启动/停止、Cookie、分组、代理和标签 |
| 本地客户端 API | 动态发现的回环端口，`/api/v1/...` | 本地桌面客户端辅助能力，例如 GPU 信息和环境数据清理 |
| 管理中心 API | `https://d126447d359e70c0.yunlogin.com/v2/...` | 服务端环境、账号、代理、团队、套餐和公告操作 |

执行真实请求前，必须先阅读对应的接口文档，不要根据接口名称猜参数。

## 核心能力

- **77 个已文档化接口**：23 个本地 API 路由，54 个管理中心路由。
- **环境生命周期**：创建、克隆、更新、分组、打标签和删除环境；所有修改操作都有确认门槛。
- **工作台会话**：每次认证请求前重新读取管理中心页面的当前 Token、用户及公司信息，在仓库外保存验证后的会话快照。
- **CDP 自动化**：启动托管环境并通过 Chrome DevTools Protocol 连接，也可以选择接入 Playwright CLI。
- **已运行 `fb.exe` 支持**：查看 Windows `fb.exe` 当前命令行，规划带 loopback CDP 端口的重启，并在使用前验证 CDP 是否可用。
- **默认安全**：支持 dry-run、仅 loopback 本地访问、敏感字段脱敏，以及高危操作的显式确认。

## 目录结构

```text
yunlogin-browser/
  SKILL.md                 Skill 入口和路由规则
  agents/openai.yaml       Codex UI 元数据
  assets/                  Skill 和 README 使用的图标
  references/              接口文档和工作流指南
  scripts/                 零依赖 Node.js 命令
  scripts/lib/             共享辅助模块
  scripts/dev/             文档维护工具
  LICENSE                  MIT 许可证副本
```

## 环境要求

- 推荐使用 Node.js 22 或更高版本，因为脚本依赖内置的全局 `fetch` 和 `WebSocket`。
- 本地 API 需要正在运行的云登客户端。
- 需要已登录且启用回环 CDP 的云登工作台，才能调用需认证的管理中心 API。
- `fb.exe` 进程查看和重启命令仅支持 Windows。

脚本不需要安装任何第三方 npm 包。

## 安装

使用 Codex skill 安装器安装：

```text
scripts/install-skill-from-github.py --repo PenBo1/yunlogin-browser-skill --path yunlogin-browser
```

也可以直接把 `yunlogin-browser` 文件夹复制到 Codex skills 目录。

## 快速开始

新增 Node.js JavaScript 脚本获取客户端当前端口，每次根据 YunLogin 进程实际监听情况重新发现，不复用示例端口。客户端未运行时先询问是否启动；没有找到安装位置时先询问自定义路径，再提供 [YunLogin 下载入口](https://www.yunlogin.com/?c=7fzh)。详见[启动引导](yunlogin-browser/references/client-api/STARTUP.md)和[端口分析记录](yunlogin-browser/references/client-api/PORTS.md)。

```powershell
# 获取当前端口与客户端就绪状态
node scripts/yunlogin-ports.mjs
node scripts/yunlogin-client.mjs status
# 用户同意启动后，使用发现的安装路径
node scripts/yunlogin-client.mjs start --exe 'C:\path\YunLogin.exe' --confirm-start
# 获取只包含允许公开字段的客户端配置摘要
node scripts/yunlogin-client.mjs config --dry-run
node scripts/yunlogin-client.mjs config

# 检查工作台管理中心会话（浏览器 CDP 连接不依赖它）
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs sync-workbench --dry-run

# 启动托管环境并保存 CDP 会话
node scripts/yunlogin-cdp.mjs start --account-id <account-id> --output session.json

# 查看当前 Windows fb.exe 进程
node scripts/yunlogin-fb-cdp.mjs list --main-only
node scripts/yunlogin-fb-cdp.mjs inspect --browser-id Workbench

# 仅规划使用动态 CDP 端口重开工作台
node scripts/yunlogin-client.mjs start --dry-run

# 确认允许工作台关闭并重开后执行
node scripts/yunlogin-client.mjs start --confirm-restart

# 用当前已验证的工作台 CDP 地址连接 Playwright CLI
$state = node scripts/yunlogin-client.mjs status | ConvertFrom-Json
$cdp = $state.workbench.cdpUrl
playwright-cli -s=yunlogin-workbench attach --cdp=$cdp
playwright-cli -s=yunlogin-workbench tab-list
playwright-cli -s=yunlogin-workbench detach

# 读取一个管理中心接口
node scripts/yunlogin-server-api.mjs browser-settings

# 校验接口文档
node scripts/dev/validate-api-docs.mjs
```

## 已运行 `fb.exe` 的 CDP 接入

Windows 不支持给已经运行的进程动态追加命令行参数，所以 `yunlogin-fb-cdp.mjs` 会按以下流程处理：

1. 找到指定的 `fb.exe` 主进程。
2. 读取当前命令行，但不修改正在运行的进程。
3. 默认把 `--base-data` 等敏感参数脱敏。
4. 基于原参数构建新的命令行，并追加：
   - `--remote-debugging-address=127.0.0.1`
   - `--remote-debugging-port=<port>`
5. 必须传入 `--confirm-restart` 才会停止并重新启动进程。
6. 等待 `/json/version`，再通过 CDP 调用 `Browser.getVersion` 验证连接。

CDP 端口只允许绑定 loopback，不要暴露给其他主机或公网。

## 凭证存储

Token 不会保存在本仓库中，Skill 会把凭证缓存在用户目录：

| 平台 | 路径 |
| --- | --- |
| Windows | `%LOCALAPPDATA%\yunlogin-browser\` |
| 其他平台 | `~/.local/share/yunlogin-browser/` |

不要在日志、Issue、文档或聊天中输出 Token、Cookie 或代理凭证。

## 文档导航

- Skill 说明：[yunlogin-browser/SKILL.md](yunlogin-browser/SKILL.md)
- API 导航：[yunlogin-browser/references/INDEX.md](yunlogin-browser/references/INDEX.md)
- CDP 自动化：[yunlogin-browser/references/workflows/cdp-automation.md](yunlogin-browser/references/workflows/cdp-automation.md)
- Playwright 配对：[yunlogin-browser/references/workflows/playwright-cli.md](yunlogin-browser/references/workflows/playwright-cli.md)
- 脚本说明：[yunlogin-browser/references/scripts.md](yunlogin-browser/references/scripts.md)
- 字段清单：[yunlogin-browser/references/server-api/FIELD_INVENTORY.md](yunlogin-browser/references/server-api/FIELD_INVENTORY.md)
- 测试覆盖：[yunlogin-browser/references/testing.md](yunlogin-browser/references/testing.md)

## 许可证

MIT。根目录许可证见 [LICENSE](LICENSE)。Skill 文件夹内保留了一份完全一致的 [yunlogin-browser/LICENSE](yunlogin-browser/LICENSE)，确保安装后的 Skill 仍然自包含。
