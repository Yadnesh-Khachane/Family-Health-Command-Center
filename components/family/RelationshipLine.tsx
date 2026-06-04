"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

interface RelationshipLineProps {
  fromX: number
  fromY: number
  toX: number
  toY: number
  type: 
    | "parent-child" 
    | "sibling" 
    | "spouse" 
    | "guardian" 
    | "adopted" 
    | "emergency" 
    | "medical" 
    | "inherited" 
    | "deceased"
  layoutMode: "vertical" | "horizontal" | "radial"
  onClick?: () => void
  onHover?: (hovered: boolean) => void
  highlighted?: boolean
}

export function RelationshipLine({
  fromX,
  fromY,
  toX,
  toY,
  type,
  layoutMode,
  onClick,
  onHover,
  highlighted = false
}: RelationshipLineProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isPathHovered = isHovered || highlighted

  // Calculate coordinates paths
  const getPath = (fx: number, fy: number, tx: number, ty: number) => {
    if (layoutMode === "vertical") {
      const midY = (fy + ty) / 2
      return `M ${fx} ${fy} C ${fx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`
    } else if (layoutMode === "horizontal") {
      const midX = (fx + tx) / 2
      return `M ${fx} ${fy} C ${midX} ${fy}, ${midX} ${ty}, ${tx} ${ty}`
    } else {
      // Radial or direct
      return `M ${fx} ${fy} L ${tx} ${ty}`
    }
  };

  const mainPath = getPath(fromX, fromY, toX, toY)

  // Double lines for marriage / partners
  const spousePaths = () => {
    const shift = 1.2
    if (layoutMode === "vertical" || layoutMode === "radial") {
      return [
        getPath(fromX - shift, fromY, toX - shift, toY),
        getPath(fromX + shift, fromY, toX + shift, toY)
      ]
    } else {
      return [
        getPath(fromX, fromY - shift, toX, toY - shift),
        getPath(fromX, fromY + shift, toX, toY + shift)
      ]
    }
  }

  // Generate unique gradient IDs for inherited lines
  const gradientId = `gradient-${Math.round(fromX)}-${Math.round(fromY)}`

  // Style helper based on relationship type
  const getStrokeStyles = () => {
    const defaultColor = isPathHovered ? "var(--amber)" : "rgba(245, 166, 35, 0.45)"
    
    switch (type) {
      case "parent-child":
        return {
          stroke: isPathHovered ? "var(--amber)" : "rgba(245, 166, 35, 0.45)",
          strokeWidth: isPathHovered ? "3.5" : "2",
          strokeDasharray: "0"
        }
      case "sibling":
        return {
          stroke: isPathHovered ? "var(--success)" : "rgba(125, 155, 118, 0.5)",
          strokeWidth: isPathHovered ? "3" : "1.8",
          strokeDasharray: "0"
        }
      case "spouse":
        return {
          stroke: isPathHovered ? "var(--terracotta)" : "rgba(232, 93, 58, 0.5)",
          strokeWidth: isPathHovered ? "2.5" : "1.5",
          strokeDasharray: "0"
        }
      case "guardian":
        return {
          stroke: isPathHovered ? "var(--amber)" : "rgba(245, 166, 35, 0.3)",
          strokeWidth: "1.8",
          strokeDasharray: "5 5"
        }
      case "adopted":
        return {
          stroke: isPathHovered ? "var(--success)" : "rgba(125, 155, 118, 0.35)",
          strokeWidth: "2",
          strokeDasharray: "1 4",
          strokeLinecap: "round" as const
        }
      case "emergency":
        return {
          stroke: "var(--warning)",
          strokeWidth: isPathHovered ? "4" : "2.5",
          strokeDasharray: "0",
          filter: "drop-shadow(0 0 3px var(--warning))"
        }
      case "medical":
        return {
          stroke: "var(--terracotta)",
          strokeWidth: isPathHovered ? "3" : "2",
          strokeDasharray: "6 6"
        }
      case "inherited":
        return {
          stroke: `url(#${gradientId})`,
          strokeWidth: isPathHovered ? "3.5" : "2.2",
          strokeDasharray: "0"
        }
      case "deceased":
        return {
          stroke: "rgba(245, 240, 232, 0.15)",
          strokeWidth: "1.5",
          strokeDasharray: "0"
        }
      default:
        return {
          stroke: defaultColor,
          strokeWidth: "2",
          strokeDasharray: "0"
        }
    }
  }

  const strokeStyles = getStrokeStyles()

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover?.(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHover?.(false)
  }

  return (
    <>
      {/* defs for gradients */}
      {type === "inherited" && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--terracotta)" />
            <stop offset="100%" stopColor="var(--amber)" />
          </linearGradient>
        </defs>
      )}

      {/* Actual Drawn Paths */}
      {type === "spouse" ? (
        spousePaths().map((p, i) => (
          <motion.path
            key={i}
            d={p}
            fill="none"
            stroke={strokeStyles.stroke}
            strokeWidth={strokeStyles.strokeWidth}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))
      ) : type === "medical" ? (
        <motion.path
          d={mainPath}
          fill="none"
          stroke={strokeStyles.stroke}
          strokeWidth={strokeStyles.strokeWidth}
          strokeDasharray={strokeStyles.strokeDasharray}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            strokeDashoffset: [0, -36]
          }}
          transition={{
            pathLength: { duration: 1 },
            opacity: { duration: 1 },
            strokeDashoffset: { repeat: Infinity, ease: "linear", duration: 1.5 }
          }}
        />
      ) : (
        <motion.path
          d={mainPath}
          fill="none"
          {...strokeStyles}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}

      {/* Invisible thicker hitbox path for easy hover/clicking */}
      <path
        d={mainPath}
        fill="none"
        stroke="transparent"
        strokeWidth="12"
        className="cursor-pointer"
        style={{ pointerEvents: "auto" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      />
    </>
  )
}
export default RelationshipLine
