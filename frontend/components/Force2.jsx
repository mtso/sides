import React, { Component, createRef } from "react";
import * as d3 from "d3";

export default class Force2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
    }
    this.ref = createRef();
    this.restart = this.restart.bind(this);
  }

  componentDidMount() {
    const nodes = [{player:'matthewt@wepay.com',name:'matthew'}, {player:'xuec@wepay.com',name:'xue'}]
    const svg = d3.select(this.ref.current)
    const { width, height } = svg.node().getBoundingClientRect()

    const container = svg.append('g')
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
  
    // const node = container
    //   // .selectAll('.node')
    //   .data(this.props.nodes)
    //   .enter().append('g')
      // .selectAll('.node')
    const node = container
      .selectAll('.node')
      .data(nodes) //this.props.nodes)
      .enter().append('g')
      // .selectAll('.node')
    
    const circ = node.append('circle')
      .attr('fill', 'white')
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr('r', 20)
   
    const text = node.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'black')
      .text(d => d.name)
                  
    const simulation = d3.forceSimulation(nodes, d=>d.player) //this.props.nodes, d => d.player)
      .alphaTarget(0.7)
      .velocityDecay(0.95)
      .force("x", d3.forceX().strength(0.51))
      .force("y", d3.forceY().strength(0.51))
      .force("collide", d3.forceCollide().radius((d) => d.r + 1).iterations(3))
      .force('charge', d3.forceManyBody()
             .strength((d, i) => (i ? 0 : (-width * 2) / 3)))
      .on('tick', function() {
        node.attr('transform', d => `translate(${d.x},${d.y})`)
      })
      .restart()
  }

  componentDidUpdate(prevProps, prevSate) {
    this.restart()
  }

  restart() {
    // this.node = 
    // this.node = this.node.data(this.props.nodes, d => d.player)
    // this.node.exit().remove()

    // // const node = this.node = svg.append('g').selectAll('g').data(
    // //   this.props.nodes, d => d.player).enter().append('g')

    // const nodeEnter = this.node.enter().append('g')
  
    // const circ = nodeEnter.append('circle')
    //     .attr('fill', 'white')
    //     .attr("stroke", "blue")
    //     .attr("stroke-width", 1.5)
    //     .attr('r', () => 20)

    // const text = nodeEnter.append('text')
    //   .attr('text-anchor', 'middle')
    //   .attr('alignment-baseline', 'middle')
    //   .attr('fill', 'black')
    //   .text(d => d.name)

    // const nodeEnter = this.node.enter().append('g')
  
    // const circ = this.node.append('circle')
    //     .attr('fill', 'white')
    //     .attr("stroke", "blue")
    //     .attr("stroke-width", 1.5)
    //     .attr('r', () => 20)

    // const text = this.node.append('text')
    //   .attr('text-anchor', 'middle')
    //   .attr('alignment-baseline', 'middle')
    //   .attr('fill', 'black')
    //   .text(d => d.name)


    // this.node = this.node.data(this.props.nodes, function (d) {
    //   return d.player;
    // });
    // this.node.exit().remove();

    // const root = this.node
    //   .enter()
    //   .append("g")

    // root.append('circle')
    //   .attr("fill", 'white')
    //   .attr('stroke', 'blue')
    //   .attr('stroke-width', '2px')
    //   .attr("r", (d) => d.r)

    // root.append('text')
    //   .attr('fill', 'black')
    //   .attr('stroke', 'black')
    //   .attr('stroke-width', '0')
    //   // .attr('class', 'name')
    //   .attr('text-anchor', 'middle')
    //   .text((d) => d.name)

    // this.node = root.merge(this.node);

    // Update and restart the simulation.
    // this.simulation.nodes(this.props.nodes); //.start();

    // this.simulation.force("link").links(this.state.links);
    // this.simulation.alpha(1).restart();
    // this.simulation.alpha(1).restart();




    // this.simulation.nodes(this.props.nodes).restart()
  }

  render() {
    return (
      <svg
        width={this.props.width}
        ref={this.ref}
        style={{ outline: "1px solid #000", height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    );
  }
}
