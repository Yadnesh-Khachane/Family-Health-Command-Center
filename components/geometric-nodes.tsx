"use client"

export function GeometricNodes() {
  return (
    <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] perspective-[1000px]">
      {/* Rotating container */}
      <div className="relative w-full h-full rotate-slow" style={{ transformStyle: "preserve-3d" }}>
        {/* Central node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-terracotta bg-terracotta/20" />
        
        {/* Orbiting nodes and connections */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const radius = 100
          const x = parseFloat((Math.cos((angle * Math.PI) / 180) * radius).toFixed(4))
          const y = parseFloat((Math.sin((angle * Math.PI) / 180) * radius).toFixed(4))
          
          return (
            <div key={i}>
              {/* Connection line to center */}
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                style={{ overflow: "visible" }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke="rgba(232, 93, 58, 0.3)"
                  strokeWidth="1"
                />
              </svg>
              
              {/* Outer node */}
              <div
                className="absolute w-3 h-3 rounded-full border border-amber/50 bg-amber/10"
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          )
        })}
        
        {/* Inner ring of nodes */}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => {
          const radius = 60
          const x = parseFloat((Math.cos((angle * Math.PI) / 180) * radius).toFixed(4))
          const y = parseFloat((Math.sin((angle * Math.PI) / 180) * radius).toFixed(4))
          
          return (
            <div key={`inner-${i}`}>
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                style={{ overflow: "visible" }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke="rgba(245, 166, 35, 0.2)"
                  strokeWidth="1"
                />
              </svg>
              
              <div
                className="absolute w-2 h-2 rounded-full border border-terracotta/40 bg-terracotta/10"
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          )
        })}
        
        {/* Outer decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-amber/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full border border-terracotta/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-amber/5" />
        
        {/* Cross connections between outer nodes */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
          style={{ overflow: "visible" }}
        >
          {[0, 60, 120].map((angle, i) => {
            const radius = 100
            const x1 = parseFloat((Math.cos((angle * Math.PI) / 180) * radius).toFixed(4))
            const y1 = parseFloat((Math.sin((angle * Math.PI) / 180) * radius).toFixed(4))
            const x2 = parseFloat((Math.cos(((angle + 120) * Math.PI) / 180) * radius).toFixed(4))
            const y2 = parseFloat((Math.sin(((angle + 120) * Math.PI) / 180) * radius).toFixed(4))
            
            return (
              <line
                key={`cross-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(232, 93, 58, 0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
