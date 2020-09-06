# Web SDK aka webalytic.js

The webalytic.js library is a JavaScript library for measuring how users interact with your website. This document explains how to add the Webalytic SDK to your site.

Webalytic SDK should be added to `<HEAD>` tag and before any other script or CSS tags, and add `resourceId` you wish to work with.

```html
<script>

(function(t,e,c,n,a){t.WebAlyticObject=a,t[a]=t[a]||(t[a]=function(){(t[a].q=t[a].q||[]).push(arguments)});var r=document.createElement(c);r.type='text/javascript',r.async=!0,r.src=n;var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(r,s)})(window,document,'script','http://localhost/lc/webalytic.js','WebAlyticSDK');


WebAlyticSDK('create', { 
  apiUrl: 'http://localhost/lc',
  resourceId: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
});
WebAlyticSDK('send', { hitType: 'pageview' });

</script>
```

## The send method

```html
<script>

// Send pageview
WebAlyticSDK('send', { hitType: 'pageview' });

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

## What data does the webalytic.js capture?

When you add either of these script to your website, you send a pageview for each page your users visit. Webalytic processes this data and can infer a great deal of information including:

- The total time a user spends on your site.
- The time a user spends on each page and in what order those pages were visited.
- What internal links were clicked (based on the URL of the next pageview).

In addition: The IP address, user agent string, and initial page inspection that webalytic.js performs when creating a new tracker object is used to determine things like:

- The geographic location of the user.
- What browser and operating system are being used.
- Screen size and whether Flash or Java is installed.
- The referring site.