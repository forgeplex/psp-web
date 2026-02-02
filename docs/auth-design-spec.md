# Auth 模块 - UI 设计规格

> UIUX 出品 | 基于已完成的 HTML 原型整理 | FE 开发参考

## 原型文件位置

原型在 `~/.openclaw/workspace-uiux/projects/psp/prototypes/auth/` 目录下：
- `auth-login.html` — 登录页
- `auth-mfa-setup.html` — MFA 设置流程
- `auth-mfa-verify.html` — MFA 验证页
- `auth-trusted-devices.html` — 信任设备管理

## 设计系统映射

**已确认方案**（Alex 2026-02-02）：Auth 页面使用 Indigo 品牌色，Dashboard 保持 `#18181B`。

品牌色 token 已添加到 `@psp/shared` → `packages/shared/src/tokens/colors.ts`：

```typescript
import { brandColors } from '@psp/shared';

brandColors.primary      // '#6366F1' — Indigo-500
brandColors.primaryHover // '#4F46E5' — Indigo-600
brandColors.primaryLight // '#EEF2FF' — Indigo-50
brandColors.secondary    // '#8B5CF6' — Violet-500
brandColors.gradient     // 'linear-gradient(135deg, #6366F1, #8B5CF6)'
```

Auth 页面引用 `brandColors`，Dashboard 继续用 `baseColors.primary`。

---

## Page 1: 登录页 (`/login`)

### 布局
- 全屏独立页面（无 Header/Sidebar）
- 左右分栏：左侧品牌区 + 右侧表单区
- 移动端 <768px 只显示表单

### 左侧品牌区
- 背景渐变 `linear-gradient(135deg, #6366f1, #8b5cf6)`
- 3 个装饰半透明圆形
- Logo + "PSP Admin" + Slogan + Feature 列表

### 右侧表单区
- Logo + 标题 "登录到 PSP Admin"
- 副标题："输入您的账号信息以访问管理面板"
- 邮箱/用户名输入（prefix: UserOutlined）
- 密码输入（prefix: LockOutlined, 显示/隐藏切换）
- "记住设备" Checkbox
- 登录按钮（primary, block, large）
- 底部 "忘记密码？" 链接
- Footer 版本信息

### 错误处理
- 字段校验：必填 + 格式
- 登录失败：Form 上方红色 Alert
- 错误码 AUTH_001~004

### 尺寸
- 表单 max-width: 400px
- 卡片 padding: 32px
- 圆角: 8px
- 控件高度: 40px

---

## Page 2: MFA 设置 (`/mfa/setup`)

### 布局
- 全屏居中，max-width: 560px

### 顶部
- Logo + 强制 MFA Banner（橙色 #FFF7ED）
- 标题 "设置两步验证"

### Step Indicator（3 步）
1. 选择方式
2. 绑定验证
3. 备用码

Active=紫色 | Completed=绿色+勾 | Inactive=灰色边框

### Step 1: 选择方式
- TOTP 验证器 / Passkey 两个选项卡片
- 选中态：紫色边框 + 浅紫底

### Step 2a: TOTP 绑定
- QR 码 200x200
- 手动密钥（mono 字体 + 复制）
- 6 位 OTP 输入框（48x56px，mono 24px）
  - 自动聚焦、跳转、粘贴
  - 错误：红色边框 + 抖动
  - 成功：绿色边框

### Step 2b: Passkey
- 96px 圆形图标 + 脉冲动画
- 设备名称输入 + 注册按钮

### Step 3: 备用码
- 10 个码，2列5行，mono 字体
- 复制全部 + 下载 .txt
- Checkbox "我已保存" 勾选后才能完成

---

## Page 3: MFA 验证 (`/mfa/verify`)

### 布局
- 全屏居中，max-width: 480px

### 验证方式
- TOTP / Passkey / 备用码 三选一
- 方法选择卡片复用 MfaMethodSelector

### TOTP 验证
- 6 位 OTP 输入（复用 OtpInput 组件）
- 错误消息 + 重试次数
- "信任此设备" Checkbox

### Passkey 验证
- 脉冲动画图标 + 验证按钮

### 备用码验证
- 单行输入，mono 字体，格式 XXXX-XXXX-XXXX

### 验证成功
- 全屏 overlay，绿色 check 弹出动画
- 3 秒后自动跳转

---

## Page 4: 信任设备管理 (`/_authenticated/settings/trusted-devices`)

### 布局
- Dashboard 内页（AppLayout + Sidebar）

### 页面头部
- PageHeader "信任设备管理"
- "撤销所有信任" 按钮（danger ghost）

### 统计卡片（3 个横排）
- 信任设备总数 | 30 天活跃 | 信任时长设置

### 设备 Table
- 列：名称（+图标+当前设备 Badge）| 类型 | OS | 浏览器 | IP | 信任时间 | 最后使用 | 操作
- 操作：重命名 + 撤销信任
- 排序：信任时间、最后使用

### Modal
- 撤销确认：danger 风格
- 重命名：Input，max 50 字符

---

## 组件拆分建议

```
src/components/auth/
  BrandPanel.tsx          # 登录左侧品牌面板
  OtpInput.tsx            # 6 位 OTP 输入（setup + verify 复用）
  MfaMethodSelector.tsx   # 验证方式选择卡片
  BackupCodes.tsx         # 备用码展示/复制/下载
  PasskeyPrompt.tsx       # Passkey 脉冲动画交互
  StepIndicator.tsx       # MFA 步骤指示器
  DeviceIcon.tsx          # 设备类型图标
```

## 关键动画

1. OTP 输入：自动聚焦 → 输入跳转 → 退格回退 → 粘贴全填
2. 错误抖动：translateX shake
3. Passkey 脉冲：3 层 ring，0.6s 间隔，scale 1→1.8 渐隐
4. 成功弹出：scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
5. 所有 transition: 200ms ease
