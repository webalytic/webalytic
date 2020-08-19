import numeral from 'numeral'

export default (Vue) => {
  Vue.filter('number', (value) => numeral(+value).format())
  Vue.filter('number-short', (value) => numeral(+value).format('0a'))
  Vue.filter('decimal', (value) => numeral(+value).format('0.0[0000]'))

  Vue.filter('percent', (value) => {
    // eslint-disable-next-line no-param-reassign
    if (value && value.toFixed) value = +value.toFixed(2)
    return numeral(value).format('0.0[00]')
  })

  Vue.filter('money', (value) => numeral(+value).format('0,0.00'))

  Vue.filter('ucFirst', (value) => value[0].toUpperCase() + value.slice(1))
}
