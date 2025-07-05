import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend: string
  description: string
  className?: string
}

export function StatsCard({ title, value, icon: Icon, trend, description, className }: StatsCardProps) {
  const isPositive = trend.startsWith("+")

  return (
    <Card
      className={cn("relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105", className)}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="relative">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {isPositive && <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full animate-pulse" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          <Badge
            variant={isPositive ? "default" : "secondary"}
            className={cn(
              "text-xs font-semibold",
              isPositive
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
            )}
          >
            {trend}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
