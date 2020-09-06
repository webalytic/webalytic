# Custom definitions

Custom definitions are like default dimensions and metrics, except you create them yourself. You can use them to collect and analyze data that Webalytic doesn't automatically track.

Creating either a custom dimension or metric is a two step process. First, set up the custom dimension or metric in your property. Then, modify your tracking code. You must complete these steps in order.

## About Scopes

Scope determines which hits will be associated with a particular custom-dimension value. There are two levels of scope: hit, session:

- Hit – value is applied to the single hit for which it has been set.
- Session – value is applied to all hits in a single session.

## Set up custom definition

1. Click `Admin`, and navigate to the custom definition.

2. Click `Add Custom definition`.

3. Select `Type`

4. Add a `Name`. This can be any string, but use something unique so it’s not confused with any other dimension or metric in your reports.

5. Select `Scope`. Choose to track at the Hit or Session level.

7. Click `Save`.

## Modify your tracking code

```html
<script>

WebAlyticSDK('send', {
  ...,
  dimension1: 'male',
  metric1: 101
});
      
</script>
```