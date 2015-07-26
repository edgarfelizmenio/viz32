requirejs(['d3', 'ui', 'algorithms', 'graph', 'graphui'],
  function(d3, ui, algorithms, graph, graphui) {
    // console.log(ui.canvasWidth);
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

    var g = new graph.Graph();

    newNodeButton.on('click', function() {
      g.addVertex(newNodeTextInput.property('value').toString());
    });

    gv = new graphui.GraphViz(g, canvas, ui.canvasWidth, ui.canvasHeight);
    gv.start();

    g.addVertex("0 Frodo");
    g.addVertex("1 Gandalf");
    g.addVertex("2 Gimli");
    g.addVertex("3 Legolas");
    g.addVertex("4 Samwise");
    g.addVertex("5 Sauron");
    g.addEdge(0, 1, 1);
    g.addEdge(0, 2, 1);
    g.addEdge(0, 3, 1);
    g.addEdge(1, 3, 1);
    g.addEdge(2, 3, 1);
    g.addEdge(2, 4, 1);
    g.addEdge(3, 4, 1);
    g.addEdge(4, 5, 2);

    g.addVertex("6 Edgar");
    g.addEdge(6, 4, 6);

    g.addVertex("7 Felizmenio");
    g.addEdge(6, 7, 6);
    g.addEdge(6, 5, 4);
    g.addEdge(5,5,10);


    runButton.on('click', function() {
      transitionSequence = algorithms.algorithms[7].driver(g);
      gv.animate(transitionSequence);
    });

  });
