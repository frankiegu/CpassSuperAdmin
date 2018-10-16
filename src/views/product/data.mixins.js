export default {
  data() {
    return {
      modulePermis: [{
        'id': 1,
        'moduleName': '基础模块',
        'created': '2018-05-07 14:16:07',
        'status': 1,
        'permis': [{
          'id': 1,
          'permisName': '账号管理',
          'permisDesc': '',
          'status': 1,
          'permisModuleId': 1,
          'lvl': 1,
          'parentId': null,
          'created': '2018-05-07 14:21:02',
          'updated': '2018-05-07 14:21:04',
          'children': [{
            'id': 2,
            'permisName': '添加、删除',
            'permisDesc': '',
            'status': 1,
            'permisModuleId': 1,
            'lvl': 2,
            'parentId': 1,
            'created': '2018-05-07 14:22:03',
            'updated': '2018-05-07 14:22:05',
            'children': [],
            'checked': false
          }, {
            'id': 3,
            'permisName': '信息编辑',
            'permisDesc': '编辑账号信息',
            'status': 1,
            'permisModuleId': 1,
            'lvl': 2,
            'parentId': 1,
            'created': '2018-05-07 14:22:38',
            'updated': '2018-05-07 14:22:42',
            'children': [],
            'checked': true,
            'disabled': true
          }],
          'checked': false
        }, {
          'id': 4,
          'permisName': '角色管理',
          'permisDesc': '',
          'status': 1,
          'permisModuleId': 1,
          'lvl': 1,
          'parentId': null,
          'created': '2018-05-07 14:21:02',
          'updated': '2018-05-07 14:21:04',
          'children': [{
            'id': 5,
            'permisName': '添加、删除',
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
            'id': 6,
            'permisName': '信息编辑',
            'permisDesc': '编辑职务信息',
            'status': 1,
            'permisModuleId': 2,
            'lvl': 2,
            'parentId': 1,
            'created': '2018-05-07 14:22:38',
            'updated': '2018-05-07 14:22:42',
            'children': [],
            'checked': true,
            'disabled': true
          }],
          'checked': false
        }],
        'allPermisIds': [1, 2, 3, 4, 5, 6],
        'checkedPermisIds': [3, 5, 6],
        'checked': false
      }]
    }
  }
}
