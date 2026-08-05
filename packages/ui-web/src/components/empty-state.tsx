import * as React from 'react';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-[#EAE3C3]/60 my-4">
      {icon && <div className="p-4 bg-[#FFF3C4] text-[#C62828] rounded-full mb-3">{icon}</div>}
      <h4 className="text-lg font-bold text-[#2B2B2B] mb-1">{title}</h4>
      <p className="text-sm text-[#414643] max-w-xs mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
