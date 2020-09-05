<template>
  <b-card
    class="shadow"
    title="Tracking info"
  >
    <p>
      Copy and paste this code as the first item into the <code>&lt;HEAD&gt;</code>
      of every webpage you want to track.
    </p>

    <h6>Import and init <b>WebAlyticSDK</b></h6>
    <pre class="bg-light p-4">{{ sdkScript }}</pre>

    <h6>Send pageview hit</h6>
    <pre class="bg-light p-4">{{ hitScript }}</pre>

    <h6>Send event hit</h6>
    <pre class="bg-light p-4">{{ eventScript }}</pre>

    <h6>Custom dimensions and metrics</h6>
    <pre class="bg-light p-4">{{ customDimensionAndMetricsScript }}</pre>
  </b-card>
</template>

<script>

export default {
  computed: {
    sdkScript() {
      const ORIGIN = window.location.origin
      const resource = this.$store.state.globalFilters.resources.active
      return `(function(w, d, tag, script, varName) {
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
})(window, document, 'script', '${ORIGIN}/lc/webalytic.js', 'WebAlyticSDK');

WebAlyticSDK('create', { 
  apiUrl: '${ORIGIN}/lc',
  resourceId: '${resource.id}'
});`
    },

    hitScript() {
      return 'WebAlyticSDK(\'send\', { hitType: \'pageview\' });'
    },
    eventScript() {
      return `WebAlyticSDK('send', {
  hitType: 'event',
  category: 'some-category',
  action: 'purchase',
  label: '12dawd0',
  value: '10023'
});`
    },
    customDimensionAndMetricsScript() {
      return `WebAlyticSDK('send', {
  hitType: 'pageview' 
  dimension1: 'male',
  metric1: 101
});
      
WebAlyticSDK('send', {
  hitType: 'event',
  category: 'some-category',
  action: 'purchase',
  label: '12dawd0',
  value: '10023',
  dimension1: 'female',
  metric1: 101
}]);`
    }
  }
}
</script>
