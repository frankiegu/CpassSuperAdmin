export default {
  data() {
    return {
      modulePermis: [{
        'moduleId': 2,
        'moduleName': '增值服务',
        'permission': [{
          'id': 18,
          'name': '账号管理',
          'permisDesc': '',
          'status': 1,
          'permisModuleId': 1,
          'lvl': 1,
          'parentId': null,
          'children': [{
            'id': 19,
            'name': '添加、删除',
            'permisDesc': '',
            'status': 1,
            'permisModuleId': 1,
            'lvl': 2,
            'parentId': 1,
            'created': '2018-05-07 14:22:03',
            'updated': '2018-05-07 14:22:05',
            'children': [],
            'checked': true,
            'mustCheck': true
          }, {
            'id': 20,
            'name': '信息编辑',
            'permisDesc': '编辑账号信息',
            'status': 1,
            'permisModuleId': 1,
            'lvl': 2,
            'parentId': 1,
            'created': '2018-05-07 14:22:38',
            'updated': '2018-05-07 14:22:42',
            'children': [],
            'checked': true,
            'mustCheck': true
          }, {
            'id': 24,
            'name': '信息2编辑',
            'permisDesc': '编辑账号信息',
            'status': 1,
            'permisModuleId': 1,
            'lvl': 2,
            'parentId': 1,
            'created': '2018-05-07 14:22:38',
            'updated': '2018-05-07 14:22:42',
            'children': [],
            'checked': true,
            'mustCheck': true
          }],
          'checked': false
        }, {
          'id': 21,
          'name': '角色管理',
          'permisDesc': '',
          'status': 1,
          'permisModuleId': 1,
          'lvl': 1,
          'parentId': null,
          'children': [{
            'id': 22,
            'name': '添加、删除',
            'permisDesc': '',
            'status': 1,
            'permisModuleId': 2,
            'lvl': 2,
            'parentId': 1,
            'created': '2018-05-07 14:22:03',
            'updated': '2018-05-07 14:22:05',
            'children': [],
            'checked': false
          }, {
            'id': 23,
            'name': '信息编辑',
            'permisDesc': '编辑职务信息',
            'status': 1,
            'permisModuleId': 2,
            'lvl': 2,
            'parentId': 1,
            'created': '2018-05-07 14:22:38',
            'updated': '2018-05-07 14:22:42',
            'children': [],
            'checked': true
          }],
          'checked': false
        }],
        'checkIdList': [20, 19, 24]
      }]
    }
  }
}
