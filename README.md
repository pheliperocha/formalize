# Formalize-Jquery v0.1.2
---
Formalize is a jquery plugin to help create forms quickly and productively. With it you can create complex forms without difficulty, and be sure it will work in different browsers and devices.

> **PS.: This plugin isn't ready yet, some features still need tests.**

## Features
---
- [x] &nbsp; Material Design
- [x] &nbsp; 12 Grid Layout
- [x] &nbsp; URL Validation
- [x] &nbsp; Ease custom pattern validation
- [x] &nbsp; Telephone Validation
- [x] &nbsp; Select with multiple selection
- [x] &nbsp; Switch input like material design
- [x] &nbsp; Fields with icons
- [x] &nbsp; Textarea with autoresize
- [x] &nbsp; Character, number, word, sentence and paragraphi counter
- [x] &nbsp; Validate of min and max character, number, word, etc..
- [x] &nbsp; Required field
- [x] &nbsp; Email Validation
- [ ] &nbsp; Responsive Layout
- [ ] &nbsp; Credit Card Validation
- [ ] &nbsp; Credit Card flag Identification
- [ ] &nbsp; Find currently geolocation
- [ ] &nbsp; Find location by Postal Code
- [ ] &nbsp; Easy integration with Google Maps Canvas
- [ ] &nbsp; Input Chips
- [ ] &nbsp; Password with magic eye
- [ ] &nbsp; Password power meter
- [ ] &nbsp; Password auto genarate
- [ ] &nbsp; File Input with image preview
- [ ] &nbsp; File Input with size validation
- [ ] &nbsp; File Input with type validation

## Usage
---
First, include the jQuery, material design font and formalize css and js files

```html
<!-- JQuery -->
<script type="text/javascript" src="../bower_components/jquery/dist/jquery.js"></script>
<!-- Material Design Icons -->
<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<!-- Formalize Plugin -->
<link rel="stylesheet" href="../dist/css/style.min.css" />
<script type="text/javascript" src="../dist/js/formalize.min.js"></script>
```

Next, you can just put "formalize" class on a form tag

```html
<form class="formalize"></form>
```

Or call the formalize function for those forms you wish

```javascript
jQuery(function($){
    $("#formId").formalize();
});
```

### Bower
---
If you'd like to use bower, it's as easy as:

    bower install --save formalize-jquery

# Components Used
---
 - jQuery - https://github.com/components/jquery.git
 - jQuery Mask Plugin - https://github.com/igorescobar/jQuery-Mask-Plugin.git

## License
---
Formalize-Jquery is released under the MIT license.
