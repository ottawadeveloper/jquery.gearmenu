## jQuery GearMenu
I fell in love with HTML5's context menu the moment I saw it. The only downside
is that it's only supported in Firefox at the moment. Not liking the current
polyfill (which replaces the right-click context menu, instead of supplementing
it, and therefore removes all the usual contextual items), I decided to write
a plug-in for jQuery that changes a contextmenu attribute into a gear-style
context menu (similar to those scattered throughout Drupal) in all browsers.

## Using the library
Start by downloading this project and including both the .css and the .js file
in your template. You can then turn menus into GearMenus with:

```javascript
(function($) {
  $(document).ready(function() {
    // This will turn all context menus into gear menus.
    $.gearMenuize();
    // This will turn a specific context menu into a gear menu.
    $('menu#my_context_menu').gearMenuize();
  });
})(jQuery);
```

## Customizing the controls
You can override the CSS as you like. The default styles are a poor attempt
at mimicking Firefox's context menu.

You can also modify several properties on the GearMenu object in order to
change the gear image used:

```javascript
// Change the path to the gear icon.
GearMenu.defaultGearPath = '/jquery.gearmenu/images/os-gear.png';
  
// Change the default class used to control the size of the gear.
GearMenu.defaultGearClass = 'gearmenu-style--menu-activator-icon--default';

// Change the alt text for the gear icon.
GearMenu.defaultGearAltText = 'Context menu',
```

In addition, you can override the path, class and alt text using data-* style 
parameters on the ```<menu>``` tag.

```html
<menu type="context" data-gearmenu-gear-path="/jquery.gearmenu/images/os-gear.png" data-gearmenu-gear-class="gearmenu-style--menu-activator-icon--default" data-gearmenu-gear-alt-text="Context menu">
...
</menu>
```

## An Example
Here's an example of how you might use this plugin:
```html
<!DOCTYPE html>
<html>
  <head> 
    <title>jQuery GearMenu Example</title> 
    <link rel='stylesheet' type='text/css' href='/jquery.gearmenu/jquery.gearmenu.css' />
    <script type="text/javascript" src="/misc/jquery.js"></script>
    <script type="text/javascript" src="/jquery.gearmenu/jquery.gearmenu.js"></script>
    <script type="text/javascript">
      $(document).ready(function() {
        $.gearMenuize();
      });
    </script>
  </head>
  <body>
    <div contextmenu="my-menu">
      <p>Your content goes here</p>
    </div>
    <menu type="context" id="my-menu">
      <menuitem label="GitHub" onclick="window.location='http://github.com/ottawadeveloper';"></menuitem>
      <menu label="Social Media" icon='/my-icons/social-media.png'>
        <menuitem label="Google Plus" onclick="window.location='http://plus.google.com';"></menuitem>
        <menuitem label="Reddit" onclick="window.location='http://reddit.com';" icon="/my-icons/reddit.png"></menuitem>
        <menuitem label="Facebook" onclick="window.location='http://facebook.com';"></menuitem>
      </menu>
    </menu>
  </body>
</html>
```
