define(['d3', 'graph'], function(d3, graph) {

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
      });
    }
    return forceLinks;
  }

  function GraphViz(nodes, links, parent, width, height) {
    this.nodes = nodes;
    this.links = links;
    this.canvas = parent;
    this.nodeRadius = 12;

    //initialize markers
    createMarker(this.canvas);

    // variable handles of link and node element groups
    this.path = this.canvas.append('svg:g').selectAll('path');
    this.circle = this.canvas.append('svg:g').selectAll('g');

    // initialize link attributes
    this.path = this.path.data(links);
    this.path.enter().append('svg:path')
      .attr('stroke', 'black')
      .attr('stroke-width', '2px');
    this.path.exit().remove();

    // initialize node attributes
    this.circle = this.circle.data(nodes, function(d) {
      return d.id;
    });

    // each node is a group containing the node and the text
    this.g = this.circle.enter().append('svg:g');
    this.g.append('svg:circle')
      .attr('r', this.nodeRadius)
      .attr('fill', 'white')
      .attr('stroke', 'black');
    this.g.append('svg:text')
      .attr('x', -4)
      .attr('y', 4)
      .text(function(d) {
        return d.id;
      });

    // remove old nodes
    this.circle.exit().remove();



    console.log(this.path);
    console.log(this.circle);
    console.log(this.nodeRadius);

    this.start = function() {
      // init D3 force layout
      this.force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([width, height])
        .linkDistance(150)
        .gravity(0.0625)
        .charge(nodes.length * -500)
        .on('tick', this.draw.bind({
          path: this.path,
          circle: this.circle,
          nodeRadius: this.nodeRadius + 3
        }));

      this.force.start();
    };

    this.restart = function() {
      this.start();
    };

    this.draw = function() {
      function drawLine(d) {
        //add proper allowance so that the lines are not covered with circles

        var adj = d.target.x - d.source.x;
        var opp = d.target.y - d.source.y;

        var hyp = Math.sqrt(adj * adj + opp * opp);
        var cos = adj / hyp;
        var sin = opp / hyp;

        var targetX = d.target.x - (this.nodeRadius * cos);
        var targetY = d.target.y - (this.nodeRadius * sin);

        return 'M' + d.source.x + ',' + d.source.y + 'L' + targetX + ',' +
          targetY;
      }

        // draw path for each link
      this.path.attr('d', drawLine.bind({
        nodeRadius: this.nodeRadius
      })).style('marker-end', function() {
        return 'url(#arrowhead)';
      });

      //draw circle for each circle
      this.circle.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }

  }

  return {
    createForceNodes: createForceNodes,
    createForceLinks: createForceLinks,
    GraphViz: GraphViz,
  }
});
