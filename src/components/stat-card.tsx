import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
   title: string
   value: string
   description: string
   className?: string
}

export function StatCard({ title, value, description, className }: StatCardProps) {
   return (
      <Card className={cn("", className)}>
         <CardHeader className="pb-2">
         <CardTitle className="text-sm font-medium">{title}</CardTitle>
         </CardHeader>
         <CardContent>
         <div className="text-3xl font-bold">{value}</div>
         <p className="text-xs text-muted-foreground mt-1">{description}</p>
         </CardContent>
      </Card>
   )
}

