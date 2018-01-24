// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint', // 支持babel
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    "browser": true, // 不会将window上的全局变量判断为未定义的变量
    "es6": true // 支持es6的语法
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard', // 使用eslint-config-standard的配置
  // required to lint *.vue files
  plugins: [
    'html' // 支持.vue文件的检测
  ],
  // add your custom rules here
  'rules': { // 自定义个别规则写在这，0忽略，1警告，2报错
    'space-before-function-paren': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // 行末分号不检测, 可有可无
    "semi": 0,
    // allow async-await
    'generator-star-spacing': 0,
    "no-unused-vars": 1, // 将”未使用的变量“调整为警告级别，原为错误级别，更多规则请看官网
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
