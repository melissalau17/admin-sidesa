import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SummaryCardProps {
   title: string
   subtitle: string
   children: ReactNode
   className?: string
}

export function SummaryCard({ title, subtitle, children, className }: SummaryCardProps) {
   return (
      <Card className={cn("", className)}>
         <CardHeader className="pb-1 md:pb-2 p-3 md:p-4">
         <CardTitle className="text-base md:text-lg font-bold">{title}</CardTitle>
         <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
         </CardHeader>
         <CardContent>{children}</CardContent>
      </Card>
   )
}

