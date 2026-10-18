import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphEdge, NodeType } from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Play, 
  Pause,
  Maximize2,
  Database,
  Shield,
  Layers,
  Radio,
  ExternalLink
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlightNodeIds: string[];
  highlightEdgeIds: string[];
  activeStepNodes?: string[];
  activeStepEdges?: string[];
  selectedFindingId: string;
  onSelectNode: (node: GraphNode) => void;
  isSimulating?: boolean;
}

// Visual styling definitions by node type
const NODE_THEMES: Record<NodeType, {
  color: string;
  borderColor: string;
  glowColor: string;
  bgGradStart: string;
  bgGradEnd: string;
  label: string;
}> = {
  Internet: {
    color: '#38bdf8',
    borderColor: '#0284c7',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    bgGradStart: '#08131d',
    bgGradEnd: '#040b11',
    label: 'INGRESS'
  },
  Endpoint: {
    color: '#a78bfa',
    borderColor: '#7c3aed',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    bgGradStart: '#120d22',
    bgGradEnd: '#090712',
    label: 'GATEWAY'
  },
  Service: {
    color: '#818cf8',
    borderColor: '#4f46e5',
    glowColor: 'rgba(129, 140, 248, 0.4)',
    bgGradStart: '#0e1124',
    bgGradEnd: '#070914',
    label: 'SERVICE'
  },
  Package: {
    color: '#fbbf24',
    borderColor: '#d97706',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    bgGradStart: '#1d1408',
    bgGradEnd: '#0e0a04',
    label: 'PACKAGE/CVE'
  },
  DataStore: {
    color: '#f43f5e',
    borderColor: '#e11d48',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    bgGradStart: '#1f080f',
    bgGradEnd: '#100407',
    label: 'DATASTORE'
  },
  Team: {
    color: '#34d399',
    borderColor: '#059669',
    glowColor: 'rgba(52, 211, 153, 0.35)',
    bgGradStart: '#071810',
    bgGradEnd: '#030c08',
    label: 'TEAM/IAM'
  }
};

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
  highlightNodeIds,
  highlightEdgeIds,
  activeStepNodes = [],
  activeStepEdges = [],
  selectedFindingId,
  onSelectNode,
  isSimulating
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isPhysicsPaused, setIsPhysicsPaused] = useState(false);
  const [viewFilter, setViewFilter] = useState<'all' | 'attack_only' | 'crown_jewels'>('all');

  // Combine highlights: if activeStepNodes provided, use those, else highlightNodeIds
  const effectiveHighlightNodes = useMemo(() => {
    return new Set(activeStepNodes.length > 0 ? activeStepNodes : highlightNodeIds);
  }, [activeStepNodes, highlightNodeIds]);

  const effectiveHighlightEdges = useMemo(() => {
    return new Set(activeStepEdges.length > 0 ? activeStepEdges : highlightEdgeIds);
  }, [activeStepEdges, highlightEdgeIds]);

  const hasActiveAttackPath = effectiveHighlightNodes.size > 0;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 700;
    const height = containerRef.current.clientHeight || 550;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs for filters and gradients
    const defs = svg.append('defs');

    // Laser attack glow filter
    const attackFilter = defs.append('filter')
      .attr('id', 'attack-path-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    attackFilter.append('feGaussianBlur')
      .attr('stdDeviation', '5')
      .attr('result', 'coloredBlur');
    const feMerge = attackFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers
    const createMarker = (id: string, color: string) => {
      defs.append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 26)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L9,0L0,4')
        .attr('fill', color);
    };

    createMarker('arrow-default', '#2d3345');
    createMarker('arrow-attack', '#ef4444');
    createMarker('arrow-amber', '#f59e0b');

    // Root Zoom Group
    const g = svg.append('g').attr('class', 'graph-container');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Initial center transform
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2 - 20, height / 2 - 15).scale(0.88));

    // Deep copy data for D3 mutation
    const simulationNodes: (GraphNode & d3.SimulationNodeDatum)[] = nodes.map((d, index) => {
      let initX = 0;
      let initY = 0;
      if (d.type === 'Internet') { initX = -270; initY = 0; }
      else if (d.type === 'Endpoint') { initX = -150; initY = d.id === 'endpoint_admin' ? 140 : -30; }
      else if (d.type === 'Service') {
        const offsetMap: Record<string, [number, number]> = {
          service_auth: [-20, -100],
          service_payment: [80, -140],
          service_cart: [-10, 60],
          service_search: [90, 80],
          service_webhook: [120, 160],
          service_recommendation: [160, 20],
          service_internal_admin: [-20, 200]
        };
        const [ox, oy] = offsetMap[d.id] || [0, 0];
        initX = ox;
        initY = oy;
      }
      else if (d.type === 'Package') {
        initX = (index % 4) * 50 + 40;
        initY = (index % 3) * 60 - 80;
      }
      else if (d.type === 'DataStore') {
        initX = 260;
        initY = d.id === 'datastore_customer_db' ? -90 : (d.id === 'datastore_payment_vault' ? -180 : 80);
      }
      else if (d.type === 'Team') {
        initX = -120;
        initY = -220 + index * 60;
      }

      return {
        ...d,
        x: d.x ?? initX,
        y: d.y ?? initY,
        vx: 0,
        vy: 0
      };
    });

    const simulationEdges: (GraphEdge & { source: any; target: any })[] = edges.map((e) => ({
      ...e,
      source: e.source,
      target: e.target
    }));

    // Force simulation with stable physics
    const simulation = d3.forceSimulation(simulationNodes)
      .force('link', d3.forceLink(simulationEdges).id((d: any) => d.id).distance(105).strength(0.75))
      .force('charge', d3.forceManyBody().strength(-360))
      .force('collide', d3.forceCollide().radius(48))
      .force('center', d3.forceCenter(0, 0).strength(0.04))
      .alphaDecay(0.035);

    simulationRef.current = simulation;

    // Edge elements group
    const linkGroup = g.append('g').attr('class', 'links');
    const edgePaths = linkGroup.selectAll('g.edge')
      .data(simulationEdges)
      .enter()
      .append('g')
      .attr('class', 'edge');

    // Base line
    const linkLines = edgePaths.append('line')
      .attr('stroke', (d) => {
        const isPath = effectiveHighlightEdges.has(d.id);
        return isPath ? '#ef4444' : '#1c2130';
      })
      .attr('stroke-width', (d) => {
        const isPath = effectiveHighlightEdges.has(d.id);
        return isPath ? 2.5 : 1.2;
      })
      .attr('stroke-opacity', (d) => {
        if (!hasActiveAttackPath) return 0.65;
        return effectiveHighlightEdges.has(d.id) ? 1.0 : 0.12;
      })
      .attr('marker-end', (d) => {
        return effectiveHighlightEdges.has(d.id) ? 'url(#arrow-attack)' : 'url(#arrow-default)';
      })
      .attr('filter', (d) => {
        return effectiveHighlightEdges.has(d.id) ? 'url(#attack-path-glow)' : null;
      });

    // High-tech laser beam animation for attack edges
    const linkBeams = edgePaths.append('line')
      .attr('class', (d) => effectiveHighlightEdges.has(d.id) ? 'animate-laser-beam' : 'hidden')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '8 6')
      .attr('stroke-opacity', 0.85);

    // Edge text labels
    const edgeLabels = edgePaths.append('g')
      .attr('class', 'edge-label-group')
      .attr('opacity', (d) => {
        if (!hasActiveAttackPath) return 0.7;
        return effectiveHighlightEdges.has(d.id) ? 1 : 0.08;
      });

    edgeLabels.append('rect')
      .attr('fill', '#07080d')
      .attr('stroke', (d) => effectiveHighlightEdges.has(d.id) ? '#ef4444' : '#181c28')
      .attr('stroke-width', 1)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('x', -24)
      .attr('y', -8)
      .attr('width', 48)
      .attr('height', 16);

    edgeLabels.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '3.5px')
      .attr('font-size', '8.5px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', (d) => effectiveHighlightEdges.has(d.id) ? '#fca5a5' : '#727a92')
      .text((d) => d.label);

    // Node elements group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup.selectAll('g.node')
      .data(simulationNodes)
      .enter()
      .append('g')
      .attr('class', 'node cursor-pointer')
      .call(
        d3.drag<SVGGElement, any>()
          .on('start', (event, d) => {
            if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.2).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0);
            if (!isPhysicsPaused) {
              d.fx = null;
              d.fy = null;
            }
          })
      );

    // Node radar pulse ring if on critical attack path
    nodeElements.each(function (d) {
      const isPath = effectiveHighlightNodes.has(d.id);
      if (isPath) {
        d3.select(this)
          .append('circle')
          .attr('r', 30)
          .attr('fill', 'none')
          .attr('stroke', '#ef4444')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.6)
          .attr('class', 'animate-radar-ping');
      }
    });

    // Sleek rectangular card container
    nodeElements.append('rect')
      .attr('width', 96)
      .attr('height', 44)
      .attr('x', -48)
      .attr('y', -22)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('fill', (d) => {
        const theme = NODE_THEMES[d.type];
        return theme.bgGradStart;
      })
      .attr('stroke', (d) => {
        if (effectiveHighlightNodes.has(d.id)) return '#ef4444';
        const theme = NODE_THEMES[d.type];
        return theme.borderColor;
      })
      .attr('stroke-width', (d) => effectiveHighlightNodes.has(d.id) ? 2 : 1)
      .attr('opacity', (d) => {
        if (!hasActiveAttackPath) return 1.0;
        return effectiveHighlightNodes.has(d.id) ? 1.0 : 0.2;
      })
      .attr('filter', (d) => {
        if (effectiveHighlightNodes.has(d.id)) return 'url(#attack-path-glow)';
        return null;
      });

    // Top specular edge highlight
    nodeElements.append('line')
      .attr('x1', -46)
      .attr('y1', -21)
      .attr('x2', 46)
      .attr('y2', -21)
      .attr('stroke', (d) => effectiveHighlightNodes.has(d.id) ? '#ff9999' : '#ffffff')
      .attr('stroke-width', 1)
      .attr('opacity', (d) => (!hasActiveAttackPath || effectiveHighlightNodes.has(d.id)) ? 0.2 : 0.05);

    // Node Type Monospace Label (e.g. INGRESS, SERVICE, PII)
    nodeElements.append('text')
      .attr('x', -40)
      .attr('y', -10)
      .attr('font-size', '7.5px')
      .attr('font-weight', '700')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('letter-spacing', '0.5px')
      .attr('fill', (d) => {
        if (effectiveHighlightNodes.has(d.id)) return '#ef4444';
        return NODE_THEMES[d.type].color;
      })
      .attr('opacity', (d) => (!hasActiveAttackPath || effectiveHighlightNodes.has(d.id)) ? 1 : 0.2)
      .text((d) => d.isCrownJewel ? 'CROWN JEWEL' : NODE_THEMES[d.type].label);

    // Node Title / Label
    nodeElements.append('text')
      .attr('x', -40)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', (d) => {
        if (effectiveHighlightNodes.has(d.id)) return '#ffffff';
        return '#e2e4ec';
      })
      .attr('opacity', (d) => (!hasActiveAttackPath || effectiveHighlightNodes.has(d.id)) ? 1 : 0.2)
      .text((d) => {
        const text = d.label;
        return text.length > 13 ? text.slice(0, 12) + '…' : text;
      });

    // Sublabel
    nodeElements.append('text')
      .attr('x', -40)
      .attr('y', 14)
      .attr('font-size', '7.5px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', '#7a8198')
      .attr('opacity', (d) => (!hasActiveAttackPath || effectiveHighlightNodes.has(d.id)) ? 0.8 : 0.15)
      .text((d) => {
        const sub = d.sublabel || d.environment || '';
        return sub.length > 15 ? sub.slice(0, 14) + '…' : sub;
      });

    // Crown Jewel (PII) Badge
    nodeElements.each(function (d) {
      if (d.isCrownJewel) {
        const jewel = d3.select(this).append('g').attr('transform', 'translate(36, -21)');
        jewel.append('rect')
          .attr('x', -12)
          .attr('y', -6)
          .attr('width', 22)
          .attr('height', 12)
          .attr('rx', 2)
          .attr('fill', '#ef4444')
          .attr('stroke', '#ff7878')
          .attr('stroke-width', 0.8);
        jewel.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '3px')
          .attr('font-size', '7px')
          .attr('font-weight', '700')
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('fill', '#ffffff')
          .text('PII');
      }
    });

    // Hover & Click Interactions
    nodeElements
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left + 15,
            y: event.clientY - rect.top - 15
          });
        }
      })
      .on('mousemove', (event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left + 15,
            y: event.clientY - rect.top - 15
          });
        }
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        setTooltipPos(null);
      })
      .on('click', (_, d) => {
        sound.playPing(720);
        onSelectNode(d);
      });

    // Simulation tick handler
    simulation.on('tick', () => {
      linkLines
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkBeams
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      edgeLabels.attr('transform', (d: any) => {
        const mx = (d.source.x + d.target.x) / 2;
        const my = (d.source.y + d.target.y) / 2;
        return `translate(${mx}, ${my})`;
      });

      nodeElements.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, effectiveHighlightNodes, effectiveHighlightEdges, onSelectNode, hasActiveAttackPath, isPhysicsPaused]);

  // Zoom control helpers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.25);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.8);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 700;
    const height = containerRef.current.clientHeight || 550;
    d3.select(svgRef.current).transition().duration(500).call(
      zoomBehaviorRef.current.transform,
      d3.zoomIdentity.translate(width / 2 - 20, height / 2 - 15).scale(0.88)
    );
  };

  const togglePhysics = () => {
    if (!simulationRef.current) return;
    if (isPhysicsPaused) {
      simulationRef.current.alpha(0.3).restart();
      setIsPhysicsPaused(false);
    } else {
      simulationRef.current.stop();
      setIsPhysicsPaused(true);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[550px] bg-[#07090e] border border-[#1a1d28] card-raised select-none overflow-hidden flex flex-col">
      {/* Clean Unified Top Bar (No floating overlays) */}
      <div className="z-10 bg-[#0b0d14] border-b border-[#181a24] px-3 py-2 flex items-center justify-between gap-3 text-[10px] font-mono">
        {/* Left: Status & Graph Info */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`w-2 h-2 rounded-full ${hasActiveAttackPath ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
          <span className="text-white font-bold tracking-wider">
            {hasActiveAttackPath ? 'ATTACK PATH ACTIVE' : 'TOPOLOGY MAP'}
          </span>
          <span className="text-[#3b4054]">·</span>
          <span className="text-[#787f96]">{nodes.length} nodes · {edges.length} edges</span>
        </div>

        {/* Right: Canvas Zoom & Physics Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center bg-[#12141c] border border-[#1e2230] p-0.5">
            <button
              onClick={() => { sound.playClick(); handleZoomIn(); }}
              title="Zoom In"
              className="p-1 text-[#7c839b] hover:text-white hover:bg-[#181a26] transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => { sound.playClick(); handleZoomOut(); }}
              title="Zoom Out"
              className="p-1 text-[#7c839b] hover:text-white hover:bg-[#181a26] transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={() => { sound.playClick(); handleResetZoom(); }}
              title="Center View"
              className="p-1 text-[#7c839b] hover:text-white hover:bg-[#181a26] transition-colors cursor-pointer"
            >
              <Crosshair className="w-3 h-3" />
            </button>
            <div className="w-[1px] h-3 bg-[#242838] my-auto mx-0.5" />
            <button
              onClick={() => { sound.playClick(); togglePhysics(); }}
              title={isPhysicsPaused ? "Resume Simulation" : "Pause Simulation"}
              className="p-1 text-[#7c839b] hover:text-white hover:bg-[#181a26] transition-colors cursor-pointer"
            >
              {isPhysicsPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Graph */}
      <svg ref={svgRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Legend at bottom left */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2.5 px-3 py-1.5 bg-[#0e1017]/90 border border-[#1a1d28] backdrop-blur-sm text-[10px] font-mono text-[#8a91a8]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[1px] bg-[#38bdf8]" />
          <span>Internet</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[1px] bg-[#a78bfa]" />
          <span>Gateway</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[1px] bg-[#818cf8]" />
          <span>Service</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[1px] bg-[#fbbf24]" />
          <span>Package/CVE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-[1px] bg-[#f43f5e]" />
          <span>DataStore (PII)</span>
        </div>
      </div>

      {/* Active Attack Path Indicator (Bottom Right) */}
      {hasActiveAttackPath && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-[#17090d]/90 border border-red-500/40 text-[10px] font-mono text-red-300">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>LIVE INGRESS BEAM // FALKORDB TRACE</span>
        </div>
      )}

      {/* Rich Interactive Hover Tooltip */}
      {hoveredNode && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none p-3 bg-[#0d0f16] border border-[#222738] shadow-2xl text-xs w-64 backdrop-blur-md"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1a1c26] mb-2">
            <span
              className="font-mono text-[10px] font-bold uppercase tracking-wider"
              style={{ color: NODE_THEMES[hoveredNode.type].color }}
            >
              {hoveredNode.type}
            </span>
            {hoveredNode.isCrownJewel && (
              <span className="px-1.5 py-0.2 bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-mono font-bold">
                CROWN JEWEL (PII)
              </span>
            )}
          </div>
          <div className="font-semibold text-white text-[13px] mb-1">{hoveredNode.label}</div>
          <div className="text-[#8890a6] text-[11px] mb-2">{hoveredNode.sublabel}</div>

          <div className="space-y-1 font-mono text-[10px] text-[#9ca3ba] bg-[#07080c] p-2 border border-[#161822]">
            {hoveredNode.owner && (
              <div className="flex justify-between">
                <span className="text-[#656b82]">Owner:</span>
                <span className="text-white">{hoveredNode.owner}</span>
              </div>
            )}
            {hoveredNode.environment && (
              <div className="flex justify-between">
                <span className="text-[#656b82]">Env:</span>
                <span className="text-amber-300">{hoveredNode.environment}</span>
              </div>
            )}
            {hoveredNode.dataClassification && (
              <div className="flex justify-between">
                <span className="text-[#656b82]">Data Class:</span>
                <span className="text-red-400 font-bold">{hoveredNode.dataClassification}</span>
              </div>
            )}
            {hoveredNode.recordsCount && (
              <div className="flex justify-between">
                <span className="text-[#656b82]">Records:</span>
                <span className="text-amber-400 font-bold">{hoveredNode.recordsCount}</span>
              </div>
            )}
          </div>

          <div className="mt-2 text-[10px] text-[#7c83ff] font-mono flex items-center justify-between">
            <span>Click node to inspect in drawer</span>
            <span>↵</span>
          </div>
        </div>
      )}
    </div>
  );
};
