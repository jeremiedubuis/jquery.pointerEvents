(function ( $ ) {
    "use strict";

    var PointerEvents = function($el, options) {
        this.init($el, options);
    };

    PointerEvents.prototype = {

        pointerDownFlag: 0,
        pointerUpFlag: 0,
        init: function($el, options) {

            var _defaults = {
                pointerEventDebounce: 200,
                onPointerDown: function(e) {},
                onPointerMove: function(e) {},
                onPointerUp: function(e) {}
            };

            this.$el = $el;

            this.o = $.extend(_defaults, options);

            this._onPointerDown = this.onPointerDown.bind(this);
            this._onPointerMove = this.onPointerMove.bind(this);
            this._onPointerUp = this.onPointerUp.bind(this);

            var _this = this;

            this.resetPointerDownFlag = function() {
                _this.pointerDownTimeout = setTimeout(_this.resetFlag.bind(_this, 'pointerDownFlag'), _this.o.pointerEventDebounce );
            };

            this.resetPointerUpFlag = function() {
                _this.pointerUpTimeout = setTimeout(_this.resetFlag.bind(_this, 'pointerUpFlag'), _this.o.pointerEventDebounce );
            };

            this.$el.on('touchstart mousedown pointerdown', this._onPointerDown);
            this.$el.on('touchmove mousemove pointermove', this._onPointerMove);
            this.$el.on('touchend mouseup pointerup', this._onPointerUp);
            this.$el.data('pointerEvents', this);

        },

        onPointerDown: function(e) {
            if (!this.pointerDownFlag) {
                this.pointerDownFlag = 1;
                this.resetPointerDownFlag();
                this.o.onPointerDown(e);
            }
        },

        onPointerMove: function(e) {
            this.o.onPointerMove(e);
        },

        onPointerUp: function(e) {
            if (!this.pointerUpFlag) {
                this.pointerUpFlag = 1;
                this.resetPointerUpFlag();
                this.o.onPointerUp(e);
            }
        },

        resetFlag: function(flag) {
            this[flag] = 0;
            if (flag === 'pointerDownFlag') {
                clearTimeout(this.pointerUpTimeout);
                this.pointerUpFlag = 0;
            }
        },

        destroy: function() {
            this.$el.off('touchstart mousedown pointerdown', this._onPointerDown);
            this.$el.off('touchmove mousemove pointermove', this._onPointerMove);
            this.$el.off('touchend mouseup pointerup', this._onPointerUp);
        }
    };


    $.fn.pointerEvents = function(options) {
        if (this.length === 0)
            return this;
        var $this = $(this);

        if ($this.data('pointerEvents')) return $this.data('pointerEvents');
        if ($this.length> 1) {
            return $this.each(function() {
                $(this).pointerEvents(options);
            })
        }
        return new PointerEvents( $(this), options );

    };

    $.pointerEvents = function(el, options) {
        return $(el).pointerEvents(options);
    };

}( jQuery ));
