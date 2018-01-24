export default{
  // 如果参数为true是，聚焦元素
  inserted: function (el, binding) {
    if (binding.value) {
      el.focus();
    } else {
      el.blur();
    }
  }
}
