import React from 'react';
import { Channel } from '../types';
import { ChannelCard } from './ChannelCard';

interface FeaturesProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

export const Features: React.FC<FeaturesProps> = ({ channels, onSelectChannel }) => {
  return (
    <section id="channels" className="py-20 bg-black/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">قنوات المحتوى</h2>
          <div className="w-24 h-1 bg-labPrimary mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            استكشف قنواتنا المتنوعة والمحتوى التفاعلي المميز المصمم بأحدث تقنيات الذكاء الاصطناعي.
          </p>
        </div>

        {/* Channels Grid - Force 5 columns from MD screens upwards with smaller gap */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {channels.length > 0 ? (
            channels.map((channel) => (
              <div key={`${channel.id}-${channel.lastUpdated}`} className="transform hover:-translate-y-2 transition-transform duration-300">
                <ChannelCard 
                  channel={channel} 
                  onClick={() => onSelectChannel(channel)}
                  isDashboard={false}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">لا توجد قنوات متاحة حالياً.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};