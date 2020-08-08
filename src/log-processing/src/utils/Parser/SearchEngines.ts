// Todo: список поисковых движков не полный, нужно дополнить весь

export default [
  {
    name: 'Google',
    hostnames: ['www.google.com', 'www.google.co.uk', 'www.google.ru'],
    queryParams: ['q']
  }, {
    name: 'Bing',
    hostnames: ['www.bing.com'],
    queryParams: ['q']
  }, {
    name: 'Baidu',
    hostnames: ['www.baidu.com'],
    queryParams: ['wd', 'word']
  },
  {
    name: 'Yahoo',
    hostnames: ['www.yahoo.com', 'yahoo.com', 'm.yahoo.com'],
    queryParams: ['p']
  }, {
    name: 'Яндекс',
    hostnames: ['www.yandex.com', 'yande.ru'],
    queryParams: ['text']
  }
]
