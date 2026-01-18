import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsCard = ({ icon, label, value, trend, trendValue, color }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon name={icon} size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={12} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm md:text-base text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default StatisticsCard;