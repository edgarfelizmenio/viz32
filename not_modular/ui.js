var canvasWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * 0.9;
var canvasHeight = 500;

d3.select('document').on();

d3.select('body').append('h1')
  .text('Directed Graph Editor');

newNodeButton = d3.select('body').append('input')
  .attr('type', 'button')
  .attr('id', "newNode")
  .attr('value', "Add Node");

newNodeValue = d3.select('body').append('input')
  .attr('type', 'text')
  .attr('id', "newNodeValue")
  .attr('value', 'bucharest');

deleteNodeButton = d3.select('body').append('input')
  .attr('type', 'button')
  .attr('id', "deleteNode")
  .attr('disabled', true)
  .attr('value', "Delete Node");

algorithms = ["Floyd-Warshall Algorithm",
  "Dijkstra's Algorithm",
  "Prim's Algorithm",
  "Kruskal's Algorithm",
  "Union Operation",
  "Find Operation",
  "Topological Sorting",
  "BFS",
  "DFS",
  "Approximate Graph Coloring",
];

algorithmOptions = d3.select('body').append('select')
  .attr('id', "algorithms");

for (algorithm of algorithms) {
  algorithmOptions.append('option')
    .attr('value', algorithm)
    .attr('label', algorithm)
    .text(algorithm);
  console.log(algorithm);
}

runButton = d3.select('body').append('input')
  .attr('type', 'button')
  .attr('id', "runAlgorithm")
  .attr('value', "Run");


newNodeButton.on('click', function() {
  alert(newNodeValue.property('value').toString());
})

canvas = d3.select('body').append('svg')
  .attr("width", canvasWidth)
  .attr("height", canvasHeight)
  .style("border", "1px solid black");
