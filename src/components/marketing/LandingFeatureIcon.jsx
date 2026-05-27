import {
  Clock, Zap, Sparkles, Share2, Camera, Handshake, Bell, Shield, Users,
  Globe, Award, LayoutGrid,
} from 'lucide-react';

const ICON_MAP = {
  'clock-zap': ({ className, color }) => (
    <span className={`relative inline-flex ${className}`}>
      <Clock className="w-7 h-7" style={{ color }} />
      <Zap className="w-3.5 h-3.5 absolute -top-0.5 -right-1" style={{ color }} fill="currentColor" />
    </span>
  ),
  sparkles: ({ className, color }) => <Sparkles className={className} style={{ color }} />,
  share: ({ className, color }) => <Share2 className={className} style={{ color }} />,
  camera: ({ className, color }) => <Camera className={className} style={{ color }} />,
  handshake: ({ className, color }) => <Handshake className={className} style={{ color }} />,
  bell: ({ className, color }) => <Bell className={className} style={{ color }} />,
  shield: ({ className, color }) => <Shield className={className} style={{ color }} />,
  users: ({ className, color }) => <Users className={className} style={{ color }} />,
  'gaa-ball': ({ className }) => <span className={`text-3xl ${className}`}>🏐</span>,
  shamrock: ({ className }) => <span className={`text-3xl ${className}`}>☘️</span>,
  'soccer-ball': ({ className }) => <span className={`text-3xl ${className}`}>⚽</span>,
  tactics: ({ className, color }) => <LayoutGrid className={className} style={{ color }} />,
  'rugby-ball': ({ className }) => <span className={`text-3xl ${className}`}>🏉</span>,
  scrum: ({ className }) => <span className={`text-3xl ${className}`}>🏉</span>,
  globe: ({ className, color }) => <Globe className={className} style={{ color }} />,
  badge: ({ className, color }) => <Award className={className} style={{ color }} />,
};

export function FeatureIcon({ name, color, className = 'w-7 h-7' }) {
  const Icon = ICON_MAP[name] || ICON_MAP.sparkles;
  return <Icon className={className} color={color} />;
}
