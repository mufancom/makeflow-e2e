# Makeflow E2E 测试

Powered by [turning](https://github.com/makeflow/turning).

## 开发

### 配置 Chrome/Chromium

参考启动参数：

```powershell
chrome --remote-debugging-port=9222 --user-data-dir=C:\Automation\Puppeteer --guest
```

```bash
chrome --remote-debugging-port=9222 --user-data-dir=/tmp/puppeteer --guest
```

- `--user-data-dir` 按理说我们用了访客模式这个选项应该用不到，但是 Chrome 在有 user data dir 相同的实例运行时，即便 remote debugging port 指定了也不会生效，所以加上这个选项可以避免一些操作流程问题。
- `--guest` 按说目前我们测试都是在隐私模式下跑，但以后说不定会改，所以先用着访客模式应该问题不大。

> Windows 用户可以考虑复制一个快捷方式，方便下次打开。macOS 用户估计也可以？

### 远程工作空间

- 创建时勾选 `makeflow-web` 工作空间模板，然后额外勾选 `makeflow-e2e` 项目模板。这两个模板已经配置了端口转发，包括 9222 端口。
- 本地打开 Chrome/Chromium，参数参照上面。
- 打开 `makeflow-web` 远程项目照常启动 biu 和相关程序，确认在本地访问正常。
- 打开 `makeflow-e2e` 远程项目， `curl http://localhost:9222` 确认相关端口成功转发。执行 `yarn test:makeflow-web` 开始测试。

### 使用 Windows 服务器连接远程空间

由于远程空间和本地延迟较大，进行 E2E 测试速度较慢，我们配置了一台 Windows 服务器（密码管理器搜 puppeteer）用于测试。

服务器上已经安装远程工作空间客户端，使用步骤：

1. 断开本地开发机与远程工作空间的端口转发（远程工作空间 untunnel）。
2. 在 Windows 服务器上远程空间列表中找到对应空间，点击 tunnel 进行端口转发。
3. 在 Windows 服务器上访问 biu 启动相关服务，并打开桌面上的 “Google Chrome 9222”。

### 测试编写

- 定义状态（state）、模式（pattern）、别名（alias）后，需要执行 `yarn update-types:makeflow-web`。
