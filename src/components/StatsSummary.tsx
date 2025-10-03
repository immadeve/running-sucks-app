import React from 'react';
import { Icon } from './Icon';

interface StatItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface StatsSummaryProps {
  title?: string;
  stats: StatItem[];
  onViewDetails?: () => void;
  showViewDetailsButton?: boolean;
  className?: string;
  primaryColor?: string;
}

/**
 * A reusable component for displaying statistics in a summary format
 *
 * @example
 * // Basic usage with default title and view details button
 * <StatsSummary
 *   stats={[
 *     { label: 'Distance', value: '5.2 km', icon: '🏃' },
 *     { label: 'Duration', value: '25:30', icon: '⏱️' },
 *   ]}
 *   onViewDetails={() => alert('View details clicked')}
 * />
 *
 * @example
 * // Custom title without view details button
 * <StatsSummary
 *   title="🏆 Personal Records"
 *   stats={[
 *     { label: 'Best 5K', value: '18:45' },
 *     { label: 'Best 10K', value: '38:12' },
 *   ]}
 *   showViewDetailsButton={false}
 * />
 */
export const StatsSummary: React.FC<StatsSummaryProps> = ({
  title = '📄 File Processed Successfully',
  stats,
  onViewDetails,
  showViewDetailsButton = true,
  className = 'file-stats-summary',
  primaryColor,
}) => {
  return (
    <div className={className}>
      <h3>{title}</h3>
      <div className="stats-summary">
        {stats.map((stat, index) => (
          <div key={index} className="summary-item">
            <span className="summary-label">
              {stat.icon && <>{stat.icon} </>}
              {stat.label}:
            </span>
            <span className="summary-value">{stat.value}</span>
          </div>
        ))}
      </div>
      {showViewDetailsButton && onViewDetails && (
        <button className="view-details-btn" onClick={onViewDetails}>
          <Icon emoji="📊" filterColor={primaryColor} /> View Details
        </button>
      )}
    </div>
  );
};
