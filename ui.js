define(["d3"], function(d3) {
  var canvasWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.9;
  var canvasHeight = 500;

  function createHeader(text, type) {
    var header = d3.select('body').append("h" + type)
      .text(text);
    return header;
  }

  function createButton(id, value, disabled, clickEvent) {

    if (!clickEvent) {
      clickEvent = null;
    }

    var button = d3.select('body').append('input')
      .attr('type', 'button')
      .attr('id', id)
      .attr('value', value)
      .attr('disabled', disabled)
      .on('click', clickEvent);

    if (disabled) {
      button.attr('disabled', disabled);
    }

    return button;
  }

  function createTextInput(id, value) {
    var textInput = d3.select('body').append('input')
      .attr('type', 'text')
      .attr('id', id)
      .attr('value', value);

    return textInput;
  }

  function createSelection(id, options) {
    var selectionButton = d3.select('body').append('select')
      .attr('id', id);

    for (var i = 0; i < options.length; i++) {
      selectionButton.append('option')
        .attr('value', options[i].value)
        .attr('label', options[i].label)
        .text(options[i].text);
    }
  }

  function createCanvas(width, height) {
    var canvas = d3.select('body').append('svg')
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");
    return canvas;
  }

  return {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,

    // methods
    createHeader: createHeader,
    createButton: createButton,
    createTextInput: createTextInput,
    createSelection: createSelection,
    createCanvas: createCanvas,
  };
});
