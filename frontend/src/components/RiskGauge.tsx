import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  anomalyRate: number;
}

export function RiskGauge({ anomalyRate }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const w = 200, h = 120;
    const r = 80;
    const cx = w / 2, cy = h - 10;

    const bg = d3.arc()({
      innerRadius: r - 16,
      outerRadius: r,
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2,
    });

    const clampedRate = Math.min(anomalyRate, 100);
    const endAngle = -Math.PI / 2 + (Math.PI * clampedRate) / 100;
    const color = clampedRate < 2 ? "#6ee7b7" : clampedRate < 5 ? "#f9a8d4" : "#f87171";

    const fill = d3.arc()({
      innerRadius: r - 16,
      outerRadius: r,
      startAngle: -Math.PI / 2,
      endAngle,
    });

    const g = svg.append("g").attr("transform", `translate(${cx},${cy})`);
    g.append("path").attr("d", bg!).attr("fill", "#1a0a1a");
    g.append("path").attr("d", fill!).attr("fill", color)
      .style("filter", `drop-shadow(0 0 6px ${color})`);

    g.append("text").attr("text-anchor", "middle").attr("dy", -12)
      .style("font-size", "1.6rem").style("font-weight", "900").style("fill", color)
      .text(`${clampedRate.toFixed(1)}%`);

    g.append("text").attr("text-anchor", "middle").attr("dy", 8)
      .style("font-size", "0.65rem").style("fill", "#64748b")
      .style("text-transform", "uppercase").style("letter-spacing", "0.1em")
      .text("Anomaly Rate");
  }, [anomalyRate]);

  return (
    <div style={{ background: "#0f060f", border: "1px solid #4a134066",
      borderRadius: 12, padding: 16, display: "flex",
      flexDirection: "column", alignItems: "center" }}>
      <svg ref={ref} width={200} height={120} />
    </div>
  );
}
