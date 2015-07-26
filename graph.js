define([], function() {


  var GraphEvent = {
    NEW_VERTEX: 0,
    DELETE_VERTEX: 1,
    NEW_EDGE: 2,
    DELETE_EDGE: 3,
  };

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
    this.observers = [];

    this.getAdjacencyMatrix = function() {
      var matrix = [];
      for (var i = 0; i < this.size(); i++) {
        var edges = [];
        for (var j = 0; j < this.size(); j++) {
          edges.push(0);
        }
        matrix.push(edges);
      }

      for (var i = 0; i < this.edges.length; i++) {
        var edge = this.edges[i];
        matrix[edge.sourceVertex][edge.destVertex] = edge.weight;
      }

      return matrix;
    };

    this.getAdjacencyList = function() {
      var list = [];
      for (var i = 0; i < this.size(); i++) {
        list.push([]);
      }

      for (var i = 0; i < this.edges.length; i++) {
        var edge = this.edges[i];
        list[edge.sourceVertex].push({
          vertex: edge.destVertex,
          weight: edge.weight
        });
      }

      return list;
    };

    this.addVertex = function(name) {
      for (var i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].name == name) {
          alert("Vertex " + name + " already exists.");
          return;
        }
      }

      var newVertex = new Vertex(name);

      this.vertices.push(newVertex);
      this.notifyObservers({
        message: GraphEvent.NEW_VERTEX,
        id: newVertex.name,
      });
    }

    this.addEdge = function(source, dest, weight) {
      var newEdge = new Edge(source, dest, weight)
      this.edges.push(newEdge);
      this.notifyObservers({
        message: GraphEvent.NEW_EDGE,
        source: newEdge.sourceVertex,
        dest: newEdge.destVertex,
        weight: newEdge.weight,
      });
    };

    this.size = function() {
      return this.vertices.length;
    }

    this.getVertices = function() {
      return this.vertices.slice(0);
    }

    this.getEdges = function() {
      return this.edges.slice(0);
    }

    this.registerObserver = function(observer) {
      this.observers.push(observer);
    }

    this.notifyObservers = function(notification) {
      for (var i = 0; i < this.observers.length; i++) {
        if (this.observers[i].update) {
          this.observers[i].update(notification);
        }
      }
    }

  }

  return {
    Graph: Graph,
    GraphEvent: GraphEvent,
  };
});
