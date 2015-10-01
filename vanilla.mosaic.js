/**
 * Vanilla mosaic ;) (https://github.com/xylphid)
 * Version 0.2.0
 *
 * @author Anthony PERIQUET
 */
(function(vanilla) {
    var currentMosaic = null;
    var refresh = {
        time: null,
        timeout: false
    };

    vanilla.mosaic = function( query, options ){
        if (!(this instanceof vanilla.mosaic))
            return new vanilla.mosaic( query, options );

        self = this;
        this.options = vanilla.extend({}, vanilla.mosaic.defaults, options);
        this.elm = vanilla( query );
        this.columns = [];
        this.ord = [];
        this.nbColumns;
        currentMosaic = this;

        //this._initilize();
        this.__init__();

        vanilla(window).on('resize', function(){
            if (!currentMosaic) return;
            refresh.time = new Date();
            if (refresh.timeout === false) {
                refresh.timeout = true;
                setTimeout( vanilla.mosaic.update, 200 );
            }
        });
        setTimeout(vanilla.mosaic.update, 1000);
    };

    vanilla.mosaic.prototype = {
        constructor: vanilla.mosaic,

        __init__: function() {
            // Get items
            this.items = this.elm.children();

            this._configure();
            this._cleanContainer();
            this._process();
        },

        _append: function( item, fade ) {
            item.css('display', 'block')
                .css('opacity', fade ? 0 : item.css('opacity'))
                .css('position', 'absolute')
                .css('transition', 'left 500ms, opacity 500ms, top 500ms');
            this.elm.append( item )
            return item;
        },

        // Configure the mosaic
        _configure: function() {
            this.columns = [];
            this.ord = [];

            this.containerWidth = this.options.fitWidth ? this.elm.parent().innerWidth() : this.elm.innerWidth();
            // Define column width
            this.columnWidth = this.options.columnWidth;
            // If column width is not set, get the outer width of first item
            if (!this.columnWidth) {
                var first = this._append( this.items[0] );
                first.css('width', '');
                this.columnWidth = first.outerWidth() || this.columnWidth;
            }

            this.nbColumns = parseInt(this.containerWidth / this.columnWidth);
        },

        // Remove all items in container
        _cleanContainer: function() {
            for (var i=0; i<this.items.length; i++) {
                this.items[i].remove();
            }
        },

        // Get item width
        _getItemWidth: function( item, span ) {
            var margins = parseInt( item.css('margin-left') ) + parseInt( item.css('margin-right') );
            return ((this.columnWidth * span) - margins) + 'px';
        },

        // Get item column span
        _getSpan: function( item ) {
            var span = 1;
            if (item.outerWidth() && item.outerWidth() > this.columnWidth)
                span = Math.round(item.outerWidth() / this.columnWidth);
            return span;
        },

        // Display items in the mosaic
        _process: function( fade ) {
            fade = (typeof fade == typeof undefined) ? true : fade;
            // Set container width
            this.elm.css('width', (this.columnWidth * this.nbColumns) + 'px');
            for (var i=0; i<this.items.length; i++) {
                var item = this._append( this.items[i], fade );
                var span = this._getSpan( item );
                this._prepareItem( item, span );
                this.items[i].css('width', this._getItemWidth(item, span));
            }
            // Set container height
            this.elm.css('height', this._getMaxOfSlice(0, this.nbColumns) + 'px');
        },

        // Prepare item for display
        _prepareItem: function( item, span) {
            // Set columns default position
            if (this.columns.length < this.nbColumns) {
                this.ord.push(0);
                this.columns[this.columns.length] = [this.columnWidth * this.columns.length, 0];
            }

            // Extract item image
            var img = item.children( 'img' )[0];
            // Set position once load is complete
            if (!img.nodes[0].complete) {
                img.on('load', function(){
                    self._setPosition( item, img, span );
                });
            } else { this._setPosition( item, img, span ); }
                
        },

        // Set item position
        _setPosition: function( item, img, span ) {
            // Get item margins
            var marginLeft = parseInt(item.css('margin-left'));
            var marginRight = parseInt(item.css('margin-right'));
            var marginTop = parseInt(item.css('margin-top'));
            var marginBottom = parseInt(item.css('margin-bottom'));

            index = self._getOptimalPosition( span );
            var top = this._getMaxOfSlice( index, span ) + marginTop;
            // Set item position
            item.css('left', (this.columns[index][0] + marginLeft)+'px')
                .css('top', top+'px')
                .css('opacity', 1);
            // Update column top position
            this._updateColumns( index, (img.nodes[0].offsetHeight + marginTop + marginBottom), span );
        },

        // Return optimal position for item
        _getOptimalPosition: function( span ) {
            var index = 0;
            var position = null;

            for (var i=0; i<this.nbColumns-span+1; i++) {
                var maxHeight = this._getMaxOfSlice(i, span);
                position = !position || position[1] > maxHeight ? [i, maxHeight] : position;
            }
            return position[0];
        },

        // Update column top position
        _updateColumns: function( index, height, span ) {
            if (span > 1) var maxHeight = this._getMaxOfSlice(index, span);
            while (span) {
                if (!this.columns[index]) {
                    this.ord[index] = 0;
                    this.columns[index] = [this.columnWidth * this.columns.length, 0];
                }
                this.ord[index] = (typeof maxHeight != typeof undefined) ? maxHeight+height : this.ord[index]+height;
                this.columns[index][1] = this.ord[index];
                index++;
                span--;
            }
        },

        // Return max value of array slice
        _getMaxOfSlice: function( index, span ) {
            var slice = this.ord.slice(index, index+span);
            // Expand array with not known values
            while (slice.length < span) slice.push(0);
            return Math.max.apply( Math, slice);
        },

        // Add new item on the fly
        append: function( item ) {
            // Add item in collection
            this.items.push( item );
            
            // Add item in container and set its position
            var item = this._append( item );
            var span = this._getSpan( item );
            this._prepareItem( item, span );
            item.css('width', this._getItemWidth(item, span));

            // Update container height
            this.elm.css('height', this._getMaxOfSlice(0, this.nbColumns) + 'px');
        },

        // Update layout
        update: function() {
            this._configure();
            this._cleanContainer();
            this._process( false );
            refresh.timeout = false;
        }
    };

    // Context menu default options
    vanilla.mosaic.defaults = {
        columnWidth: null,
        fitWidth: true
    }

    vanilla.mosaic.dispatcher = function( event, callable ) {
        if (!currentMosaic || typeof currentMosaic[callable] != 'function') return;
        if (/Event/.test(event)) event.preventDefault();
        currentMosaic[callable]( event );
        return currentMosaic; 
    };
    vanilla.mosaic.update = function(event) {
        return vanilla.mosaic.dispatcher( event, 'update');
    };
    vanilla.mosaic.append = function(item) {
        if (!currentMosaic) return;
        return currentMosaic.append( item );
    };

    vanilla.prototype.mosaic = function(options) {
        if (this instanceof vanilla) {
            currentMosaic = new vanilla.mosaic(this, options);
            vanilla.mosaic.open();
        }
        return this;
    };
    
}) (vanilla);