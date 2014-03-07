(function() {
  "use strict";
  var DateSlider;

  DateSlider = function($el, options) {
    this.settings = $.extend({}, this.defaults, options);
    this.cacheEls($el);
    this.bindEvents();
    this.gather();
    this.sizeUp();
    this.inputDevice();
    if (this.settings.selectonload) {
      this.selectDateFromIndex(0);
    }
    return this;
  };

  DateSlider.prototype = {
    defaults: {
      currentPos: 0,
      visibleDays: 12,
      displayDays: 7,
      selectableDays: 6,
      width: 700,
      dayWidth: 100,
      middle: 300,
      inactive: 300,
      animateSpeed: 250,
      selectonload: false,
      sizeuponload: true,
      centreonday: true,
      emulatetouch: false
    },
    cacheEls: function($el) {
      this.$_el = $el;
      this.$window = $(window);
      this.$scrolls = $('.scroll', $el);
      this.$large = $('.DateSlider-largeDates', $el);
      this.$touch = $('.DateSlider-touch', $el);
      this.$months = $('.DateSlider-month span', $el);
      this.$buttonL = $('.DateSlider-buttonLeft', $el);
      this.$buttonR = $('.DateSlider-buttonRight', $el);
      this.$sliders = $('.DateSlider-sliders', $el);
      this.$small = $('.DateSlider-smallDates', $el);
      this.$frame = $('.DateSlider-portalFrame', $el);
      this.$day = $('li', $el);
      this.$largeRow = $('.DateSlider-days', this.$large);
      this.$smallRow = $('.DateSlider-days', this.$small);
      this.$touchRow = $('.DateSlider-days', this.$touch);
      this.$largeRowDay = $('li', this.$largeRow);
      return this.$largeRowSmall = $('small', this.$largeRow);
    },
    bindEvents: function() {
      this.$touch.on({
        'scroll': (function(_this) {
          return function() {
            return _this.syncScrollPos(_this.$touch);
          };
        })(this),
        'click': (function(_this) {
          return function(e) {
            return _this.slide(_this.posOfDateAt(e.offsetX));
          };
        })(this)
      });
      this.$large.on({
        'chosen': (function(_this) {
          return function() {
            if (_this.differentPos(_this.$large.scrollLeft())) {
              return _this.selectDateFromIndex(_this.settings.currentPos / _this.settings.dayWidth);
            }
          };
        })(this),
        'scroll': (function(_this) {
          return function() {
            return _this.centreDateWhenInactive(_this);
          };
        })(this)
      });
      this.$window.on('resize', (function(_this) {
        return function() {
          _this.sizeUp();
          return _this.centreDateWhenInactive(_this);
        };
      })(this));
      this.$buttonL.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.slide(_this.settings.currentPos - _this.settings.dayWidth);
        };
      })(this));
      return this.$buttonR.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.slide(_this.settings.currentPos + _this.settings.dayWidth);
        };
      })(this));
    },
    gather: function() {
      this.settings.visibleDays = this.$small.find('li').length;
      return this.settings.selectableDays = this.$large.find('li').length;
    },
    sizeUp: function() {
      if (!this.settings.sizeuponload) {
        return this.$_el.css({visibility: 'visible'});
      }

      var borderWidth, dayHeight, fontLarge, fontSizeScale, fontSmall, fontSmaller, largeHeight, largeLineHeight, magnifyDay, magnifyFont, shrinkWeekday, squashDays, upness, viewPort;
      squashDays = 0.95;
      magnifyDay = 1.4;
      upness = 0.22;
      fontSizeScale = 0.52;
      magnifyFont = 1.33;
      shrinkWeekday = 0.42;
      borderWidth = 2;
      viewPort = this.$window.width();
      this.settings.dayWidth = Math.floor(viewPort / this.settings.displayDays);
      this.settings.width = this.settings.dayWidth * this.settings.displayDays;
      this.settings.middle = Math.floor(this.settings.displayDays / 2) * this.settings.dayWidth;
      dayHeight = Math.floor(this.settings.dayWidth * squashDays);
      largeHeight = Math.floor(dayHeight * magnifyDay);
      largeLineHeight = (largeHeight * upness) * 2 + dayHeight;
      fontSmall = dayHeight * fontSizeScale;
      fontLarge = fontSmall * magnifyFont;
      fontSmaller = fontLarge * shrinkWeekday;
      this.$buttonL.add(this.$buttonR).css({
        width: "" + this.settings.dayWidth + "px",
        height: "" + dayHeight + "px",
        fontSize: "" + fontLarge + "px",
        lineHeight: "" + dayHeight + "px"
      });
      this.$sliders.css({
        height: "" + dayHeight + "px"
      });
      this.$day.css({
        width: "" + this.settings.dayWidth + "px",
        fontSize: "" + fontSmall + "px",
        lineHeight: "" + dayHeight + "px"
      });
      this.$touchRow.css({
        width: "" + (this.settings.dayWidth * this.settings.visibleDays) + "px"
      });
      this.$smallRow.css({
        width: "" + (this.settings.dayWidth * this.settings.visibleDays) + "px"
      });
      this.$largeRow.css({
        width: "" + (this.settings.dayWidth * this.settings.selectableDays) + "px"
      });
      this.$largeRowDay.css({
        fontSize: "" + fontLarge + "px",
        lineHeight: "" + largeLineHeight + "px"
      });
      this.$largeRowSmall.css({
        fontSize: "" + fontSmaller + "px"
      });
      this.$scrolls.css({
        width: "" + viewPort + "px"
      });
      this.$touch.css({
        height: largeHeight + borderWidth * 2 + "px",
        top: -Math.floor(largeHeight * upness) + "px"
      });
      this.$large.css({
        height: "" + largeHeight + "px",
        width: "" + this.settings.dayWidth + "px",
        top: "-" + (Math.floor(largeHeight * upness) - borderWidth) + "px",
        left: "" + this.settings.middle + "px"
      });
      this.$frame.css({
        width: "" + (this.settings.dayWidth - borderWidth) + "px",
        height: "" + largeHeight + "px",
        top: "-" + (Math.floor(largeHeight * upness)) + "px",
        left: "" + (this.settings.middle - borderWidth / 2) + "px"
      });
      return this.$_el.css({
        visibility: 'visible'
      });
    },
    inputDevice: function() {
      if (this.settings.emulatetouch) {
        return;
      }
      return (Modernizr.touch ? this.$buttonL.add(this.$buttonR) : this.$touch).remove();
    },
    differentPos: function(pos) {
      if (this.settings.currentPos !== pos) {
        this.settings.currentPos = pos;
        return true;
      }
    },
    slide: function(pos) {
      return this.$scrolls.animate({
        scrollLeft: pos
      }, this.settings.animateSpeed).promise().done((function(_this) {
        return function() {
          return _this.$large.trigger('chosen');
        };
      })(this));
    },
    selectDateFromIndex: function(index) {
      var day;
      day = this.$large.find('li').eq(index);
      day.trigger('chosen');
      return this.showMonthForDate(day.data('date'));
    },
    showMonthForDate: function(dateStr) {
      var self;
      self = this;
      return this.$months.addClass('hidden').filter(function() {
        return $(this).data('date') === self.yearMonthFromDate(dateStr);
      }).removeClass('hidden');
    },
    yearMonthFromDate: function(date) {
      return date.split('-').splice(0, 2).join('-');
    },
    posOfDateAt: function(x) {
      return (Math.floor(x / this.settings.dayWidth) * this.settings.dayWidth) - this.settings.middle;
    },
    posOfNearestDateTo: function(x) {
      var balance;
      balance = x % this.settings.dayWidth;
      if (balance > this.settings.dayWidth / 2) {
        return x - balance + this.settings.dayWidth;
      } else {
        return x - balance;
      }
    },
    syncScrollPos: function($el) {
      return $el.siblings('.scroll').scrollLeft($el.scrollLeft());
    },
    centreDateWhenInactive: function(obj) {
      if (!this.settings.centreonday) {
        return;
      }
      clearTimeout($.data(obj, 'scrollTimer'));
      return $.data(obj, 'scrollTimer', setTimeout((function(_this) {
        return function() {
          return _this.slide(_this.posOfNearestDateTo(_this.$large.scrollLeft()));
        };
      })(this), this.settings.inactive));
    }
  };

  moj.Modules.DateSlider = {
    init: function() {
      return $('.DateSlider').each(function() {
        return $(this).data('DateSlider', new DateSlider($(this), $(this).data()));
      });
    }
  };

}).call(this);
