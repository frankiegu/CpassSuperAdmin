// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  // 支持babel
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    // 不会将window上的全局变量判断为未定义的变量
    "browser": true,
    // 支持es6的语法
    "es6": true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  // 使用eslint-config-standard的配置
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html' // 支持.vue文件的检测
  ],
  // add your custom rules here
  // 自定义个别规则写在这，0忽略，1警告，2报错
  'rules': {
    // 允许调用 new 操作符有首字母小写或首字母大写的函数
    "new-cap": [0, {"newIsCap": false, "capIsNew": false}],
    'space-before-function-paren': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // 行末分号不检测, 可有可无
    "semi": 0,
    // allow async-await
    'generator-star-spacing': 0,
    // 将”未使用的变量“调整为警告级别，原为错误级别，更多规则请看官网
    "no-unused-vars": 1,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
