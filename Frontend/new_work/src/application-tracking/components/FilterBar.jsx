import React from 'react';

import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterBar = ({ filters, onFilterChange, onSearch }) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending-documents', label: 'Pending Documents' },
    { value: 'interview-scheduled', label: 'Interview Scheduled' }
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency Levels' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const sortOptions = [
    { value: 'deadline-asc', label: 'Deadline (Earliest First)' },
    { value: 'deadline-desc', label: 'Deadline (Latest First)' },
    { value: 'submission-desc', label: 'Recently Submitted' },
    { value: 'submission-asc', label: 'Oldest First' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search by destination or ID..."
          value={filters?.search}
          onChange={(e) => onSearch(e?.target?.value)}
          className="w-full"
        />

        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
          placeholder="Filter by status"
        />

        <Select
          options={urgencyOptions}
          value={filters?.urgency}
          onChange={(value) => onFilterChange('urgency', value)}
          placeholder="Filter by urgency"
        />

        <Select
          options={sortOptions}
          value={filters?.sort}
          onChange={(value) => onFilterChange('sort', value)}
          placeholder="Sort by"
        />
      </div>
    </div>
  );
};

export default FilterBar;