import { 
  Smile, 
  Sparkles, 
  Activity, 
  Brain, 
  Scale, 
  Home, 
  Heart, 
  Users, 
  Target, 
  Coins, 
  Hand, 
  Palette,
  LucideIcon 
} from 'lucide-react'

interface AreaIconProps {
  iconName: string
  size?: number
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  Smile,
  Sparkles,
  Activity,
  Brain,
  Scale,
  Home,
  Heart,
  Users,
  Target,
  Coins,
  Hand,
  Palette,
}

export default function AreaIcon({ iconName, size = 48, className = '' }: AreaIconProps) {
  const Icon = iconMap[iconName] || Smile
  
  return (
    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-gold/20 to-brand-bronze/20 rounded-2xl border-2 border-brand-gold/40 ${className}`}>
      <Icon size={size} className="text-brand-bronze" strokeWidth={1.5} />
    </div>
  )
}
