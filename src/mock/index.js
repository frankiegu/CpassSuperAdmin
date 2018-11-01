// mock数据入口
import Mock from 'mockjs'
import demo from './demo'
import { getUserInfo } from './role'

// demo测试 Mock.mock( rurl, rtype, template )
// 规则参考：https://github.com/nuysoft/Mock/wiki/Mock.mock()
Mock.mock(/\/demo\/list/, 'post', demo.getList)
// Mock.mock(/\/role\/list/, 'get', getRoleList)
Mock.mock(/\/supervisor\/getInfo/, 'get', getUserInfo)

export default Mock
