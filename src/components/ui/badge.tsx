import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C0FE04] focus:ring-offset-2 focus:ring-offset-black",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#C0FE04] text-black shadow-lg hover:bg-[#9ACC03]",
        secondary:
          "border-white/20 bg-white/5 text-white hover:bg-white/10",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
        outline:
          "border-white/20 bg-transparent text-white hover:border-[#C0FE04] hover:text-[#C0FE04]",
        success:
          "border-transparent bg-green-500/20 text-green-500",
        warning:
          "border-transparent bg-yellow-500/20 text-yellow-500",
        lime:
          "border-[#C0FE04] bg-[#C0FE04]/10 text-[#C0FE04]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
