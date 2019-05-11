(function ($, window, document, undefined) {
  var pluginName = 'FloatingLabel',
      defaults = {};

  function Plugin(element, options) {
    this.element = $(element.parentNode);
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var $input = this.element.find('input').first();
      var $label = this.element.find('label').first();

      $label.css({ display: 'block' });

      var inputOffset = this.getOffset($input);
      var labelOffset = this.getOffset($label);

      var offset = {
        left: inputOffset['left'] - labelOffset['left'],
        top: $label.outerHeight(true) - labelOffset['top'] + (inputOffset['top']/2)
      };

      $label.css({ position: 'relative' });

      if ($input.val().length == 0) {
        $label.css(offset);
        $label.addClass('floating');
      }

      $input
        .on('focus', function() {
          this.fadeOut($label);
        }.bind(this))
        .on('keypress', function() {
          this.moveOut($label);
        }.bind(this))
        .on('blur', function() {
          this.moveIn($label, $input, offset);
        }.bind(this));
    },

    getOffset: function(element) {
      return {
        top: this.getSideOffset(element, 'Top'),
        left: this.getSideOffset(element, 'Left'),
        bottom: this.getSideOffset(element, 'Bottom')
      }
    },

    getSideOffset: function(element, side) {
      return Math.floor(
          parseFloat(element.css('margin' + side)  || 0)
        + parseFloat(element.css('border' + side + 'Width')  || 0)
        + parseFloat(element.css('padding' + side) || 0)
      );
    },

    fadeOut: function($label) {
      if ($label.hasClass('floating')) {
        $label.animate({ opacity: .5 }, 100);
      }
    },

    moveOut: function($label) {
      $label.animate({
        left: 0,
        top: 0,
        opacity: 1
      }, 100);
      $label.addClass('docked', 100);
      $label.removeClass('floating', 100);
    },

    moveIn: function($label, $input, offset) {
      if ($input.val().length == 0) {
        $label.animate(
          $.extend({}, offset, { opacity: 1 }),
          100
        );
        $label.addClass('floating', 100);
        $label.removeClass('docked', 100);
      }
    }
  }

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
