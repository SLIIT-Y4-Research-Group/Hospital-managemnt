import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import EditItems from './components/UpdateCrop'; // Update the path to your EditItems component
import '@testing-library/jest-dom';

jest.mock('axios'); // Mock axios to simulate API calls

describe('EditItems Component', () => {
    const mockData = {
        CropName: '140',
        SoilType: 'Insulin',
        RainFall: 'Peanuts',
        Temperature: '25',
        SoilpHLevel: 'A+',
        CropArea: 'Heart Problems',
        ScientificName: '60',
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockData }); // Mock the GET request
    });

    test('renders the form and fetches crop data', async () => {
        render(
            <MemoryRouter>
                <EditItems />
            </MemoryRouter>
        );

        // Check if the form renders correctly
        expect(screen.getByText(/Height/i)).toBeInTheDocument();
        expect(screen.getByText(/Weight/i)).toBeInTheDocument();

        // Wait for the mock API data to populate the form fields
        await waitFor(() => {
            expect(screen.getByDisplayValue('140')).toBeInTheDocument();
            expect(screen.getByDisplayValue('60')).toBeInTheDocument();
        });
    });

    test('updates the form fields and submits the form', async () => {
        render(
            <MemoryRouter>
                <EditItems />
            </MemoryRouter>
        );

        // Wait for form fields to populate
        await waitFor(() => {
            expect(screen.getByDisplayValue('Wheat')).toBeInTheDocument();
        });

        // Simulate user input for updating CropName
        fireEvent.change(screen.getByLabelText(/Height/i), {
            target: { value: 'Corn' },
        });

        // Verify the change
        expect(screen.getByDisplayValue('Corn')).toBeInTheDocument();

        // Mock the PUT request to return a success message
        axios.put.mockResolvedValueOnce({ data: { success: true, message: 'Update successful' } });

        // Simulate form submission
        fireEvent.submit(screen.getByRole('button', { name: /save/i }));

        // Check if the PUT request was called with updated data
        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('http://localhost:5000/crop/update/undefined', expect.objectContaining({
                CropName: 'Corn',
            }));
        });
    });

    test('handles API errors during form submission', async () => {
        render(
            <MemoryRouter>
                <EditItems />
            </MemoryRouter>
        );

        // Wait for form fields to populate
        await waitFor(() => {
            expect(screen.getByDisplayValue('Wheat')).toBeInTheDocument();
        });

        // Mock the PUT request to return an error
        axios.put.mockRejectedValueOnce(new Error('Update failed'));

        // Simulate form submission
        fireEvent.submit(screen.getByRole('button', { name: /save/i }));

        // Check if error alert is shown
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Error updating item. Please try again.');
        });
    });
});
