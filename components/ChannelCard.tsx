import React from 'react';
import { Channel } from '../types';
import { Edit } from 'lucide-react';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  isDashboard?: boolean;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onClick, onEdit, isDashboard }) => {
  // Use fallbacks for safety
  const scale = channel.logoConfig?.scale ?? 1;
  const x = channel.logoConfig?.x ?? 0;
  const y = channel.logoConfig?.y ?? 0;

  return (
    <div 
      onClick={onClick}
      className="relative rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl shadow-lg overflow-hidden aspect-[4/5] flex flex-col items-center justify-center p-3 group"
      style={{ backgroundColor: channel.color }}
    >
      {isDashboard && onEdit && (
        <button 
          onClick={onEdit}
          className="absolute top-3 left-3 bg-black/20 hover:bg-black/40 p-1.5 rounded-full z-10 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Edit className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Logo Container (White Circle) - Using Percentage to be always large */}
      <div className="w-[80%] aspect-square bg-white rounded-full flex items-center justify-center shadow-lg mb-3 shrink-0 relative overflow-hidden">
        {channel.logoUrl ? (
          <img 
            key={`${channel.logoUrl}-${channel.lastUpdated}`} // Force re-render on update
            src={channel.logoUrl} 
            alt={channel.title} 
            className="object-contain transition-transform"
            style={{
              width: '65%',
              height: '65%',
              transform: `scale(${scale}) translate(${x}px, ${y}px)`
            }}
          />
        ) : (
          <span className="text-gray-300 text-[10px] text-center px-1">No Logo</span>
        )}
      </div>

      {/* Title */}
      <div className="text-center w-full px-1">
        <h3 className="text-white text-sm font-bold leading-tight line-clamp-2">
          {channel.title}
        </h3>
      </div>
    </div>
  );
};