import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Table from './Table';

globalThis.fetch = vi.fn();

describe('Table Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (globalThis.fetch as any).mockResolvedValue({
            json: async () => null,
        });
    });

    it('should render 25 squares in a 5x5 grid', () => {
        const { container } = render(<Table />);
        const squares = container.querySelectorAll('[class*="square"]');
        expect(squares).toHaveLength(25);
    });

    it('should fetch latest robot data on component mount', async () => {
        render(<Table />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/robot/latest'
            );
        });
    });

    it('should create a new robot when clicking on a square', async () => {
        const mockNewRobot = { id: 1, x: 2, y: 3, direction: 'north' };
        (globalThis.fetch as any)
            .mockResolvedValueOnce({ json: async () => null })
            .mockResolvedValueOnce({ json: async () => mockNewRobot });

        const { container } = render(<Table />);
        const firstSquare = container.querySelector('[class*="square"]');

        fireEvent.click(firstSquare!);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/robot/create',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ x: 0, y: 4, direction: 'north' }),
                })
            );
        });
    });

    it('should sync robot state when turn left button is clicked', async () => {
        const mockRobot = { id: 1, x: 2, y: 2, direction: 'north' };
        (globalThis.fetch as any).mockResolvedValue({
            json: async () => mockRobot,
        });

        render(<Table />);
        await waitFor(() => screen.getByText('Left'));

        const leftButton = screen.getByText('Left');
        fireEvent.click(leftButton);

        await waitFor(() => {
            const syncCalls = (globalThis.fetch as any).mock.calls.filter(
                (call: any) => call[0].includes('/robot/sync/')
            );
            expect(syncCalls.length).toBeGreaterThan(0);
        });
    });

    it('should show alert with robot position when Report button is clicked', async () => {
        const mockRobot = { id: 1, x: 2, y: 3, direction: 'east' };
        (globalThis.fetch as any).mockResolvedValue({
            json: async () => mockRobot,
        });

        const alertMock = vi
            .spyOn(window, 'alert')
            .mockImplementation(() => {});

        render(<Table />);
        await waitFor(() => screen.getByText('Report'));

        const reportButton = screen.getByText('Report');
        fireEvent.click(reportButton);

        expect(alertMock).toHaveBeenCalledWith(
            expect.stringContaining('Position: (2, 3)')
        );

        alertMock.mockRestore();
    });

	// added timeouts here cuz this test was sometimes failing due to a race condition
    it('should handle arrow key navigation when robot exists', async () => {
        const mockRobot = { id: 1, x: 2, y: 2, direction: 'north' };
        (globalThis.fetch as any)
            .mockResolvedValueOnce({ json: async () => mockRobot }) 
            .mockResolvedValueOnce({ json: async () => ({}) });

        render(<Table />);

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                'http://localhost:3000/robot/latest'
            );
        });

        await new Promise((resolve) => setTimeout(resolve, 50));

        vi.clearAllMocks();
        (globalThis.fetch as any).mockResolvedValueOnce({ json: async () => ({}) });

        fireEvent.keyDown(document, { key: 'ArrowUp' });

        await waitFor(
            () => {
                expect(globalThis.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('/robot/sync/'),
                    expect.any(Object)
                );
            },
            { timeout: 1000 }
        );
    });
});

/*
  SOME OTHER IMPORTANT TESTS TO IMPLEMENT:
 
  - should turn right when Right button is clicked
  - should move forward when Move button is clicked
  - should not move robot outside grid boundaries (test all 4 edges)
  - should fetch and display robot history when History button clicked
  - should handle history fetch errors gracefully
  - should not respond to keyboard controls when no robot exists
  - should turn to correct direction when pressing arrow key in different direction
  - should handle API errors during robot creation
  - should handle API errors during sync operations
  - should initialize robot state correctly when latest robot has different directions (NORTH, SOUTH, EAST, WEST)
  - should pass correct props to Robot component (positionX, positionY, directionIndex)
 
  EDGE CASES:
  - should handle null or undefined robot data from API
 */