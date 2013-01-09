// Generated by CoffeeScript 1.4.0
(function() {
  var Formwatcher, bean, bonzo, decParseInt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Formwatcher = require("formwatcher");

  bonzo = require("bonzo");

  bean = require("bean");

  decParseInt = function(number) {
    return parseInt(number, 10);
  };

  Formwatcher.registerDecorator((function(_super) {

    __extends(_Class, _super);

    function _Class() {
      return _Class.__super__.constructor.apply(this, arguments);
    }

    _Class.prototype.name = "Hint";

    _Class.prototype.description = "Displays a hint in an input field.";

    _Class.prototype.nodeNames = ["INPUT", "TEXTAREA"];

    _Class.prototype.defaultOptions = {
      auto: true,
      removeTrailingColon: true,
      color: "#aaa"
    };

    _Class.prototype.accepts = function(input) {
      if (_Class.__super__.accepts.call(this, input)) {
        if (bonzo(input).attr("placeholder") != null) {
          return true;
        }
        if (this.options.auto && Formwatcher.getLabel({
          input: input
        }, this.watcher.options.automatchLabel)) {
          return true;
        }
      }
      return false;
    };

    _Class.prototype.decorate = function(input) {
      var $hintElement, $input, $wrapper, changeFunction, deferredChangeFunction, delayChangeFunction, elements, fadeLength, hint, hintElement, inputOffset, label, leftPosition, nextTimeout, topPosition, wrapper;
      elements = {
        input: input
      };
      $input = bonzo(input);
      hint = $input.attr("placeholder");
      if (hint) {
        $input.attr("placeholder", "");
      }
      if (!(hint != null) || !hint) {
        label = Formwatcher.getLabel(elements, this.watcher.options.automatchLabel);
        if (!label) {
          throw "The hint was empty, but there was no label.";
        }
        elements.label = label;
        bonzo(label).hide();
        hint = bonzo(label).html();
        if (this.options.removeTrailingColon) {
          hint = hint.replace(/\s*\:\s*$/, "");
        }
      }
      Formwatcher.debug("Using hint: " + hint);
      wrapper = bonzo.create("<span class=\"formwatcher-hint-container\" />")[0];
      $wrapper = bonzo(wrapper);
      $wrapper.insertAfter(input).append(input);
      if ($input.css("display" === "block")) {
        $wrapper.css("display", "block");
      }
      inputOffset = {
        left: input.offsetLeft,
        top: input.offsetTop,
        width: input.offsetWidth,
        height: input.offsetHeight
      };
      leftPosition = decParseInt($input.css("paddingLeft")) + decParseInt(inputOffset.left) + 2;
      leftPosition += decParseInt($input.css("borderLeftWidth"));
      leftPosition += "px";
      topPosition = decParseInt($input.css("paddingTop")) + decParseInt(inputOffset.top);
      topPosition += decParseInt($input.css("borderTopWidth"));
      topPosition += "px";
      hintElement = bonzo.create("<span />")[0];
      $hintElement = bonzo(hintElement);
      $hintElement.html(hint).css({
        display: "none",
        top: topPosition,
        left: leftPosition,
        fontSize: $input.css("fontSize"),
        lineHeight: $input.css("lineHeight"),
        fontFamily: $input.css("fontFamily"),
        color: this.options.color
      }).addClass("formwatcher-hint").insertAfter(input);
      bean.on(hintElement, "click", function() {
        return input.focus();
      });
      fadeLength = 100;
      bean.on(input, "focusin", function() {
        if ($input.val() === "") {
          return $hintElement.addClass("ghosted");
        }
      });
      bean.on(input, "focusout", function() {
        if ($input.val() === "") {
          return $hintElement.removeClass("ghosted");
        }
      });
      changeFunction = function() {
        if ($input.val() === "") {
          return $hintElement.show();
        } else {
          return $hintElement.hide();
        }
      };
      deferredChangeFunction = function() {
        return setTimeout((function() {
          return changeFunction();
        }), 1);
      };
      bean.on(input, "keyup", changeFunction);
      bean.on(input, "keypress", deferredChangeFunction);
      bean.on(input, "keydown", deferredChangeFunction);
      bean.on(input, "change", changeFunction);
      nextTimeout = 10;
      delayChangeFunction = function() {
        changeFunction();
        setTimeout((function() {
          return delayChangeFunction();
        }), nextTimeout);
        nextTimeout = nextTimeout * 2;
        return nextTimeout = (nextTimeout > 10000 ? 10000 : nextTimeout);
      };
      delayChangeFunction();
      return elements;
    };

    return _Class;

  })(Formwatcher.Decorator));

}).call(this);
