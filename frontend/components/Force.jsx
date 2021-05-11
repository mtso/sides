import React, { Component, createRef } from "react"
import * as d3 from "d3"

import { toMap } from '../../util'

function toCss(obj) {
  return Object.keys(obj).map((k) => `${k}:${obj[k]}`).join('; ')
}

export default class Force extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
    }
    this.ref = createRef();
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    const svg = d3.select(this.ref.current)
    const { width, height } = svg.node().getBoundingClientRect()
    this.width = width

    const container = svg.append('g')
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
    this.node = container.selectAll('g') // meaningless selectAll?

    this.simulation = d3.forceSimulation(this.props.nodes, (d) => d.player)
      .alphaTarget(0.5)
      .velocityDecay(0.95)
      .force("x", d3.forceX().strength(0.51))
      .force("y", d3.forceY().strength(0.51))
      .force("collide", d3.forceCollide().radius((d) => d.r + 1).iterations(3))
      .force('charge', d3.forceManyBody()
             .strength((d, i) => (i ? 0 : (-width * 2) / 3)))
      .on('tick', () => {
        this.node.attr('transform', (d) => `translate(${d.x},${d.y})`)
      })

    this.update()
  }

  componentDidUpdate(prevProps, prevSate) {
    this.update()
  }

  update() {
    const existing = toMap(this.node.data(), (d) => d.player)
    const newNodes = (this.props.nodes || []).map((p) =>
      existing[p.player] || ({
        ...p,
        x: this.props.side*this.width / 2,
        y: Math.floor(Math.random() * 50)- 25
      }))

    const node = this.node.data(newNodes, (d) => d.player)
    node.exit().remove()

    const nodeEnter = node.enter().append('g')
    nodeEnter.append('circle')
      .attr('fill', 'white')
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr('r', 20)
    nodeEnter.append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'black')
      .style('font-size', (d) => {
        const len = (d.name || '').length
        if (len >= 4) {
          const size = Math.max( (20-Math.min(20,len))/20 , 0.4 )
          return `${size}em`
        } else {
          return '1em'
        }
      })
      .style('font-weight', (d) => {
        if ((d.name || '').length < 10) {
          return '400'
        } else {
          return '600'
        }
      })
      .text((d) => {
        const name = d.name || ''
        return name.length <= 14 ? d.name : name.substring(0, 13) + '…'
      })

    this.node = node.merge(nodeEnter)
    this.simulation.nodes(newNodes, (d) => d.player).restart();
  }

  render() {
    return (
      <svg
        width={this.props.width}
        ref={this.ref}
        style={{
          outline: "1px solid #000",
          height: '100%',
          backgroundColor: this.props.backgroundColor,
        }}
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    );
  }
}
