// demo: type="formData.creditLevel | statusFilter(filtersStatusList)"
// 第一个参数是：formData.creditLevel
// 第二个参数是：filtersStatusList
export function statusFilter(status, list) {
  if (!status) return ''

  return list[status]
}
