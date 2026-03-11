/**
 * UI 交互模块
 */

/**
 * 设置刷新按钮状态
 */
export function setRefreshButtonState(isLoading) {
  const btn = document.querySelector('.refresh-btn');

  if (isLoading) {
    btn.classList.add('loading');
  } else {
    btn.classList.remove('loading');
  }
}
