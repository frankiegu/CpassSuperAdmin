import Mock from 'mockjs'
import demoAPI from './demo'

// mock-demo
Mock.mock(/\/examples\/demo/, 'get', demoAPI.getDemo)

export default Mock
