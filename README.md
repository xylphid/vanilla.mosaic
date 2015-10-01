# Vanilla Mosaic

vanilla.mosaic is a simple and configurable contextual menu in vanilla-js.

## Requirements

* [vanilla](https://github.com/xylphid/vanilla)

## Installation

Include [vanilla](https://github.com/xylphid/vanilla) and `vanilla.mosaic.min.js`script :
```html
<script src="vanilla.min.js" type="text/javascript" charset="utf-8" />
<script src="vanilla.mosaic.min.js" type="text/javascript" charset="utf-8" />
```

## Usage

To initialize vanilla.mosaic, proceed as follow :
```js
vanilla.mosaic( '[data-target=mosaic]' );
```

### Append items

If you have infinite scroll, you may want to append items to the mosaic.
```js
vanilla.mosaic.append( item );
```

### Update layout

To update the layout once the page is fully loaded or when items are added, execute this function :
```js
vanilla.mosaic.update();
```

## Options

These are the supported options and their default values:
```js
vanilla.mosaic.defaults = {
    columnWidth: null,          // Column width
    fitWidth: true,             // Container fit available space
}
```

# License (MIT)

jQuery Modal is distributed under the [MIT License](Learn more at http://opensource.org/licenses/mit-license.php):

    Copyright (c) 2015 Anthony PERIQUET

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.