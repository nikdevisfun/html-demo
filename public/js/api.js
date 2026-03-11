/**
 * API 调用模块
 */

/**
 * 加载 demo 列表
 */
export async function loadDemos() {
  const response = await fetch('/api/demos');
  return await response.json();
}

/**
 * 刷新 demo 列表（重新扫描）
 */
export async function refreshDemos() {
  const response = await fetch('/api/demos/refresh', { method: 'POST' });
  const data = await response.json();
  return data.demos;
}
