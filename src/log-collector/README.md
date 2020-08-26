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

// Inject and int SDK
(function() {
  WebAlyticSDK = window.WebAlyticSDK || (window.WebAlyticSDK = []);
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'http://localhost/lc/sdk.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();

WebAlyticSDK.push(['init', { 
  apiUrl: 'http://localhost/lc',
  resourceId: '92a04b0e-add7-44a1-97a6-131dee557d69'
}]);

// Send pageview
WebAlyticSDK.push(['hit']);

// Send event
WebAlyticSDK.push(['event', {
  category: 'some-category',
  action: 'purchase',
  label: '12dawd0',
  value: '10023'
}]);

</script>
```
