# Webalytic/log-collector

---
## Package.json scripts

```bash
# Start main process: api and producer 
yarn start

# Run test
yarn test

# Run integration tests
yarn test:integration

# Check EsLint
yarn lint

# Check TypeScript
yarn ts-check
```

## SDK

```html
<script>
  // Inject and init SDK
  (function(w, d, tag, script, varName) {
    w['WebAlyticObject'] = varName
    w[varName] = w[varName] || (w[varName] = function(){
      (w[varName].q = w[varName].q || []).push(arguments)
    });
    var s = document.createElement(tag);
    s.type = 'text/javascript';
    s.async = true;
    s.src = script;
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })(window, document, 'script', 'http://localhost/lc/webalytic.js', 'WebAlyticSDK');


  WebAlyticSDK('create', { 
    apiUrl: 'http://localhost/lc',
    resourceId: '92a04b0e-add7-44a1-97a6-131dee557d69'
  });

  // Send pageview
  WebAlyticSDK('send', {
    hitType: 'pageview'
  });

  // Send event
  WebAlyticSDK('send', {
    hitType: 'event',
    category: 'some-category',
    action: 'purchase',
    label: '12dawd0',
    value: '10023'
  });
</script>
```
