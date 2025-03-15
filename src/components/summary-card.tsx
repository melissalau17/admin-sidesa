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
         <CardHeader className="pb-2">
         <CardTitle className="text-lg font-bold">{title}</CardTitle>
         <p className="text-sm text-muted-foreground">{subtitle}</p>
         </CardHeader>
         <CardContent>{children}</CardContent>
      </Card>
   )
}

