requirejs(['d3', 'ui', 'algorithms'],
  function(d3, ui, algorithms) {
    console.log(ui.canvasWidth);
    var mainHeader = ui.createHeader('Directed Graph Editor', 1);
    var newNodeButton = ui.createButton('newNode', 'Add Node');
    var newNodeTextInput = ui.createTextInput('newNodeValue', 'bucharest');
    var deleteNodeButton = ui.createButton('deleteNode', 'Delete Node', true);
    var runButton = ui.createButton('runAlgorithm', "Run");
    var algorithmOptions = ui.createSelection('algorithms', algorithms.algorithms);

    newNodeButton.on('click', function() {
      alert(newNodeTextInput.property('value').toString());
    });

    var canvas = ui.createCanvas(ui.canvasWidth, ui.canvasHeight);
  });
