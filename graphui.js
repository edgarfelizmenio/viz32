define(['d3', 'graph'], function(d3, graph) {



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
        id: nodes[e.sourceVertex].id + "-" + nodes[e.destVertex].id +
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
      createMarker(this.canvas);
      this.resetNodeAttributes();
      this.resetLinkAttributes();

      // init D3 force layout
      this.force = d3.layout.force()
        .nodes(this.nodes)
        .links(this.links)
        .size([width, height])
        .linkDistance(150)
        .gravity(0.0625)
        .charge(-500);

      this.restartForce();
    };

    this.draw = function() {
      function calculateTriangleValues(d) {
        var adj = d.target.x - d.source.x;
        var opp = d.target.y - d.source.y;

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
        //add proper allowance so that the lines are not covered with circles
        triangle = calculateTriangleValues(d);

        var sourceX = d.source.x + (this.nodeRadius * triangle.cos);
        var sourceY = d.source.y + (this.nodeRadius * triangle.sin);
        var targetX = d.target.x - (this.nodeRadius * triangle.cos);
        var targetY = d.target.y - (this.nodeRadius * triangle.sin);

        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' +
          targetY;
      }

      // draw path for each link
      this.pathGroup.select('path').attr('d', drawLine.bind({
        nodeRadius: this.nodeRadius + 3
      }));

      this.pathGroup.select('text').attr('transform', function(d) {
        triangle = calculateTriangleValues(d);

        var weightX = d.source.x + ((triangle.hyp / 2) * triangle.cos);
        var weightY = d.source.y + ((triangle.hyp / 2) * triangle.sin);

        return 'translate(' + weightX + ',' + weightY + ')';
      })

      //draw circle for each node
      this.nodeGroup.attr('transform', function(d) {
        // console.log("translating to: ", d.x, d.y)
        return 'translate(' + d.x + ',' + d.y + ')';
      });
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
        case "new vertex":
          this.nodes.push({
            id: notification.id,
          });
          break;
        case "new edge":
          console.log(notification);
          this.links.push({
            source: this.nodes[notification.source],
            target: this.nodes[notification.dest],
            weight: notification.weight,
            id: this.nodes[notification.source].id +
              "-" + this.nodes[notification.dest].id +
              "-" + notification.weight,
          });
          break;
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
      this.path.append('svg:path').attr('stroke', 'black')
        .attr('stroke-width', '2px').style('marker-end', function() {
          return 'url(#arrowhead)';
        });
      this.path.append('svg:text').attr('stroke', 'green').text(function(d) {
        return d.weight;
      });

      this.pathGroup.exit().remove();
    }

  }

  // AUXILLARY FUNCTIONS
  function createMarker(canvas) {
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
