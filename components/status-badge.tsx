import { cn } from "@/lib/utils"

type StatusType = "success" | "pending" | "error" | "warning"

interface StatusBadgeProps {
  status: StatusType
  text: string
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "success" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        status === "pending" && "bg-wialon-blue/10 text-wialon-blue dark:bg-wialon-blue/20 dark:text-wialon-lightBlue",
        status === "error" && "bg-wialon-red/10 text-wialon-red dark:bg-wialon-red/20 dark:text-wialon-lightRed",
        status === "warning" && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      )}
    >
      {text}
    </span>
  )
}
