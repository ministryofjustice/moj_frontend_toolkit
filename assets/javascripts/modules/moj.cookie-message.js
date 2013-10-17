/*jslint browser: true, evil: false, plusplus: true, white: true, indent: 2, nomen: true */
/*global moj, $ */

// Tabs modules for MOJ
// Dependencies: moj, jQuery

(function () {
  "use strict";

  /*
    Cookie methods
    ==============
    Usage:
      Setting a cookie:
      moj.cookie.set('foo', 'bar', { days: 30 });

      Reading a cookie:
      moj.cookie.get('foo');

      Removing a cookie:
      moj.cookie.remove('foo');
  */
  var Cookie = function () {};

  Cookie.prototype = {
    set: function (name, value, options){
      if(typeof options === 'undefined') {
        options = {};
      }
      var cookieString = name + "=" + value + "; path=/";
      if (options.days) {
        var date = new Date();
        date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
        cookieString = cookieString + "; expires=" + date.toGMTString();
      }
      if (document.location.protocol == 'https:'){
        cookieString = cookieString + "; Secure";
      }
      document.cookie = cookieString;
    },

    get: function (name){
      var nameEQ = name + "=";
      var cookies = document.cookie.split(';');
      // moj.log(cookies);
      for(var i = 0, len = cookies.length; i < len; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
          cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }
      return null;
    },

    remove: function (name){
      if (moj.cookie.get(name) === undefined) {
        return false;
      }

      // Must not alter options, thus extending a fresh object...
      moj.cookie.set(name, '', { days: -1 });
      return !moj.cookie.get(name);
    }
  };

  moj.cookie = new Cookie();
}());

(function(){
  moj.Modules.cookieMessage = {
    init: function(){
      var message = document.getElementById('global-cookie-message'),
          needsCookieMessage = (message && moj.cookie.get('seen_cookie_message') == null);

      if (needsCookieMessage) {
        message.style.display = 'block';
        moj.cookie.set('seen_cookie_message', 'yes', { days: 28 });
      }
    }
  };
}());