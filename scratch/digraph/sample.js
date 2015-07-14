var width = 960,
  height = 500;

var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style("border", "2px solid black");

var nodes = [{
  id: 0,
  x: 960/2 - 75,
  y: 100,
  fixed: true,
}, {
  id: 1,
  x: 960/2 + 75,
  y: 100,
  fixed: true,
}, {
  id: 2,
  x: 960/2 - 75,
  y: 100 + 150,
  fixed: true,
}, {
  id: 3,
  x: 960/2 + 75,
  y: 100 + 150,
  fixed: true,
}, {
  id: 4,
  x: 960/2,
}];

var links = [{
  source: nodes[0],
  target: nodes[1],
  left: false,
  right: true
}, {
  source: nodes[0],
  target: nodes[2],
  left: false,
  right: true
}, {
  source: nodes[0],
  target: nodes[3],
  left: false,
  right: true
}, {
  source: nodes[1],
  target: nodes[2],
  left: false,
  right: true
}, {
  source: nodes[1],
  target: nodes[3],
  left: false,
  right: true
}, {
  source: nodes[2],
  target: nodes[4],
  left: false,
  right: true
}, {
  source: nodes[3],
  target: nodes[4],
  left: false,
  right: true
}];

// init D3 force layout
var force = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .size([width, height])
  .linkDistance(150)
  .charge(nodes.length * -100)
  .on('tick', drawgraph);

// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path');
var circle = svg.append('svg:g').selectAll('g');

path = path.data(links);

path.enter().append('svg:path')
  .attr('stroke', 'black');

path.exit().remove();

circle = circle.data(nodes, function(d) {
  return d.id;
});

var g = circle.enter().append('svg:g');

g.append('svg:circle')
  .attr('r', 12)
  .attr('fill', 'white')
  .attr('stroke', 'black');

g.append('svg:text')
  .attr('x', -4)
  .attr('y', 4)
  .text(function(d) {
    return d.id;
  });

// remove old nodes
circle.exit().remove();

force.start();

function drawgraph() {
  // draw directed edges with proper padding from node centers
  path.attr('d', function(d) {
    return 'M' + d.source.x + ',' + d.source.y + 'L' + d.target.x + ',' +
      d.target.y;
  });

  circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}
