'use client';

import React, { useState } from 'react';
import { BottomSheet, Button } from '@hotspots/ui-web';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserName: string;
  onConfirmReport: (reason: string, details?: string) => void;
  onConfirmBlock: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetUserName,
  onConfirmReport,
  onConfirmBlock,
}) => {
  const [reason, setReason] = useState('Inappropriate content');
  const [details, setDetails] = useState('');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`Safety & Moderation`}>
      <div className="space-y-4 text-left py-2">
        <div className="bg-red-50 text-red-800 p-3 rounded-xl flex items-start gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>
            Report or block <strong>{targetUserName}</strong> if they violate community safety standards.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Reason for Report</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium"
          >
            <option value="Inappropriate content">Inappropriate profile content</option>
            <option value="Harassment or spam">Harassment or message spam</option>
            <option value="Fake account">Fake account or impersonation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Details (Optional)</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white h-20"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="destructive"
            size="md"
            fullWidth
            onClick={() => {
              onConfirmReport(reason, details);
              onClose();
            }}
          >
            <AlertTriangle className="w-4 h-4 mr-1.5" /> Submit Report
          </Button>

          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => {
              onConfirmBlock();
              onClose();
            }}
          >
            Block {targetUserName}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
