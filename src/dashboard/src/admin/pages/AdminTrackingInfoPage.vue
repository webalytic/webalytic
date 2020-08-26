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
  </b-card>
</template>

<script>

export default {
  computed: {
    sdkScript() {
      const ORIGIN = window.location.origin
      const resource = this.$store.state.globalFilters.resources.active
      return `(function() {
  WebAlyticSDK = window.WebAlyticSDK || (window.WebAlyticSDK = []);
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = '${ORIGIN}/lc/sdk.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();

WebAlyticSDK.push(['init', { 
  apiUrl: '${ORIGIN}/lc',
  resourceId: '${resource.id}'
}]);`
    },

    hitScript() {
      return 'WebAlyticSDK.push([\'hit\']);'
    },
    eventScript() {
      return `WebAlyticSDK.push(['event', {
  category: 'some-category',
  action: 'purchase',
  label: '12dawd0',
  value: '10023'
}]);`
    }
  }
}
</script>
