(function (window, document) {
  var WebAlyticSDK = {};

  var state = {
    isInitialized: false,
    apiUrl: null
  };

  /** HELPERS BLOCK */

  // Возвращает true, если объект является массивом и false, если он массивом не является.
  var isArray = function (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  };

  // Возвращает значение cookie по имени
  var getCookie = function (cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  };

  // Функция определят возможный домен верхнего уровня
  var domainsWithZoneBehaviors = ['msk.ru', 'com.br'];
  var getTopHost = function () {
    var result = location.hostname;
    var hostnameSplit = location.hostname.split('.');

    if (hostnameSplit.length > 2) {
      result = location.hostname.split('.').reverse().slice(0, 2).reverse()
        .join('.');
      if (~domainsWithZoneBehaviors.indexOf(result)) {
        result = location.hostname.split('.').reverse().slice(0, 3).reverse()
          .join('.');
      }
    }
    return result;
  };

  // Устанавливает значение cookie по имени
  var setCookie = function (cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=" + getTopHost() + ";path=/";
  };


  // Возвращает новый сгененированный уникальный идентификатор
  var generatreUID = function () {
    return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11)
      .replace(/1|0/g, function () {
        return (0 | Math.random() * 16).toString(16)
      })
      .replace(/-/g, '');
  };

  // Возвращает найденый в cookie или новый сгененированный уникальный идентификатор
  var findOrCreateUID = function () {
    var cname = 'adm.uid';
    var uid = getCookie(cname);
    if (!uid || uid.length !== 32) {
      uid = generatreUID();
      setCookie(cname, uid);
    }
    return uid;
  };

  // Метод реализующий отправку запроса на сервер трекера данных. Данные метод использует Beacon API или XMLHttpRequest для отправки POST запросов.
  var sendPostRequest = function (query, body) {
    query.push('cid=' + findOrCreateUID());
    query.push('tid=' + state.resourceId);
    query.push('z=' + Math.random());
    query.push('sr=' + [screen.width, screen.height].join('x'));
    query.push('ds=sdk');

    var url = [
      state.apiUrl,
      '/collect',
      '?',
      query.join('&')
    ].join('');

    if (window.navigator.sendBeacon) {
      var blob = new Blob([JSON.stringify(body || {})], { type: 'text/plain' });
      window.navigator.sendBeacon(url, blob);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.withCredentials = true;
      var data = JSON.stringify(body);
      xhr.send(data);
    }
  };
  /** END HELPERS BLOCK */

  WebAlyticSDK.push = function (item) {
    try {
      if (!isArray(item)) throw new TypeError('WebAlyticSDK: Push item is not array');

      var method = item[0];
      var args = item[1];

      if (typeof WebAlyticSDK[method] !== 'function' || method === 'push') { throw new ReferenceError('WebAlyticSDK: Not found method ' + method); }

      WebAlyticSDK[method](args);
    } catch (err) {
      console.error(err);
    }
  };

  WebAlyticSDK.init = function (config) {
    if (!config) config = {};
    if (!config.apiUrl) throw new TypeError('WebAlyticSDK: Init must set api url');
    if (!config.resourceId) throw new TypeError('WebAlyticSDK: Init must set resourceId');
    if (state.isInitialized) throw new Error('WebAlyticSDK: WebAlyticSDK already init');

    state.isInitialized = true;
    state.apiUrl = config.apiUrl;
    state.resourceId = config.resourceId;
  };

  WebAlyticSDK.hit = function () {
    var url = encodeURIComponent(document.URL);
    var referrer = encodeURIComponent(document.referrer);

    sendPostRequest([
      't=pageview',
      'dl=' + url,
      'dr=' + referrer
    ]);
  };

  WebAlyticSDK.event = function (params) {
    sendPostRequest([
      't=event',
      'ec=' + params.category,
      'ea=' + params.action,
      'el=' + params.label,
      'ev=' + params.value
    ]);
  };

  if (window.WebAlyticSDK && isArray(window.WebAlyticSDK)) {
    for (var i = 0; i < window.WebAlyticSDK.length; i++) {
      WebAlyticSDK.push(window.WebAlyticSDK[i]);
    }
  }
  window.WebAlyticSDK = WebAlyticSDK;
}(window, document));
