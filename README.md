# 爱回收 iPhone 筛选脚本

在 Quantumult X / Surge 中筛选爱回收在售二手 iPhone，支持按 iOS 版本、型号、价格过滤。

## 文件说明

| 文件 | 说明 |
|------|------|
| `aihuishou_filter.js` | 主脚本（核心筛选逻辑） |
| `aihuishou_filter_quantumultx.conf` | Quantumult X 配置示例 |
| `aihuishou_filter_surge.conf` | Surge 配置示例 |
| `example_usage.js` | Node.js 使用示例 |

## 使用方法

### Quantumult X

1. 将 `aihuishou_filter_quantumultx.conf` 中的内容添加到配置的 `[script]` 部分
2. 修改脚本中的 `TARGET_IOS_VERSIONS` 等参数

### Surge

1. 将 `aihuishou_filter_surge.conf` 中的内容添加到配置的 `[script]` 部分
2. 确保 MITM 已开启并安装证书

## 配置参数

```javascript
const CONFIG = {
  BASE_URL: 'https://www.iaihuishou.com',   // API 地址
  TARGET_IOS_VERSIONS: ['iOS 17', 'iOS 16'], // 目标 iOS 版本
  TARGET_MODELS: [],                         // 型号过滤
  PRICE_RANGE: { min: 0, max: 10000 },       // 价格范围
  MAX_ITEMS: 100,                            // 最大抓取数量
  DELAY: 500                                 // 请求延迟(ms)
};
```

## ⚠️ 注意事项

- 脚本中的 API 接口为示例占位，**需自行抓包替换**为爱回收实际接口
- 请遵守目标网站的服务条款，合理控制请求频率
- 仅供学习交流使用

## License

MIT
