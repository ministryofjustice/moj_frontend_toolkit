/*jslint browser: true, evil: false, plusplus: true, white: true, indent: 2, nomen: true */
/*global moj, $ */

// Selectbox Autocomplete module for MOJ
// Dependencies: moj, jQuery, jQuery UI

(function (window, $) {
  "use strict";

  var MojAutocomplete = function(el, options){
    // avoid applying twice
    if(!el.data("moj.autocomplete")){ // TODO: find a better way...
      // set settings
      this.settings = $.extend({}, this.defaults, options);
      // cache element
      this.$select = el;
      // build new elements
      this._create();

      el.data("moj.autocomplete", true);
    }
  };

  MojAutocomplete.prototype = {
    // default config
    defaults: {
      copyAttr: true,
      autocomplete: {
        delay: 0,
        minLength: 0
      }
    },

    _create: function(){
      // create and hide el
      this.$wrapper = $("<span>").addClass("moj-autocomplete").insertAfter(this.$select);
      // build autocomplete field and show all button
      this._createAutocomplete();
      this._createAllButton();
      // hide original select el
      this.$select.hide();
    },

    _createAutocomplete: function(){
      var selected = this.$select.children(":selected"),
          value = selected.val() ? selected.text() : "";

      this.$text = $( "<input>" ).attr("type", "text") // give it a field type
                                  .val(value) // set value if already selected
                                  .data("select", this.$select); // assoc select with this input

      // if required, copy across attributes - useful for using [placeholder]
      if (this.settings.copyAttr) {
        var attrs = {};
        var raw_attrs = this.$select[0].attributes;
        // moj.log(raw_attrs);
        for (var i=0; i < raw_attrs.length; i++) {
          var key = raw_attrs[i].nodeName;
          var value = raw_attrs[i].nodeValue;
          if ( key !== 'name' && key !== 'id' && key !== 'class' && typeof this.$select.attr(key) !== 'undefined' ) {
            attrs[key] = value;
          }
        };
        this.$text.attr(attrs);
      }

      this.settings.autocomplete.source = $.proxy(this, "_source"); // use source method from class
      // add autocomplete functionality to text field
      this.$text.autocomplete(this.settings.autocomplete);

      this.$text.on({
        autocompleteselect: this._autocompleteselect,
        autocompletechange: this._autocompletechange
      });

      this.$wrapper.append(this.$text);
    },

    _createAllButton: function(){
      var open = false;
      this.$btn = $("<a>").attr({
                            "href": "#",
                            "tabIndex": -1
                          })
                          .addClass("dd-btn")
                          .on({
                            mousedown: function(e){
                              open = $(this).prev().autocomplete("widget").is(":visible");
                              return false;
                            },
                            click: function(e){
                              var $text = $(this).prev();
                              // focus on input el
                              $text.focus();
                              // toggle full list
                              if(open){
                                $text.autocomplete("close");
                              } else {
                                $text.autocomplete("search", "");
                              }
                              return false;
                            }
                          });

      this.$wrapper.append(this.$btn);
    },

    _source: function(request, response){
      var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i");

      response(
        this.$select.children("option").map(function() {
          var text = $( this ).text();
          if (this.value && (!request.term || matcher.test(text))){
            return {
              label: text,
              value: text,
              option: this
            };
          }
        })
      );
    },

    _autocompleteselect: function(event, ui) {
      ui.item.option.selected = true;
    },

    _autocompletechange: function(event, ui) {
      var $text = $(this),
          $select = $text.data("select");

      // Selected an item, nothing to do
      if (ui.item) {
        return;
      }

      // Search for a match (case-insensitive)
      var value = $text.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
      $select.children("option").each(function() {
        // if a match is found, select it and change to proper case in text field
        if ($(this).text().toLowerCase() === valueLowerCase) {
          this.selected = valid = true;
          $text.val($(this).text());
          return false;
        }
      });

      // Found a match, nothing to do
      if (valid) {
        return;
      }

      // Remove invalid value
      $text.val("").attr("title", value + " didn't match any item");
      // clear value from select
      $select.val("");
      // remove value from autocomplete obj
      $text.data("ui-autocomplete").term = "";
    },
  };

  $.fn.mojAutocomplete = function(options) {
    var settings = $.extend({}, $.fn.mojAutocomplete.defaults, options);

    return this.each(function(i){
      new MojAutocomplete($(this), options);
    });
  };

  // attach to window so doesn't have to be used as a jQuery plugin
  window.MojAutocomplete = MojAutocomplete;
}(window, jQuery));


(function(){
  "use strict";

  // Add module to MOJ namespace
  moj.Modules.autocomplete = {
    init: function () {
      // auto initate plugin if class is present
      $('.js-autocomplete').mojAutocomplete($(this).data());
    }
  };
}());