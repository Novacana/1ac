
import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    getFillColor?: (value: number) => string
  }
>(({ className, value = 0, max = 100, getFillColor, ...props }, ref) => {
  const percentage = value != null ? Math.min(Math.max(value, 0), max) / max * 100 : 0
  
  let fillColor = "bg-primary"
  
  if (getFillColor) {
    fillColor = getFillColor(percentage)
  } else if (percentage <= 25) {
    fillColor = "bg-red-500"
  } else if (percentage <= 50) {
    fillColor = "bg-yellow-500"
  } else if (percentage <= 75) {
    fillColor = "bg-blue-500"
  } else {
    fillColor = "bg-green-500"
  }

  return (
    <div
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all", fillColor)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
