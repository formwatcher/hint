
# ## The Hint decorator
#
# This decorator puts a text over a label that fades out when the user selects the label, or edits the text.


Formwatcher = require "formwatcher"

# qwery = require "qwery"
bonzo = require "bonzo"
bean = require "bean"


decParseInt = (number) -> parseInt number, 10

Formwatcher.registerDecorator class extends Formwatcher.Decorator

  name: "Hint"
  description: "Displays a hint in an input field."
  nodeNames: [ "INPUT", "TEXTAREA" ]
  defaultOptions:
    auto: true # This automatically makes labels into hints.
    removeTrailingColon: true # Removes the trailing ` : ` from labels.
    color: "#aaa" # The text color of the hint.


  accepts: (input) ->
    if super input
      # If `auto` is on, and there *is* a label.
      return true if bonzo(input).attr("placeholder")?
      return true if @options.auto and Formwatcher.getLabel { input: input }, @watcher.options.automatchLabel
    false

  decorate: (input) ->
    elements = input: input

    $input = bonzo input

    hint = $input.attr "placeholder"
    $input.attr "placeholder", "" if hint

    if !hint? or !hint
      label = Formwatcher.getLabel elements, @watcher.options.automatchLabel
      throw "The hint was empty, but there was no label."  unless label
      elements.label = label
      bonzo(label).hide()
      hint = bonzo(label).html()
      hint = hint.replace(/\s*\:\s*$/, "") if @options.removeTrailingColon

    Formwatcher.debug "Using hint: " + hint

    # For now I'm using `display: inline-block` instead of `inline` because of the Webkit bug with `inline` offsetParents.
    # See here: http://jsfiddle.net/enyo/uDeZ9/
    wrapper = bonzo.create("""<span class="formwatcher-hint-container" />""")[0]
    $wrapper = bonzo wrapper
    $wrapper
      .insertAfter(input)
      .append(input)

    $wrapper.css "display", "block" if $input.css "display" == "block"

    # I think this is a bit of a hack... Don't know how to get the top margin otherwise though, since `offset().top` seems not to work.
    # EDIT: Since the value offsetTop seems to account for the margin, I don't have to use it anymore.
    # topMargin = decParseInt input.css("marginTop")
    # topMargin = 0  if isNaN(topMargin)

    # Not using input.offset() here, because I'm actually interested in the offset relative to the offsetParent
    inputOffset = 
      left: input.offsetLeft
      top: input.offsetTop
      width: input.offsetWidth
      height: input.offsetHeight

    leftPosition = decParseInt($input.css("paddingLeft")) + decParseInt(inputOffset.left) + 2 # + 2 so the cursor is not over the text
    leftPosition += decParseInt($input.css("borderLeftWidth"))
    leftPosition += "px"

    topPosition = decParseInt($input.css("paddingTop")) + decParseInt(inputOffset.top)
    topPosition += decParseInt($input.css("borderTopWidth"))
    topPosition += "px"

    hintElement = bonzo.create("<span />")[0]
    $hintElement = bonzo hintElement


    $hintElement.html(hint)
    .css
      display: "none"
      top: topPosition
      left: leftPosition
      fontSize: $input.css "fontSize"
      lineHeight: $input.css "lineHeight"
      fontFamily: $input.css "fontFamily"
      color: @options.color
    .addClass("formwatcher-hint")
    .insertAfter input

    bean.on hintElement, "click", -> input.focus()

    fadeLength = 100
    bean.on input, "focusin", ->
      if $input.val() is ""
        $hintElement.addClass "ghosted"

    bean.on input, "focusout", ->
      if $input.val() is ""
        $hintElement.removeClass "ghosted"

    changeFunction = ->
      if $input.val() is ""
        $hintElement.show()
      else
        $hintElement.hide()

    deferredChangeFunction = -> setTimeout (-> changeFunction()), 1

    bean.on input, "keyup", changeFunction
    bean.on input, "keypress", deferredChangeFunction
    bean.on input, "keydown", deferredChangeFunction
    bean.on input, "change", changeFunction

    nextTimeout = 10
    # This is an ugly but very easy fix to make sure Hints are hidden when the browser autofills.
    delayChangeFunction = ->
      changeFunction()
      setTimeout (-> delayChangeFunction()), nextTimeout

      nextTimeout = nextTimeout * 2
      nextTimeout = (if nextTimeout > 10000 then 10000 else nextTimeout)

    delayChangeFunction()

    elements
