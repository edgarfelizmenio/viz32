define([], function() {

  var transitionCode = {
    VISIT: 0,
    TRAVERSE: 1,
    ENQUEUE: 2,
  };

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
    driver: function(g) {
      var NOT_VISITED = 0, ON_QUEUE = 1 , VISITED = 2;

      var adjList = g.getAdjacencyList();
      var status = [];
      var transitionSequence = [];

      for (var i = 0; i < adjList.length; i++) {
        status.push(NOT_VISITED);
      }

      function BFS(vertex) {
        var transitionSubsequence = [];
        var list = [];
        list.push(vertex);
        status[vertex] = ON_QUEUE;

        transitionSubsequence.push({
          transition: transitionCode.ENQUEUE,
          source: null,
          target: vertex,
        });

        while (!(list.length == 0)) {
          var current = list.shift();

          console.log("visit " + current);
          var neighbors = adjList[current];
          console.log(current);
          console.log("neighbors: " + neighbors);

          transitionSubsequence.push({
            transition: transitionCode.VISIT,
            target: current,
          });

          for (var j = 0; j < neighbors.length; j++) {
            var neighbor = neighbors[j];
            if (status[neighbor.vertex] == NOT_VISITED) {
              console.log("enqueue " + neighbor.vertex);
              list.push(neighbor.vertex);
              status[neighbor.vertex] = ON_QUEUE;

              transitionSubsequence.push({
                transition: transitionCode.TRAVERSE,
                source: current,
                target: neighbor.vertex,
                weight: neighbor.weight,
              });

              transitionSubsequence.push({
                transition: transitionCode.ENQUEUE,
                source: current,
                target: neighbor.vertex,
              });
            }
          }

          status[current] = VISITED;
        }
        return transitionSubsequence;
      }

      for (var i = 0; i < adjList.length; i++) {
        if (status[i] == NOT_VISITED) {
          console.log("start bfs on " + i);
          transitionSequence.push.apply(transitionSequence, BFS(i));
        }
      }

      return transitionSequence;
    }
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
    transitionCode: transitionCode
  };
});
