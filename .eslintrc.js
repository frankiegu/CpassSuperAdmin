module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  // extends: 'eslint:recommended', // 禁止未使用过的变量，所以禁用了
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  // 自定义个别规则写在这，0忽略，1警告，2报错
  'rules': {
    'arrow-parens': 0,
    'accessor-pairs': 1,
    'arrow-spacing': [1, {
      'before': true,
      'after': true
    }],
    'block-spacing': [1, 'always'],
    'brace-style': [1, '1tbs', {
      'allowSingleLine': true
    }],
    'camelcase': [0, {
      'properties': 'always'
    }],
    'comma-dangle': [1, 'never'],
    'comma-spacing': [1, {
      'before': false,
      'after': true
    }],
    'comma-style': [1, 'last'],
    'constructor-super': 1,
    'curly': [1, 'multi-line'],
    'dot-location': [1, 'property'],
    'eol-last': 1,
    'eqeqeq': 0,
    'generator-star-spacing': 0,
    'handle-callback-err': [1, '^(err|error)$'],
    'jsx-quotes': [1, 'prefer-single'],
    'key-spacing': [1, {
      'beforeColon': false,
      'afterColon': true
    }],
    'keyword-spacing': [1, {
      'before': true,
      'after': true
    }],
    // 允许调用 new 操作符有首字母小写或首字母大写的函数
    "new-cap": [0, {"newIsCap": false, "capIsNew": false}],
    'new-parens': 1,
    'no-array-constructor': 1,
    'no-caller': 1,
    'no-console': 'off',
    'no-class-assign': 1,
    'no-cond-assign': 1,
    'no-const-assign': 1,
    'no-control-regex': 0,
    'no-delete-var': 1,
    'no-dupe-args': 1,
    'no-dupe-class-members': 1,
    'no-dupe-keys': 1,
    'no-duplicate-case': 1,
    'no-empty-character-class': 1,
    'no-empty-pattern': 1,
    'no-eval': 1,
    'no-ex-assign': 1,
    'no-extend-native': 1,
    'no-extra-bind': 1,
    'no-extra-boolean-cast': 1,
    'no-extra-parens': [1, 'functions'],
    'no-fallthrough': 1,
    'no-floating-decimal': 1,
    'no-func-assign': 1,
    'no-implied-eval': 1,
    'no-inner-declarations': [1, 'functions'],
    'no-invalid-regexp': 1,
    'no-irregular-whitespace': 1,
    'no-iterator': 1,
    'no-label-var': 1,
    'no-labels': [1, {
      'allowLoop': false,
      'allowSwitch': false
    }],
    'no-lone-blocks': 1,
    'no-mixed-spaces-and-tabs': 1,
    // 忽略行尾注释前的多个空格
    'no-multi-spaces': [0, {'ignoreEOLComments': true}],
    'no-multi-str': 1,
    'no-multiple-empty-lines': [1, {
      'max': 1
    }],
    'no-native-reassign': 1,
    'no-negated-in-lhs': 1,
    'no-new-object': 1,
    'no-new-require': 1,
    'no-new-symbol': 1,
    'no-new-wrappers': 1,
    'no-obj-calls': 1,
    'no-octal': 1,
    'no-octal-escape': 1,
    'no-path-concat': 1,
    'no-proto': 1,
    'no-redeclare': 1,
    'no-regex-spaces': 1,
    'no-return-assign': [1, 'except-parens'],
    'no-self-assign': 1,
    'no-self-compare': 1,
    'no-sequences': 1,
    'no-shadow-restricted-names': 1,
    'no-spaced-func': 1,
    'no-sparse-arrays': 1,
    'no-this-before-super': 1,
    'no-throw-literal': 1,
    'no-trailing-spaces': 1,
    'no-undef': 1,
    'no-undef-init': 1,
    'no-unexpected-multiline': 1,
    'no-unmodified-loop-condition': 1,
    'no-unneeded-ternary': [1, {
      'defaultAssignment': false
    }],
    'no-unreachable': 1,
    'no-unsafe-finally': 1,
    "no-unused-vars": 1, // 将”未使用的变量“调整为警告级别，原为错误级别，更多规则请看官网
    'no-useless-call': 1,
    'no-useless-computed-key': 1,
    'no-useless-constructor': 1,
    'no-useless-escape': 0,
    'no-whitespace-before-property': 1,
    'no-with': 1,
    'one-var': [1, {
      'initialized': 'never'
    }],
    'operator-linebreak': [1, 'after', {
      'overrides': {
        '?': 'before',
        ':': 'before'
      }
    }],
    'padded-blocks': [1, 'never'],
    'quotes': [1, 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
    "semi": 0,
    'semi-spacing': [1, {
      'before': false,
      'after': true
    }],
    'space-before-blocks': [1, 'always'],
    'space-before-function-paren': 0,
    'space-in-parens': [1, 'never'],
    'space-infix-ops': 1,
    'space-unary-ops': [1, {
      'words': true,
      'nonwords': false
    }],
    'spaced-comment': [1, 'always', {
      'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
    }],
    'template-curly-spacing': [1, 'never'],
    'use-isnan': 1,
    'valid-typeof': 1,
    'wrap-iife': [1, 'any'],
    'yield-star-spacing': [1, 'both'],
    'yoda': [1, 'never'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    // 强制在花括号中前后添加一个空格
    'object-curly-spacing': [2, 'always', {
      objectsInObjects: false
    }],
    'array-bracket-spacing': [1, 'never']
  }
}

