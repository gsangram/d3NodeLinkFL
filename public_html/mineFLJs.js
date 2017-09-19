$(document).ready(function () {

    var width = 1200,
            height = 500;

    var layout = d3.layout.force()
            .size([width, height])
            .nodes([{}])           // initialize with a single node
            .linkDistance(30)
            .charge(-60)
            .on("tick", tick);

    var svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("mousemove", mousemove)
            .on("mousedown", mousedown);

    var nodes = layout.nodes(),
            links = layout.links(),
            node = svg.selectAll(".node"),
            link = svg.selectAll(".link");

    var cursor = svg.append("circle")
            .attr("class", "cursor")
            .attr("r", 20)
            .style("stroke", "grey")
            .style("fill", "none");

    function mousemove() {
        cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
    }

    function mousedown() {

        var point = d3.mouse(this),
                node = {x: point[0], y: point[1]},
                n = nodes.push(node);
//    console.log("inside mousedown fun", n);

        nodes.forEach(function (target) {
            var x = target.x - node.x,
                    y = target.y - node.y;
            if (Math.sqrt(x * x + y * y) < 30) {
                links.push({source: node, target: target})
            }
        })

restart();

    }

    function tick() {
        node.attr("cx", function (d) {
            return d.x;  })
                .attr("cy", function (d) {
            return d.y; });

        link.attr("x1", function (d) {
            console.log("inside x1", d);
            return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
    }
    
    function mousedownNode(d, i) {

        nodes.splice(i, 1);
        links = links.filter(function (l) {
            return l.source !== d && l.target !== d;
        });
        d3.event.stopPropagation();
        restart();

    }
    
    function restart() {

        node = node.data(nodes);
        node.enter().insert("circle", ".cursor")
                .attr("class", "node")
                .attr("r", 5)
//                .call(layout.drag);
                .on("mousedown",mousedownNode);
        node.exit().remove();      
        
        link= link.data(links);
        link.enter().insert("line",".node")
                .attr("class","link")
                .style("stroke","lightgrey");      
        link.exit().remove();
      
        layout.start();
      
    }

})