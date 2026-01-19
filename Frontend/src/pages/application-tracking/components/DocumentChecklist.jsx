import React from 'react';

import { Checkbox } from '../../../components/ui/Checkbox';

const DocumentChecklist = ({ documents, onToggle }) => {
  const completedCount = documents?.filter(doc => doc?.completed)?.length;
  const totalCount = documents?.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">Document Checklist</h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {completedCount} of {totalCount} documents completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-muted flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="4"
                strokeDasharray={`${completionPercentage * 2.51} 251`}
                className="transition-smooth"
              />
            </svg>
            <span className="text-xs md:text-sm font-bold text-foreground">{completionPercentage}%</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {documents?.map((doc) => (
          <div
            key={doc?.id}
            className={`p-3 md:p-4 border rounded-lg transition-smooth ${
              doc?.completed ? 'bg-success/5 border-success/20' : 'bg-card border-border hover:bg-muted'
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={doc?.completed}
                onChange={(e) => onToggle(doc?.id, e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h4 className={`text-sm md:text-base font-medium ${doc?.completed ? 'text-success line-through' : 'text-foreground'}`}>
                    {doc?.name}
                  </h4>
                  {doc?.required && (
                    <span className="px-2 py-0.5 bg-error/10 text-error text-xs rounded-full font-medium whitespace-nowrap self-start">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-2">{doc?.description}</p>
                {doc?.specifications && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {doc?.specifications?.map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-muted-foreground rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentChecklist;