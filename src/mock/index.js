// mock数据入口
import Mock from 'mockjs'
import demo from './demo'
// import { getScheduleList, getSpaceList } from './schedule'

// demo测试 Mock.mock( rurl, rtype, template )
// 规则参考：https://github.com/nuysoft/Mock/wiki/Mock.mock()
Mock.mock(/\/demo\/list/, 'post', demo.getList)
// Mock.mock(/\/storeStar\/storeList/, 'post', getScheduleList)
// Mock.mock(/\/storeStar\/showcaseList/, 'post', getSpaceList)

export default Mock
