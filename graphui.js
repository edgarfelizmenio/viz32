define(['d3', 'graph', 'algorithms'], function(d3, graph, algorithms) {

  function createForceNodes(vertices) {
    var forceNodes = [];

    for (var i = 0; i < vertices.length; i++) {
      var v = vertices[i];
      forceNodes.push({
        id: v.name,
      });
    }
    return forceNodes;
  }

  function createForceLinks(edges, nodes) {
    var forceLinks = [];
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];

      forceLinks.push({
        source: nodes[e.sourceVertex],
        target: nodes[e.destVertex],
        weight: e.weight,
        id: e.sourceVertex + "->" + e.destVertex +
          "-" + e.weight,
      });
    }
    return forceLinks;
  }

  function GraphViz(g, parent, width, height) {

    g.registerObserver(this);

    this.nodes = createForceNodes(g.getVertices());
    this.links = createForceLinks(g.getEdges(), this.nodes);
    this.canvas = parent;
    this.nodeRadius = 12;

    // variable handles of link and node element groups
    this.nodeGroup = this.canvas.append('svg:g').selectAll('g');
    this.pathGroup = this.canvas.append('svg:g').selectAll('g');

    this.start = function() {
      //initialize markers
      initializeArrowhead(this.canvas);
      this.resetNodeAttributes();
      this.resetLinkAttributes();

      // init D3 force layout
      this.force = d3.layout.force()
        .nodes(this.nodes)
        .links(this.links)
        .size([width, height])
        .linkDistance(function(d) {
          return d.weight * 50;
        })
        .gravity(0.0625)
        .charge(-3000);

      this.restartForce();
    };

    this.draw = function() {
      function calculateTriangleValues(x1, y1, x2, y2) {
        var adj = x2 - x1;
        var opp = y2 - y1;

        var hyp = Math.sqrt(adj * adj + opp * opp);
        var cos = adj / hyp;
        var sin = opp / hyp;
        return {
          cos: cos,
          sin: sin,
          hyp: hyp,
        };
      }

      function drawLine(d) {
        var sourceX = Math.max(this.nodeRadius, Math.min(width - this.nodeRadius, d.source.x));
        var sourceY = Math.max(this.nodeRadius, Math.min(height - this.nodeRadius, d.source.y));
        var targetX = Math.max(this.nodeRadius, Math.min(width - this.nodeRadius, d.target.x));
        var targetY = Math.max(this.nodeRadius, Math.min(height - this.nodeRadius, d.target.y));

        if (d.source == d.target) {
          var arcString = 'M' + (sourceX - this.nodeRadius) + ',' + sourceY + 'A' +
            (this.nodeRadius) + ',' + (this.nodeRadius) +
            ',0,1,0,' + sourceX + ',' + (sourceY + this.nodeRadius);
          return arcString;
        }

        var triangle = calculateTriangleValues(sourceX, sourceY, targetX, targetY);
        var allowance = this.nodeRadius + 3;
        sourceX = sourceX + (allowance * triangle.cos);
        sourceY = sourceY + (allowance * triangle.sin);
        targetX = targetX - (allowance * triangle.cos);
        targetY = targetY - (allowance * triangle.sin);

        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' +
          targetY;
      }

      function drawNode(d) {
        var posX = Math.max(this.nodeRadius, Math.min(width - this.nodeRadius, d.x));
        var posY = Math.max(this.nodeRadius, Math.min(height - this.nodeRadius, d.y));
        return 'translate(' + posX + ',' + posY + ')';
      }

      function drawEdgeWeight(d) {
        var sourceX = Math.max(15, Math.min(width, d.source.x));
        var sourceY = Math.max(15, Math.min(height, d.source.y));
        var targetX = Math.max(15, Math.min(width, d.target.x));
        var targetY = Math.max(15, Math.min(height, d.target.y));
        var weightX = 0;
        var weightY = 0;


        var triangle = calculateTriangleValues(sourceX, sourceY, targetX, targetY);
        var textPosition = triangle.hyp / 2;

        if (d.source == d.target) {
          weightX = Math.max(15, Math.min(width, sourceX - (2 * this.nodeRadius)));
          weightY = Math.max(15, Math.min(height, sourceY + (2 * this.nodeRadius)));
        } else {
          weightX = Math.max(15, Math.min(width, sourceX + (textPosition * triangle.cos)));
          weightY = Math.max(15, Math.min(height, sourceY + (textPosition * triangle.sin)));
        }
        return 'translate(' + weightX + ',' + weightY + ')';
      }

      // draw path for each link
      this.pathGroup.select('path').attr('d', drawLine.bind({
        nodeRadius: this.nodeRadius,
      }));

      this.pathGroup.select('text').attr('transform', drawEdgeWeight.bind({
        nodeRadius: this.nodeRadius,
      }));

      //draw circle and text for each node
      this.nodeGroup.attr('transform', drawNode.bind({
        nodeRadius: this.nodeRadius,
      }));
    }

    this.update = function(updateObject) {

      this.dispatchNotification(updateObject);
      this.resetNodeAttributes();
      this.resetLinkAttributes();
      this.restartForce();
    }

    // AUXILLARY METHODS FOR GRAPH VISUALIZATION
    this.dispatchNotification = function(notification) {
      switch (notification.message) {
        case graph.GraphEvent.NEW_VERTEX:
          this.nodes.push({
            id: notification.id,
          });
          break;
        case graph.GraphEvent.NEW_EDGE:
          this.links.push({
            source: this.nodes[notification.source],
            target: this.nodes[notification.dest],
            weight: notification.weight,
            id: notification.source +
              "->" + notification.dest +
              "-" + notification.weight,
          });
          break;
        case "deleted vertex":
        case "deleted edge":
        case "updated vertex":
        case "updated edge":
        default:
          break;
      }
    }

    this.restartForce = function() {
      this.force.on('tick', this.draw.bind({
        pathGroup: this.pathGroup,
        nodeGroup: this.nodeGroup,
        nodeRadius: this.nodeRadius
      }));

      this.force.start();
    }

    this.stopForce = function() {
      this.force.stop();
    }

    this.startForce = function() {
      this.force.start();
    }

    this.resetNodeAttributes = function() {
      this.nodeGroup =
        this.nodeGroup.data(this.nodes, function(d) {
          return d.id;
        });

      // initialize node attributes
      this.node = this.nodeGroup.enter().append('svg:g');
      this.node.append('svg:circle')
        .attr('r', this.nodeRadius)
        .attr('fill', 'white')
        .attr('stroke', 'red');
      this.node.append('svg:text')
        .text(function(d) {
          return d.id;
        });

      this.nodeGroup.exit().remove();
    }

    this.resetLinkAttributes = function() {
      this.pathGroup =
        this.pathGroup.data(this.links, function(d) {
          return (d.id);
        });

      // initialize link attributes
      this.path = this.pathGroup.enter().append('svg:g');
      this.path.append('svg:path').attr('stroke', 'black').attr('fill-opacity', 0)
        .attr('stroke-width', '2px').style('marker-end', function() {
          return 'url(#arrowhead)';
        });
      this.path.append('svg:text').attr('stroke', 'green')
        .attr('fill', 'green').text(function(d) {
          return d.weight;
        });

      this.pathGroup.exit().remove();
    }

    this.animate = function(transitionSequence) {
      var ga = new GraphAnimator(this);
      ga.animate(transitionSequence);
    }

    this.changeColor = function(target, color, callback) {
      var tn = this.nodeGroup.filter(function(d, i) {
        return i == target;
      });
      tn.transition().duration(500).delay(500).select('circle').attr("fill", color)
        .each("end", callback);
    }

    this.changeEdge = function(target, callback) {
      var tn = this.pathGroup.filter(function(d, i) {
        console.log(d.id);
        return d.id == target;
      });
      tn.transition().duration(500).delay(500).select('path').attr("stroke-width", "4px");
      if (callback) {
        tn.each("end", callback);
      }
    }

  }

  function GraphAnimator(graphViz) {
    this.graphViz = graphViz;

    this.animate = function(transitionSequence) {
      this.graphViz.stopForce();
      console.log("Animating...");

      function runTransition(graphViz, transitionSequence, index, callback) {
        console.log("graphViz", graphViz);
        console.log("index", index);
        console.log(transitionSequence);
        console.log(index, transitionSequence[index].transition);
        switch (transitionSequence[index].transition) {
          case algorithms.transitionCode.VISIT:
            console.log("visit...");
            graphViz.changeColor(transitionSequence[index].target, "green", callback);
            break;
          case algorithms.transitionCode.TRAVERSE:
            graphViz.changeEdge(transitionSequence[index].source + "->" + transitionSequence[index].target + "-" + transitionSequence[index].weight);
            graphViz.changeColor(transitionSequence[index].target, "black", callback);
          case algorithms.transitionCode.ENQUEUE:
            graphViz.changeColor(transitionSequence[index].target, "blue", callback);
            break;
          default:
            break;
        }
      }

      function nextTransition() {
        if (this.index + 1 < transitionSequence.length) {
          console.log("graphViz", graphViz);
          runTransition(graphViz, transitionSequence, this.index + 1, nextTransition.bind({
            transitionSequence: transitionSequence,
            index: this.index + 1,
          }));
        } else {
          gv.startForce();
        }
      }

      console.log("runnign transition...");
      runTransition(this.graphViz, transitionSequence, 0, nextTransition.bind({
        index: 0,
        transitionSequence: transitionSequence,
      }));
    }

  }
  // AUXILLARY FUNCTIONS
  function initializeArrowhead(canvas) {
    canvas.append('svg:defs').append('svg:marker').attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000')
      .attr('stroke', 'black')
      .attr('stroke-width', '1px');
  }

  // Module Exports
  return {
    GraphViz: GraphViz,
  }
});
