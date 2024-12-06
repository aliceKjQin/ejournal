import React from "react";

import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import SelectedJournal from "@/app/dashboard/SelectedJournal";
import { useAuth } from "@/contexts/AuthContext";
import { useJournal } from "@/app/dashboard/useJournal";
import "@testing-library/jest-dom"; // Add this import to make toBeInTheDocument available

// Mock the hooks from AuthContext and useJournal
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/app/dashboard/useJournal", () => ({
  useJournal: jest.fn(),
}));

// Mock font
jest.mock("next/font/google", () => ({
  Roboto: jest.fn().mockReturnValue({}),
}));

describe("SelectedJournal Component", () => {
  // Define the mock data that will be returned by getEntry
  const mockJournalData = {
    morning: {
      gratitude: ["Gratitude 1", "Gratitude 2", "Gratitude 3"],
      goals: ["Goal 1", "Goal 2", "Goal 3"],
      affirmations: ["Affirmation 1", "Affirmation 2", "Affirmation 3"],
    },
    evening: {
      amazingThings: ["Amazing Thing 1", "Amazing Thing 2", "Amazing Thing 3"],
      improvements: ["Improvement 1", "Improvement 2", "Improvement 3"],
    },
  };
  const mockGetEntry = jest.fn().mockResolvedValueOnce(mockJournalData);
  const mockSaveEntry = jest.fn();
  const mockUserEntriesObj = { someKey: "someValue" };
  const mockSelectedDate = "2024-12-06";

  beforeEach(() => {
    // Reset mocks before each test
    mockGetEntry.mockReset();
    mockSaveEntry.mockReset();
    useAuth.mockReturnValue({
      userEntriesObj: mockUserEntriesObj,
    });
    useJournal.mockReturnValue({
      getEntry: mockGetEntry,
      saveEntry: mockSaveEntry,
    });
  });

  test("should render without crashing", () => {
    act(() => {
      render(<SelectedJournal selectedDate={mockSelectedDate} />);
    });

    // Check if the component renders the selected date
    expect(screen.queryByText("Selected Date |")).toBeInTheDocument();

    expect(screen.getByText(mockSelectedDate)).toBeInTheDocument();
  });

  test("should call getEntry on mount and set journal data", async () => {
    const mockJournalData = {
      morning: { gratitude: ["", "", ""] },
      evening: { amazingThings: ["", "", ""] },
    };

    mockGetEntry.mockResolvedValueOnce(mockJournalData); // Simulate successful response

    act(() => {
      render(<SelectedJournal selectedDate={mockSelectedDate} />);
    });

    // Wait for the component to fetch and display journal data
    await waitFor(() => expect(mockGetEntry).toHaveBeenCalledTimes(1));

    // Check if the journal data is rendered
    expect(screen.queryByText("Selected Date |")).toBeInTheDocument();
  });

  test("should handle error when getEntry fails", async () => {
    mockGetEntry.mockRejectedValueOnce(new Error("Failed to fetch entry"));

    act(() => {
      render(<SelectedJournal selectedDate={mockSelectedDate} />);
    });

    // Wait for the component to attempt fetching journal data
    await waitFor(() => expect(mockGetEntry).toHaveBeenCalledTimes(1));

    // Optionally, you could test the state of the UI when there is an error
    expect(screen.queryByText("Selected Date |")).toBeInTheDocument();
  });

  test("should call saveEntry when saving journal data", async () => {
    const mockJournalData = {
      morning: { gratitude: ["", "", ""] },
      evening: { amazingThings: ["", "", ""] },
    };

    mockGetEntry.mockResolvedValueOnce(mockJournalData); // Simulate successful response

    act(() => {
      render(<SelectedJournal selectedDate={mockSelectedDate} />);
    });

    // simulate saving an entry and test that saveEntry gets called
    const saveButtons = screen.getAllByText("Save"); // Get all 'Save' buttons
    fireEvent.click(saveButtons[0]); // Click the first "Save" button

    await waitFor(() => expect(mockSaveEntry).toHaveBeenCalledTimes(1));
  });

  test("should render JournalEntry with correct data", async () => {
    const mockSelectedDate = "2024-12-06";
    const mockSaveEntry = jest.fn();
    const mockData = {
      morning: {
        gratitude: ["", "", ""],
        goals: ["", "", ""],
        affirmations: ["", "", ""],
      },
      evening: { amazingThings: ["", "", ""], improvements: ["", "", ""] },
    };
  
    // Mock the getEntry to return mockData
    const mockGetEntry = jest.fn().mockResolvedValueOnce(mockData);
    useJournal.mockReturnValue({ getEntry: mockGetEntry, saveEntry: mockSaveEntry });
  
    act(() => {
      render(<SelectedJournal selectedDate={mockSelectedDate} />);
    });
  
    // Wait for the journal entry to be rendered (morning entry in this case)
    await waitFor(() => screen.getByText("morning entry"));
  
    // Ensure the "Save" button is rendered
    const saveButtons = screen.getAllByText("Save");
  
    // Simulate editing the first textarea (gratitude)
    const textareas = await screen.findAllByRole("textbox");
    fireEvent.change(textareas[0], { target: { value: "Test gratitude" } });
  
    // Click the "Save" button after making changes
    fireEvent.click(saveButtons[0]);
  
    // Use `waitFor` to ensure saveEntry is called after async state updates
    await waitFor(() => expect(mockSaveEntry).toHaveBeenCalledTimes(1));  // Ensure it was called once
  
    // Validate that saveEntry was called with the correct arguments
  await waitFor(() =>
    expect(mockSaveEntry).toHaveBeenCalledWith(
      mockSelectedDate, // date
      "morning",        // entryType
      {
        gratitude: ["Test gratitude", "", ""],
        goals: ["", "", ""],
        affirmations: ["", "", ""],
      } // data
    )
  );
  });
});
