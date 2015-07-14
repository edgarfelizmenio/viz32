define([], function() {

  function Vertex(name) {
    this.name = name;
  }

  function Edge(sourceVertex, destVertex, weight) {
    this.sourceVertex = sourceVertex;
    this.destVertex = destVertex;
    this.weight = weight;
  }

  function Graph() {
    this.vertices = [];
    this.edges = [];

    this.addVertex = function(vertex) {
      this.vertices.push(vertex);
    };
    this.addEdge = function(edge) {
      this.edges.push(edge);
    };

    this.getAdjMatrix = function() {

    };

    this.getAdjList = function() {

    };

  }

  var algorithms = [{
    value: "Floyd-Warshall Algorithm",
    label: "Floyd-Warshall Algorithm",
    text: "Floyd-Warshall Algorithm",
  }, {
    value: "Dijkstra's Algorithm",
    label: "Dijkstra's Algorithm",
    text: "Dijkstra's Algorithm",
  }, {
    value: "Prim's Algorithm",
    label: "Prim's Algorithm",
    text: "Prim's Algorithm",
  }, {
    value: "Kruskal's Algorithm",
    label: "Kruskal's Algorithm",
    text: "Kruskal's Algorithm",
  }, {
    value: "Union Operation",
    label: "Union Operation",
    text: "Union Operation",
  }, {
    value: "Find Operation",
    label: "Find Operation",
    text: "Find Operation",
  }, {
    value: "Topological Sorting",
    label: "Topological Sorting",
    text: "Topological Sorting",
  }, {
    value: "BFS",
    label: "BFS",
    text: "BFS",
  }, {
    value: "DFS",
    label: "DFS",
    text: "DFS",
  }, {
    value: "Approximate Graph Coloring",
    label: "Approximate Graph Coloring",
    text: "Approximate Graph Coloring",
  }];

  return {
    algorithms: algorithms,
  };
});
