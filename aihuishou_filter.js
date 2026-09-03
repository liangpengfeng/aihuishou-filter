/**
 * 爱回收严选 iPhone 筛选脚本 (Quantumult X / Surge / Loon / Node)
 *
 * ✅ 已接入爱回收真实接口（严选商城搜索 API）
 * ✅ 支持筛选：型号 / 容量 / 成色 / 价格 / 电池效率
 * ⚠️ iOS 系统版本：搜索接口不返回该字段（在验机报告接口里），后续抓到再启用 iosVersions
 *
 * ── 用法一：QX 手动/定时运行（主动拉取并通知）──────────
 * [task_local]
 * 0 9-22 * * * https://raw.githubusercontent.com/liangpengfeng/aihuishou-filter/main/aihuishou_filter.js, tag=爱回收筛选
 *
 * ── 用法二：重写模式（打开爱回收严选搜索时自动过滤结果）──────
 * [rewrite_local]
 * ^https:\/\/dubai\.aihuishou\.com\/ahs-yanxuan-service\/products\/search-goods-v2 url script-response-body https://raw.githubusercontent.com/liangpengfeng/aihuishou-filter/main/aihuishou_filter.js
 * [mitm]
 * hostname = dubai.aihuishou.com, sr.aihuishou.com
 */

const CONFIG = {
  keyword: 'iPhone 15',        // 搜索关键词
  models: [],                  // 型号过滤，如 ['15 Pro']；空=不限
  capacity: [],                // 容量过滤，如 ['256G']；空=不限
  fineness: [],                // 成色过滤，如 ['99新','95新']；空=不限
  priceMin: 0,                 // 最低价（元）
  priceMax: 0,                 // 最高价，0=不限
  batteryMin: 0,               // 电池效率下限，如 90；0=不限
  excludeWords: ['贴膜'],      // 名称含任一关键词则剔除
  iosVersions: [],             // iOS 版本（预留，搜索接口暂不返回该字段）
  maxPages: 3,                 // 最多抓几页（每页30条）
  pageSize: 30,
  notifyTop: 10                // 通知里显示前几条
};

const API = 'https://dubai.aihuishou.com/ahs-yanxuan-service/products/search-goods-v2';
const APP_ID = '10002';
const SALT = '34694d9d74954784';

/* ─────────── 环境适配 ─────────── */
const isQX = typeof $task !== 'undefined';
const isSurge = typeof $httpClient !== 'undefined';

function httpPost(url, body) {
  const ts = Math.floor(Date.now() / 1000);
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Ahs-App-Id': APP_ID,
    'Ahs-Timestamp': String(ts),
    'Ahs-Sign': md5(ts + SALT),
    'Ahs-App-Version': '7.15.5',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  };
  if (isQX) return $task.fetch({ url, method: 'POST', headers, body }).then(r => r.body);
  if (isSurge) return new Promise((res, rej) => $httpClient.post({ url, headers, body }, (err, resp, data) => err ? rej(err) : res(data)));
  return fetch(url, { method: 'POST', headers, body }).then(r => r.text());
}

function notify(title, sub, body) {
  if (isQX) $notify(title, sub, body);
  else if (isSurge) $notification.post(title, sub, body);
  else console.log(`【${title}】${sub}\n${body}`);
}

/* ─────────── MD5 ─────────── */
function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];
a = ff(a, b, c, d, k[0], 7, -680876936);
d = ff(d, a, b, c, k[1], 12, -389564586);
c = ff(c, d, a, b, k[2], 17, 606105819);
b = ff(b, c, d, a, k[3], 22, -1044525330);
a = ff(a, b, c, d, k[4], 7, -176418897);
d = ff(d, a, b, c, k[5], 12, 1200080426);
c = ff(c, d, a, b, k[6], 17, -1473231341);
b = ff(b, c, d, a, k[7], 22, -45705983);
a = ff(a, b, c, d, k[8], 7, 1770035416);
d = ff(d, a, b, c, k[9], 12, -1958414417);
c = ff(c, d, a, b, k[10], 17, -42063);
b = ff(b, c, d, a, k[11], 22, -1990404162);
a = ff(a, b, c, d, k[12], 7, 1804603682);
d = ff(d, a, b, c, k[13], 12, -40341101);
c = ff(c, d, a, b, k[14], 17, -1502002290);
b = ff(b, c, d, a, k[15], 22, 1236535329);
a = gg(a, b, c, d, k[1], 5, -165796510);
d = gg(d, a, b, c, k[6], 9, -1069501632);
c = gg(c, d, a, b, k[11], 14, 643717713);
b = gg(b, c, d, a, k[0], 20, -373897302);
a = gg(a, b, c, d, k[5], 5, -701558691);
d = gg(d, a, b, c, k[10], 9, 38016083);
c = gg(c, d, a, b, k[15], 14, -660478335);
b = gg(b, c, d, a, k[4], 20, -405537848);
a = gg(a, b, c, d, k[9], 5, 568446438);
d = gg(d, a, b, c, k[14], 9, -1019803690);
c = gg(c, d, a, b, k[3], 14, -187363961);
b = gg(b, c, d, a, k[8], 20, 1163531501);
a = gg(a, b, c, d, k[13], 5, -1444681467);
d = gg(d, a, b, c, k[2], 9, -51403784);
c = gg(c, d, a, b, k[7], 14, 1735328473);
b = gg(b, c, d, a, k[12], 20, -1926607734);
a = hh(a, b, c, d, k[5], 4, -378558);
d = hh(d, a, b, c, k[8], 11, -2022574463);
c = hh(c, d, a, b, k[11], 16, 1839030562);
b = hh(b, c, d, a, k[14], 23, -35309556);
a = hh(a, b, c, d, k[1], 4, -1530992060);
d = hh(d, a, b, c, k[4], 11, 1272893353);
c = hh(c, d, a, b, k[7], 16, -155497632);
b = hh(b, c, d, a, k[10], 23, -1094730640);
a = hh(a, b, c, d, k[13], 4, 681279174);
d = hh(d, a, b, c, k[0], 11, -358537222);
c = hh(c, d, a, b, k[3], 16, -722521979);
b = hh(b, c, d, a, k[6], 23, 76029189);
a = hh(a, b, c, d, k[9], 4, -640364487);
d = hh(d, a, b, c, k[12], 11, -421815835);
c = hh(c, d, a, b, k[15], 16, 530742520);
b = hh(b, c, d, a, k[2], 23, -995338651);
a = ii(a, b, c, d, k[0], 6, -198630844);
d = ii(d, a, b, c, k[7], 10, 1126891415);
c = ii(c, d, a, b, k[14], 15, -1416354905);
b = ii(b, c, d, a, k[5], 21, -57434055);
a = ii(a, b, c, d, k[12], 6, 1700485571);
d = ii(d, a, b, c, k[3], 10, -1894986606);
c = ii(c, d, a, b, k[10], 15, -1051523);
b = ii(b, c, d, a, k[1], 21, -2054922799);
a = ii(a, b, c, d, k[8], 6, 1873313359);
d = ii(d, a, b, c, k[15], 10, -30611744);
c = ii(c, d, a, b, k[6], 15, -1560198380);
b = ii(b, c, d, a, k[13], 21, 1309151649);
a = ii(a, b, c, d, k[4], 6, -145523070);
d = ii(d, a, b, c, k[11], 10, -1120210379);
c = ii(c, d, a, b, k[2], 15, 718787259);
b = ii(b, c, d, a, k[9], 21, -343485551);
x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);
}
function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}
function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
function md51(s) {
var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
for (i=64; i<=s.length; i+=64) { md5cycle(state, md5blk(s.substring(i-64, i))); }
s = s.substring(i-64);
var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
for (i=0; i<s.length; i++) tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
tail[i>>2] |= 0x80 << ((i%4) << 3);
if (i > 55) { md5cycle(state, tail); for (i=0; i<16; i++) tail[i] = 0; }
tail[14] = n*8;
md5cycle(state, tail);
return state;
}
function md5blk(s) {
var md5blks = [], i;
for (i=0; i<64; i+=4) { md5blks[i>>2] = s.charCodeAt(i) + (s.charCodeAt(i+1) << 8) + (s.charCodeAt(i+2) << 16) + (s.charCodeAt(i+3) << 24); }
return md5blks;
}
var hex_chr = '0123456789abcdef'.split('');
function rhex(n) {
var s='', j=0;
for(; j<4; j++) s += hex_chr[(n >> (j*8+4)) & 0x0F] + hex_chr[(n >> (j*8)) & 0x0F];
return s;
}
function hex(x) { for (var i=0; i<x.length; i++) x[i] = rhex(x[i]); return x.join(''); }
function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
function md5(s) { return hex(md51(unescape(encodeURIComponent(s)))); }

/* ─────────── 筛选逻辑 ─────────── */
function batteryLower(tag) {
  const m = tag.match(/电池(\d+)%?-?(\d+)?%/);
  if (!m) return -1;
  return m[2] ? parseInt(m[1]) : parseInt(m[1]); // 区间取下限
}

function matches(item, cfg) {
  const name = item.name || '';
  if (cfg.excludeWords.some(w => name.includes(w))) return false;
  if (cfg.models.length && !cfg.models.some(k => name.includes(k))) return false;
  if (cfg.capacity.length && !cfg.capacity.some(k => (item.memoryDesc || '').includes(k))) return false;
  if (cfg.fineness.length && !cfg.fineness.includes(item.gaeaFinenessName)) return false;
  const price = item.activityAfterPrice || item.price || 0;
  if (cfg.priceMin && price < cfg.priceMin) return false;
  if (cfg.priceMax && price > cfg.priceMax) return false;
  if (cfg.batteryMin) {
    const tags = item.productTag || [];
    const bat = Math.max(...tags.map(batteryLower));
    if (bat < cfg.batteryMin) return false;
  }
  return true;
}

function fmtItem(it, i) {
  const price = it.activityAfterPrice || it.price;
  return `${i + 1}. ${it.name.replace('苹果 ', '')}\n   ¥${price} | ${it.gaeaFinenessName} | ${(it.productTag || []).join('/')}`;
}

/* ─────────── 主流程（主动拉取模式） ─────────── */
async function main() {
  const all = [];
  for (let p = 1; p <= CONFIG.maxPages; p++) {
    const body = await httpPost(API, JSON.stringify({
      keyword: CONFIG.keyword, currentPage: p, pageSize: CONFIG.pageSize
    }));
    let j; try { j = JSON.parse(body); } catch (e) { break; }
    if (j.code !== 0 || !j.data || !j.data.length) break;
    all.push(...j.data);
    if (all.length >= (j.totalCount || 0)) break;
  }

  const filtered = all.filter(it => matches(it, CONFIG))
                      .sort((a, b) => (a.activityAfterPrice || a.price) - (b.activityAfterPrice || b.price));

  const lines = filtered.slice(0, CONFIG.notifyTop).map(fmtItem);
  const summary = `共${all.length}台，符合${filtered.length}台`;
  notify('📱 爱回收筛选 · ' + CONFIG.keyword, summary, lines.join('\n') || '无符合条件商品');

  console.log(summary + '\n' + filtered.map(fmtItem).join('\n'));
  return filtered;
}

/* ─────────── 重写模式：拦截搜索响应并过滤 ─────────── */
if (typeof $response !== 'undefined') {
  try {
    const j = JSON.parse($response.body);
    if (j.data && j.data.length) {
      const kept = j.data.filter(it => matches(it, CONFIG));
      notify('📱 爱回收筛选', `本页${j.data.length}台，符合${kept.length}台`,
        kept.slice(0, CONFIG.notifyTop).map(fmtItem).join('\n') || '无符合条件');
      j.data = kept;
      j.totalCount = kept.length;
    }
    $done({ body: JSON.stringify(j) });
  } catch (e) { $done({}); }
} else if (isQX || isSurge) {
  main().finally(() => { if (typeof $done === 'function') $done({}); });
} else if (typeof module !== 'undefined') {
  module.exports = { main, matches, md5, CONFIG };
  if (require.main === module) main().catch(console.error);

}
