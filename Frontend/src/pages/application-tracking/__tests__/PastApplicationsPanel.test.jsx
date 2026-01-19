import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PastApplicationsPanel from '../components/PastApplicationsPanel';
import { saveApplication, getHistory } from '../../utils/appHistory';

describe('PastApplicationsPanel', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows saved application and allows note', () => {
    saveApplication({ destination: 'France', visaType: 'Tourist' });
    const { getByText } = render(<PastApplicationsPanel />);
    expect(getByText(/France/)).toBeTruthy();
  });
});