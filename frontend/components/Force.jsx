import React, { Component, createRef } from "react";
import * as d3 from "d3";

export default class Force extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.restart = this.restart.bind(this);
  }

  componentDidMount() {
    var svg = d3.select(this.ref.current)
    const boundingRect = svg.node().getBoundingClientRect()
    console.log('box: ', svg.node().getBoundingClientRect())

    var width = boundingRect.width // 500
    var height = boundingRect.height // 500

    this.simulation = d3
      .forceSimulation(this.props.nodes)
      .alphaTarget(0.73)
      .velocityDecay(.95)
      .force("x", d3.forceX().strength(0.51))
      .force("y", d3.forceY().strength(0.51))
      .force(
        "collide",
        d3.forceCollide().radius((d) => d.r + 1).iterations(3)
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d, i) => (i ? 0 : (-width * 2) / 3))
      )
      .on('tick', () => {
        this.node
        .attr('transform', (d) => `translate(${d.x},${d.y})`)
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });

      })

    const g = svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    this.node = g
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll(".node");

    this.restart();
  }

  componentDidUpdate(nextProps, nextState) {
    this.restart()
  }

  restart() {
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    // Apply the general update pattern to the nodes.
    this.node = this.node.data(this.props.nodes, function (d) {
      return d.name;
    });
    this.node.exit().remove();

    const root = this.node
      .enter()
      .append("g")

    root.append('circle')
      .attr("fill", 'white')
      .attr('stroke', 'blue')
      .attr('stroke-width', '2px')
      .attr("r", (d) => d.r)

    root.append('text')
      .attr('fill', 'black')
      .attr('stroke', 'black')
      .attr('stroke-width', '0')
      // .attr('class', 'name')
      .attr('text-anchor', 'middle')
      .text((d) => d.name)

    this.node = root.merge(this.node);

    // Update and restart the simulation.
    this.simulation.nodes(this.props.nodes);
    // this.simulation.force("link").links(this.state.links);
    this.simulation.alpha(1).restart();
  }

  render() {
    return (
      <>
        <svg
          height="500px"
          width={this.props.width}
          ref={this.ref}
          style={{ border: "1px solid #000" }}
          xmlns="http://www.w3.org/2000/svg"
        ></svg>
      </>
    );
  }
}
