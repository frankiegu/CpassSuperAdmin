import Mock from 'mockjs'

const List = []
const count = 26
let order = []

// 规则参考：https://github.com/nuysoft/Mock/wiki/Syntax-Specification
for (let i = 0; i < count; i++) {
  if (i % 2 === 0) {
    if (i === 4) {
      let dupOrder = []
      for (var index = 0; index < 3; index++) {
        dupOrder.push(Mock.mock({
          id: Mock.Random.integer(1, 50),
          orderNum: '@guid()',
          name: Mock.Random.cname(),
          fieldName: Mock.Random.ctitle(),
          bookDate: i > 3 ? `2018-09-${(2 + i > 9 ? 2 + i : '0' + (2 + i))}` : `2018-08-${25 + i}`,
          bookStartTime: Mock.Random.time(),
          bookEndTime: Mock.Random.time(),
          bookStartDate: Mock.Random.date(),
          bookEndDate: Mock.Random.date(),
          'type|1': [1, 2, 3, 4, 6, 7],
          spaceLogo: 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20180725/20180725161020862mxD.jpeg'
        }))
      }
      List.push({
        bookDate: i > 3 ? `2018-09-${(2 + i > 9 ? 2 + i : '0' + (2 + i))}` : `2018-08-${25 + i}`,
        orderList: dupOrder
      })
    } else if (i === 8 || i === 10 || i === 14) {
      let dupOrder = []
      for (var idx = 0; idx < 1; idx++) {
        dupOrder.push(Mock.mock({
          id: Mock.Random.integer(1, 50),
          orderNum: '@guid()',
          name: Mock.Random.cname(),
          fieldName: Mock.Random.ctitle(),
          bookDate: i > 3 ? `2018-09-${(2 + i > 9 ? 2 + i : '0' + (2 + i))}` : `2018-08-${25 + i}`,
          bookStartTime: Mock.Random.time(),
          bookEndTime: Mock.Random.time(),
          bookStartDate: Mock.Random.date(),
          bookEndDate: Mock.Random.date(),
          'type|1': [1, 2, 3, 4, 6, 7],
          spaceLogo: 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20180725/20180725161020862mxD.jpeg'
        }))
      }
      List.push({
        bookDate: i > 3 ? `2018-09-${(2 + i > 9 ? 2 + i : '0' + (2 + i))}` : `2018-08-${25 + i}`,
        orderList: dupOrder
      })
    } else {
      order.push(Mock.mock({
        id: Mock.Random.integer(1, 50),
        orderNum: '@guid()',
        name: Mock.Random.cname(),
        fieldName: Mock.Random.ctitle(),
        bookDate: i > 3 ? `2018-09-${(2 + i > 9 ? 2 + i : '0' + (2 + i))}` : `2018-08-${25 + i}`,
        bookStartTime: Mock.Random.time(),
        bookEndTime: Mock.Random.time(),
        bookStartDate: Mock.Random.date(),
        bookEndDate: Mock.Random.date(),
        'type|1': [1, 2, 3, 4, 6, 7],
        spaceLogo: 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20180725/20180725161020862mxD.jpeg'
      }))
      List.push({
        bookDate: i > 3 ? `2018-09-${(2 + i > 9 ? 2 + i : '0' + (2 + i))}` : `2018-08-${25 + i}`,
        orderList: []
      })
    }
  }
}

export const getScheduleList = () => {
  return {
    'status': 'true',
    'code': '200',
    'msg': null,
    'info': {
      'currentDate': '2018-09-02',
      'result': List
    }
  }
}

let roleList = []
for (let i = 0; i < count; i++) {
  roleList.push(Mock.mock({
    'id': i + 4,
    'roleName': Mock.Random.ctitle(),
    'roleDesc': Mock.Random.csentence(5, 30),
    'supervisorCount': Mock.Random.integer(1, 50),
    'status|1': [0, 1]
  }))
}

export const getRoleList = () => {
  return {
    'status': 'true',
    'code': '200',
    'msg': null,
    'info': {
      'name': null,
      'page': {
        'pageNum': 1,
        'pageSize': 10,
        'startRow': 0,
        'endRow': 10,
        'total': 38,
        'pages': 4,
        'result': roleList
      }
    }
  }
}

let userInfo = {
  'id': 31,
  'name': 'CPASS前端',
  'username': '13800131004',
  'email': null,
  'statusCode': 0,
  'roleName': null,
  'role': null,
  'supervisorDesc': '前端',
  'headImgUrl': 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20181026/20181026144540265CJ5.jpg'

}
export const getUserInfo = () => {
  return {
    'status': 'true',
    'code': '200',
    'msg': null,
    'info': userInfo
  }
}
