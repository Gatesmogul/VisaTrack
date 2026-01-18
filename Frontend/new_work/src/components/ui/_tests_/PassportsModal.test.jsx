import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import PassportsModal from '../PassportsModal';

describe('PassportsModal', () => {
  test('adds a passport and saves with primary flag', async () => {
    const onSave = vi.fn();
    render(<PassportsModal isOpen={true} passports={[]} onClose={() => {}} onSave={onSave} />);

    // fill inputs
    await userEvent.type(screen.getByLabelText(/Country/i), 'Nigeria');
    await userEvent.type(screen.getByLabelText(/Passport Number/i), 'A12345');
    await userEvent.type(screen.getByLabelText(/Expiry date/i), '2030-12-31');

    // add
    await userEvent.click(screen.getByRole('button', { name: /Add passport/i }));

    // newly added item should show
    expect(screen.getByText(/Nigeria/i)).toBeInTheDocument();

    // set primary
    await userEvent.click(screen.getByRole('button', { name: /Set primary/i }));

    // save all
    await userEvent.click(screen.getByRole('button', { name: /Save passports/i }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const saved = onSave.mock.calls[0][0];
    expect(saved.length).toBe(1);
    expect(saved[0].country).toBe('Nigeria');
    expect(saved[0].primary).toBeTruthy();
  });

  test('deletes passport after confirmation', async () => {
    const onSave = vi.fn();
    const initial = [{ id: 'p1', country: 'A', number: '1', expiry: '2030-01-01' }, { id: 'p2', country: 'B', number: '2', expiry: '2031-01-01' }];
    render(<PassportsModal isOpen={true} passports={initial} onClose={() => {}} onSave={onSave} />);

    // delete first passport via aria-label
    const trashButtons = screen.getAllByLabelText(/Delete passport/i);
    await userEvent.click(trashButtons[0]);

    // Confirm modal should show
    expect(screen.getByText(/Delete passport/i)).toBeInTheDocument();

    // check the "I understand" checkbox and confirm
    const checkbox = screen.getByRole('checkbox', { name: /I understand/i });
    await userEvent.click(checkbox);
    await userEvent.click(screen.getByRole('button', { name: /Delete/i }));

    // item removed
    expect(screen.queryByText('A')).not.toBeInTheDocument();
  });
});
