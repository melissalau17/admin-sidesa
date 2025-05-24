import { ReactNode } from "react"

interface FeatureItemProps {
   icon: ReactNode
   title: string
   description: string
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
   return (
      <div className="flex gap-4">
         <div className="flex-shrink-0 w-12 h-12 bg-[#004D40]/10 rounded-lg flex items-center justify-center">
         {icon}
         </div>
         <div>
         <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
         <p className="text-gray-600">{description}</p>
         </div>
      </div>
   )
}