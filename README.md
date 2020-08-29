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

定义状态（state）、模式（pattern）、别名（alias）后，需要执行 `yarn update-types:makeflow-web`。此脚本将会获取定义的相关信息并生成类型文件，方便智能提示和类型检查。

### 最佳实践

目前 Turning 还没有成型的最佳实践，所以此项目也就成了 Turning 在 E2E 测试方面的一个试验田。

#### 心智负担

在使用 Turning 编写 E2E 测试的有限经验中，我们发现状态转换测试其实具体到 E2E 测试场景，为开发者带来了不少的心智负担，这些负担可能会也可能不会随着开发者对测试项目的熟悉而减少。

在实际使用中，状态转移通常会涉及到由多个状态组成的复合状态，并且很多转移都有特定的前置条件。举例来说，在此项目中，涉及到 `modal:*` 状态，用来表示当前的对话框，并且在默认匹配模式（pattern）中排除了 `modal:*` 状态，避免在有对话框出现时发生意外的状态转移。类似的还有 `navigation-block:*` 状态。

状态粒度越小，这类负担会越大，所以在实践中，如非必要，应该维持适当的状态粒度。

举例来说，创建流程的过程中，我们可以有两种选择：

1. 增加流程编辑过程中可能出现的各种状态，将流程创建过程拆分为可以由 Turning 自行组合的多个状态转移过程。
2. 将整个流程编辑过程作为一个状态转移过程编写，通过添加多个完整的流程编辑过程来提高覆盖率。

实际可行的基本是第 2 种了。但是有没有一个精准的衡量标准？目前恐怕没有，需要在后续实践中进行总结。

#### 状态分类

在此项目中，有两种类型的状态：一为路由状态，通常是以类似路径的方式表示，如 `/login`、`/app/primary/workbench`、`/app/sidebar/achievements`（注意平行路由表述方式）；二为逻辑状态，通常以 `:` 分隔层级，如 `session:registered`，`procedure:simple:created`。下面给状态表中可以找到一些总结性的状态说明，也请在测试编写过程中及时更新、补充。

## 状态表

请按需及时更新状态表内容。

### 路由状态表

website 程序没有平行路由，所以直接以 `/website` 加类似实际路由的方式表示。如：

- `/website/login`

app 则区分平行路由，以 `/app/{primary,sidebar,overlay}` 加类似实际路由的方式表示。如

- `/app/primary/workbench`
- `/app/primary/teams/default/procedures`
- `/app/sidebar/achievements`

**这里注意一个很重要的约定**：

- 使用 `/app/sidebar`，`/app/overlay`（注意没有后面的具体路径）来表示对应平行路由没有匹配的状态。
- 当进入 `/app/*` 后，应该始终保持一个 `/app/primary/**`、一个 `/app/sidebar{,/**}` 和一个 `/app/overlay{,/**}`。比如关闭侧边栏，可以使用状态转移：`/app/sidebar/**` -> `/app/sidebar`。
- 使用 `/app` 作为 `/website/**` 到 `/app/**` 之间的过渡状态，这个状态会被 `turn`/`spawn` 为以上三个平行路由状态。

### 逻辑状态表

- `session:*` 表示会话相关状态。
- 其他业务相关状态以业务名称开头，如 `procedure:*`

## 其他

### `turn` 和 `spawn`

在 Turning 中：`turn` 是指将一组状态变为另一组状态，之前的状态就不再存在了；`spawn` 是指从一组状态“产生”另一组状态，之前的状态依然存在（注意不要和状态转换后删掉和增加的部分混淆，`spawn` 产生新状态组合时，新状态组合中也会删掉指定的相关状态）。

此项目中也也使用了 `spawn`，但是实现并未完全契合其语义，要注意一些特殊情况。具体来讲，我们在 `/app` 进入 `/app/**` 时使用了 `spawn`，此时语义是产生了一个新的状态，与之前的状态之间互相独立、互不影响。但实际上，虽然创建了新的浏览器标签页，但是由于是同一个登录用户，一些操作当然会对其他分支的实际状态产生影响。

就 `spawn` 时关注的几个状态而言，可以理解为，如果用户注册、登录状态状态不发生改变，那么每次进入 `/app/**` 时，我们测试关心的其他状态也需要能够被认为是没有改变的。在这样的假设下，**如果我们在其中一个分支退出登录、或者切换组织，就会破坏掉相关近似的状态，使测试无法正常进行**，于是对于依赖相关 `spawn` 分支的状态转移，我们不能进行类似退出登录这样的操作。

也因为如此，在进行相关转移时，如果涉及到资源创建和校验，资源名称需要在不同的分支互不相同，这个可以借由 `context.data` 进行生成和获取。

### 测试文件结构

目前暂时使用的结构将状态和转移分别放在 `@states` 和 `@transitions` 文件夹中，按业务划分具体的子文件夹和文件。
