'use client';

import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Stethoscope,
  ShoppingBag,
  Layers,
  Activity,
  Award,
} from 'lucide-react';
import type { RevenueTimelineItem } from '@/types/revenue';

interface RevenueWaveChartProps {
  timeline: RevenueTimelineItem[];
  className?: string;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatShortVND(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)} tr`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)} k`;
  }
  return `${num} đ`;
}

// Generate smooth cubic bezier spline SVG path
function generateSplinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const tension = 0.22;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

// Generate smooth closed area wave SVG path
function generateAreaWavePath(points: { x: number; y: number }[], bottomY: number): string {
  if (points.length === 0) return '';
  const spline = generateSplinePath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${spline} L ${last.x.toFixed(1)} ${bottomY.toFixed(1)} L ${first.x.toFixed(1)} ${bottomY.toFixed(1)} Z`;
}

export function RevenueWaveChart({ timeline, className = '' }: RevenueWaveChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showClinic, setShowClinic] = useState<boolean>(true);
  const [showShop, setShowShop] = useState<boolean>(true);
  const [showTotal, setShowTotal] = useState<boolean>(false);
  const [chartMode, setChartMode] = useState<'area' | 'line'>('area');
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Safe data conversion
  const normalizedData = useMemo(() => {
    return (timeline || []).map((item, idx) => ({
      index: idx,
      label: item.label || `Ngày ${idx + 1}`,
      clinicRevenue: Number(item.clinicRevenue || 0),
      shopRevenue: Number(item.shopRevenue || 0),
      totalRevenue: Number(item.totalRevenue || 0),
      orderCount: Number(item.orderCount || 0),
      appointmentCount: Number(item.appointmentCount || 0),
    }));
  }, [timeline]);

  // Chart dimensions & coordinates
  const SVG_WIDTH = 900;
  const SVG_HEIGHT = 360;
  const PADDING = { top: 35, right: 35, bottom: 45, left: 65 };
  const graphWidth = SVG_WIDTH - PADDING.left - PADDING.right;
  const graphHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;
  const bottomY = SVG_HEIGHT - PADDING.bottom;

  // Maximum value for dynamic scaling with comfortable headroom
  const maxValue = useMemo(() => {
    if (normalizedData.length === 0) return 1_000_000;
    const allValues: number[] = [];
    normalizedData.forEach((d) => {
      if (showClinic) allValues.push(d.clinicRevenue);
      if (showShop) allValues.push(d.shopRevenue);
      if (showTotal) allValues.push(d.totalRevenue);
      if (!showClinic && !showShop && !showTotal) allValues.push(d.totalRevenue);
    });
    const rawMax = Math.max(...allValues, 100_000);
    // Round to next nice number (e.g. 5M -> 6M, 4.5M -> 5M)
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const ceilStep = magnitude >= 1_000_000 ? 500_000 : magnitude >= 100_000 ? 100_000 : 50_000;
    return Math.ceil((rawMax * 1.15) / ceilStep) * ceilStep;
  }, [normalizedData, showClinic, showShop, showTotal]);

  // Grid ticks
  const yTicks = useMemo(() => {
    const count = 4;
    const ticks: { value: number; y: number }[] = [];
    for (let i = 0; i <= count; i++) {
      const val = (maxValue / count) * i;
      const y = bottomY - (val / maxValue) * graphHeight;
      ticks.push({ value: val, y });
    }
    return ticks;
  }, [maxValue, bottomY, graphHeight]);

  // Point coordinates calculation
  const { clinicPoints, shopPoints, totalPoints, xPositions } = useMemo(() => {
    const len = normalizedData.length;
    if (len === 0) {
      return { clinicPoints: [], shopPoints: [], totalPoints: [], xPositions: [] };
    }

    const xPositions = normalizedData.map((_, i) => {
      if (len === 1) return PADDING.left + graphWidth / 2;
      return PADDING.left + (i / (len - 1)) * graphWidth;
    });

    const clinicPoints = normalizedData.map((d, i) => ({
      x: xPositions[i],
      y: bottomY - (d.clinicRevenue / maxValue) * graphHeight,
      data: d,
    }));

    const shopPoints = normalizedData.map((d, i) => ({
      x: xPositions[i],
      y: bottomY - (d.shopRevenue / maxValue) * graphHeight,
      data: d,
    }));

    const totalPoints = normalizedData.map((d, i) => ({
      x: xPositions[i],
      y: bottomY - (d.totalRevenue / maxValue) * graphHeight,
      data: d,
    }));

    return { clinicPoints, shopPoints, totalPoints, xPositions };
  }, [normalizedData, maxValue, bottomY, graphHeight, graphWidth, PADDING.left]);

  // Spline & Area paths
  const clinicSpline = useMemo(() => generateSplinePath(clinicPoints), [clinicPoints]);
  const clinicArea = useMemo(() => generateAreaWavePath(clinicPoints, bottomY), [clinicPoints, bottomY]);

  const shopSpline = useMemo(() => generateSplinePath(shopPoints), [shopPoints]);
  const shopArea = useMemo(() => generateAreaWavePath(shopPoints, bottomY), [shopPoints, bottomY]);

  const totalSpline = useMemo(() => generateSplinePath(totalPoints), [totalPoints]);
  const totalArea = useMemo(() => generateAreaWavePath(totalPoints, bottomY), [totalPoints, bottomY]);

  // Insights (Peak Day & Daily Average)
  const peakDay = useMemo(() => {
    if (!normalizedData.length) return null;
    return [...normalizedData].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  }, [normalizedData]);

  const dailyAvg = useMemo(() => {
    if (!normalizedData.length) return 0;
    const sum = normalizedData.reduce((acc, curr) => acc + curr.totalRevenue, 0);
    return Math.round(sum / normalizedData.length);
  }, [normalizedData]);

  // Mouse interaction handler
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || normalizedData.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * SVG_WIDTH;

    let closestIdx = 0;
    let minDiff = Infinity;
    xPositions.forEach((x, idx) => {
      const diff = Math.abs(x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoveredIdx(closestIdx);
  };

  const currentHoveredItem = hoveredIdx !== null ? normalizedData[hoveredIdx] : null;

  if (normalizedData.length === 0) {
    return (
      <div className={`flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/30 ${className}`}>
        <Activity className="size-8 text-zinc-400" />
        <p className="mt-2 text-sm font-medium text-zinc-500">Chưa có dữ liệu biểu đồ cho kỳ này</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Chart Control Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Quick Highlights Pill */}
        <div className="flex flex-wrap items-center gap-2">
          {peakDay && (
            <div className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <Award className="size-3.5 text-amber-500" />
              <span>Đỉnh doanh thu: <strong>{peakDay.label}</strong> ({formatShortVND(peakDay.totalRevenue)})</span>
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 rounded-2xl bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <Activity className="size-3.5 text-zinc-400" />
            <span>Trung bình: <strong>{formatShortVND(dailyAvg)}/ngày</strong></span>
          </div>
        </div>

        {/* Legend & Series Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Clinic */}
          <button
            type="button"
            onClick={() => setShowClinic((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
              showClinic
                ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-zinc-100 text-zinc-400 border border-transparent dark:bg-zinc-800 dark:text-zinc-500'
            }`}
          >
            <span className={`size-2.5 rounded-full ${showClinic ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-zinc-400'}`} />
            <span>Khám bệnh & Spa</span>
          </button>

          {/* Toggle Shop */}
          <button
            type="button"
            onClick={() => setShowShop((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
              showShop
                ? 'bg-rose-500/15 text-rose-700 border border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300'
                : 'bg-zinc-100 text-zinc-400 border border-transparent dark:bg-zinc-800 dark:text-zinc-500'
            }`}
          >
            <span className={`size-2.5 rounded-full ${showShop ? 'bg-rose-500 shadow-sm shadow-rose-500/50' : 'bg-zinc-400'}`} />
            <span>Pet Shop</span>
          </button>

          {/* Toggle Total */}
          <button
            type="button"
            onClick={() => setShowTotal((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
              showTotal
                ? 'bg-indigo-500/15 text-indigo-700 border border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300'
                : 'bg-zinc-100 text-zinc-400 border border-transparent dark:bg-zinc-800 dark:text-zinc-500'
            }`}
          >
            <span className={`size-2.5 rounded-full ${showTotal ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-zinc-400'}`} />
            <span>Tổng cộng</span>
          </button>

          {/* Area vs Line Mode */}
          <div className="ml-1 flex rounded-xl border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setChartMode('area')}
              title="Dạng sóng vùng mượt"
              className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold transition ${
                chartMode === 'area' ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-white' : 'text-zinc-500'
              }`}
            >
              Sóng Vùng
            </button>
            <button
              type="button"
              onClick={() => setChartMode('line')}
              title="Dạng đường cong sóng"
              className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold transition ${
                chartMode === 'line' ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-700 dark:text-white' : 'text-zinc-500'
              }`}
            >
              Đường Sóng
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Wave Chart Container */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50/50 via-white to-white p-2 sm:p-4 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:from-zinc-900/60 dark:via-zinc-900/90 dark:to-zinc-900">
        <div className="relative w-full aspect-[21/9] min-h-[260px] max-h-[380px]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="size-full overflow-visible select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              {/* Clinic Emerald Wave Gradient */}
              <linearGradient id="clinicWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
              </linearGradient>

              {/* Shop Rose Wave Gradient */}
              <linearGradient id="shopWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#E11D48" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.00" />
              </linearGradient>

              {/* Total Indigo Wave Gradient */}
              <linearGradient id="totalWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.00" />
              </linearGradient>

              {/* Glow Filter for Curve Lines */}
              <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines and Y-Axis Labels */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={PADDING.left}
                  y1={tick.y}
                  x2={SVG_WIDTH - PADDING.right}
                  y2={tick.y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  strokeOpacity={i === 0 ? '0.25' : '0.08'}
                  className="text-zinc-500 dark:text-zinc-400"
                />
                <text
                  x={PADDING.left - 12}
                  y={tick.y + 4}
                  textAnchor="end"
                  className="text-[11px] font-medium fill-zinc-400 dark:fill-zinc-500"
                >
                  {formatShortVND(tick.value)}
                </text>
              </g>
            ))}

            {/* Area Waves Fills */}
            {chartMode === 'area' && (
              <>
                {/* Total Area Wave */}
                {showTotal && totalArea && (
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    d={totalArea}
                    fill="url(#totalWaveGrad)"
                  />
                )}

                {/* Clinic Area Wave */}
                {showClinic && clinicArea && (
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    d={clinicArea}
                    fill="url(#clinicWaveGrad)"
                  />
                )}

                {/* Shop Area Wave */}
                {showShop && shopArea && (
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    d={shopArea}
                    fill="url(#shopWaveGrad)"
                  />
                )}
              </>
            )}

            {/* Smooth Spline Wave Strokes */}
            {/* Total Spline Line */}
            {showTotal && totalSpline && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                d={totalSpline}
                fill="none"
                stroke="#6366F1"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowFilter)"
              />
            )}

            {/* Clinic Spline Line */}
            {showClinic && clinicSpline && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.05 }}
                d={clinicSpline}
                fill="none"
                stroke="#10B981"
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowFilter)"
              />
            )}

            {/* Shop Spline Line */}
            {showShop && shopSpline && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
                d={shopSpline}
                fill="none"
                stroke="#F43F5E"
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowFilter)"
              />
            )}

            {/* X-Axis Date Nodes & Labels */}
            {normalizedData.map((d, i) => {
              const x = xPositions[i];
              const isHovered = hoveredIdx === i;

              return (
                <g key={i}>
                  {/* Subtle column guide on hover */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={PADDING.top}
                      x2={x}
                      y2={bottomY}
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      className="text-zinc-400 dark:text-zinc-500"
                    />
                  )}

                  {/* X Axis Date Label */}
                  <text
                    x={x}
                    y={bottomY + 24}
                    textAnchor="middle"
                    className={`text-[12px] transition-all font-medium ${
                      isHovered
                        ? 'fill-zinc-900 dark:fill-white font-bold text-[13px]'
                        : 'fill-zinc-500 dark:fill-zinc-400'
                    }`}
                  >
                    {d.label}
                  </text>

                  {/* Static Point Markers */}
                  {showClinic && (
                    <circle
                      cx={clinicPoints[i].x}
                      cy={clinicPoints[i].y}
                      r={isHovered ? 6 : 3.5}
                      className="fill-emerald-500 stroke-white dark:stroke-zinc-900 transition-all"
                      strokeWidth={2}
                    />
                  )}

                  {showShop && (
                    <circle
                      cx={shopPoints[i].x}
                      cy={shopPoints[i].y}
                      r={isHovered ? 6 : 3.5}
                      className="fill-rose-500 stroke-white dark:stroke-zinc-900 transition-all"
                      strokeWidth={2}
                    />
                  )}

                  {showTotal && (
                    <circle
                      cx={totalPoints[i].x}
                      cy={totalPoints[i].y}
                      r={isHovered ? 6 : 3.5}
                      className="fill-indigo-500 stroke-white dark:stroke-zinc-900 transition-all"
                      strokeWidth={2}
                    />
                  )}

                  {/* Ripple pulse on hovered points */}
                  {isHovered && (
                    <>
                      {showClinic && (
                        <circle
                          cx={clinicPoints[i].x}
                          cy={clinicPoints[i].y}
                          r={11}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth={2}
                          opacity={0.6}
                          className="animate-ping origin-center"
                        />
                      )}
                      {showShop && (
                        <circle
                          cx={shopPoints[i].x}
                          cy={shopPoints[i].y}
                          r={11}
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth={2}
                          opacity={0.6}
                          className="animate-ping origin-center"
                        />
                      )}
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Glassmorphism Tooltip */}
          <AnimatePresence>
            {currentHoveredItem && hoveredIdx !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                style={{
                  left: `${((xPositions[hoveredIdx] - 15) / SVG_WIDTH) * 100}%`,
                  top: '12px',
                  transform: 'translateX(-50%)',
                }}
                className="pointer-events-none absolute z-30 min-w-[240px] max-w-[280px] rounded-2xl border border-zinc-200/80 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/95"
              >
                {/* Tooltip Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                    <Calendar className="size-3.5 text-amber-500" />
                    <span>Ngày {currentHoveredItem.label}</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    {formatShortVND(currentHoveredItem.totalRevenue)}
                  </span>
                </div>

                {/* Breakdown Rows */}
                <div className="mt-2.5 space-y-2 text-xs">
                  {/* Clinic Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <span>Dịch vụ khám:</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {formatVND(currentHoveredItem.clinicRevenue)}
                      </span>
                      <span className="ml-1 text-[10px] text-zinc-400">({currentHoveredItem.appointmentCount} ca)</span>
                    </div>
                  </div>

                  {/* Shop Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                      <span className="size-2 rounded-full bg-rose-500" />
                      <span>Pet Shop:</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {formatVND(currentHoveredItem.shopRevenue)}
                      </span>
                      <span className="ml-1 text-[10px] text-zinc-400">({currentHoveredItem.orderCount} đơn)</span>
                    </div>
                  </div>

                  {/* Progress Ratio Bar */}
                  {currentHoveredItem.totalRevenue > 0 && (
                    <div className="pt-1">
                      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          style={{
                            width: `${(currentHoveredItem.clinicRevenue / currentHoveredItem.totalRevenue) * 100}%`,
                          }}
                          className="bg-emerald-500 transition-all"
                        />
                        <div
                          style={{
                            width: `${(currentHoveredItem.shopRevenue / currentHoveredItem.totalRevenue) * 100}%`,
                          }}
                          className="bg-rose-500 transition-all"
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
                        <span>Khám: {Math.round((currentHoveredItem.clinicRevenue / currentHoveredItem.totalRevenue) * 100)}%</span>
                        <span>Shop: {Math.round((currentHoveredItem.shopRevenue / currentHoveredItem.totalRevenue) * 100)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
