# Webalytic

Open source web analytics platform that tracks and reports website traffic. 

## Features 

- Support [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1?hl=ru) (so far partial)
- Collect client hits (page views, events, transactions)
- Allows you to manage how the data is processed (*soon*)
- Processes the client-interaction data with the configuration data 
- Provides access to all the processed and **RAW** data
- GeoNetwork data parsing with [maxmind](https://www.maxmind.com)
- Produce domain events to Nats Streaming (create your custom subscribers module for any goals, example anti-fraud detector)
- Microservices architecture, with shared [protobuf contracts](https://github.com/webalytic/protorepo)
- Dockerfiles and docker-compose deploy

<img src="./docs/dashboard.jpg" width="800">

## How does it work?

The platform seeks to repeat processing logic described by Google Analytics, following articles should be helpful for understanding core terms:

- [How a web session is defined in Analytics](https://support.google.com/analytics/answer/2731565?hl=en)
- [Campaigns and traffic sources](https://support.google.com/analytics/answer/6205762?hl=en)

Microservice architecture, project includes following packages:
  - Dashboard, Vue.js SPA
  - Api-gateway
  - Log-collector & Web SDK
  - Log-processing
  - Geoip
  - Data-storage & [Cube.JS](https://cube.dev/) API 

  <img src="./docs/WebAlyticMicroservices.jpg" width="800">

## Run with docker-compose

```bash
# Create network app 
docker network create app

# Start database and infrastructure containers
# For correct work Geoip service 
# you must copy GeoIP2-City.mmdb to ~/deploy/docker-compose/datasources/maxmind
docker-compose -f ~/deploy/docker-compose/datasources/docker-compose.yml up -d

# Start applications containers
docker-compose -f ~/deploy/docker-compose/docker-compose.yml up -d

# Vue dashboard on
http://127.0.0.1:80/

# Api-gateway on
http://127.0.0.1:80/api
```

### Environment variables

You can find list of all env variables in sample [env file](./deploy/docker-compose/.env)

### SDK

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

## Roadmap

- Base test coverage and CI/CD configs
- Resources service, create resource and invariants for log-collector
- Base analytics dashboard: Users, Sessions, Events, Traffic Source, Top Referral. Upgrade Cube.Js schema, more metrics and dimensions
- Identity and access management service
- Conversions service: 
  - Goals, funnels
  - Grouping channel
  - Attribution (soon)
- New SDK, like ga.js
- Kubernetes deploy with Helm