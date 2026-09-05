import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-100 text-zinc-950 shadow hover:bg-zinc-200",
        secondary:
          "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
        outline: "border-zinc-700 text-zinc-300 bg-zinc-950/60",
        authentic: "border-zinc-400/40 bg-zinc-100 text-zinc-950 font-bold shadow-sm",
        suspicious: "border-zinc-500/50 bg-zinc-800 text-zinc-200 font-bold",
        synthetic: "border-zinc-400/30 bg-zinc-900 text-zinc-300 font-bold underline decoration-zinc-500",
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
