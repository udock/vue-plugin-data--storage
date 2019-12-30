module.exports = {
  external: (id) => /^lodash\/.*|mitt$/.test(id),
  globals: {
    'mitt': 'mitt',
    'babel-runtime/core-js/get-iterator': 'core.getIterator',
    'babel-runtime/core-js/json/stringify': 'core.JSON.stringify',
    '@babel/runtime/helpers/classCallCheck': 'BabelHelpers.classCallCheck',
    '@babel/runtime/helpers/createClass': 'BabelHelpers.createClass',
    'lodash/isArray': '_.isArray',
    'lodash/isObject': '_.isObject',
    'lodash/isString': '_.isString',
    'lodash/set': '_.set'
  }
}
