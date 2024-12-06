import React, { act } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useAuth } from "@/contexts/AuthContext";
import "@testing-library/jest-dom"; // For matchers like toBeInTheDocument

// Mock dependencies
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/app/dashboard/Calendar", () => {
    return ({ onDateSelect, selectedDate, completeEntries }) => {
      const handleDateSelect = (dayIndex) => {
        const dateStr = `2024-12-${dayIndex}`;
        onDateSelect(dateStr);
      };
  
      return (
        <div>
          <p>Mock Calendar</p>
          {/* Render a clickable calendar grid */}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            return (
              <div
                key={day}
                role="gridcell"
                aria-label={`2024-12-${day}`}
                onClick={() => handleDateSelect(day)}
                style={{ cursor: "pointer", margin: "5px", display: "inline-block" }}
              >
                {day}
              </div>
            );
          })}
          <p>Selected Date: {selectedDate}</p>
          {Object.keys(completeEntries).length > 0 && <p>Entries Loaded</p>}
        </div>
      );
    };
  });
  

jest.mock("@/app/dashboard/SelectedJournal", () => {
  return ({ selectedDate }) => (
    <div>
      <p>Mock SelectedJournal</p>
      <p>Journal Date: {selectedDate}</p>
    </div>
  );
});

jest.mock("@/components/Loading", () => () => <p>Loading...</p>);
jest.mock("@/components/Main", () => ({ children }) => <div>{children}</div>);

describe("DashboardPage Component", () => {
  const mockUser = { id: "123", name: "Test User" };
  const mockUserEntriesObj = {
    "2024-12-6": { morning: {}, evening: {} },
    "2024-12-7": { morning: {}, evening: {} },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should render the Loading component while authentication is loading", () => {
    // Mock loading state
    useAuth.mockReturnValue({
      user: null,
      userEntriesObj: null,
      loading: true,
    });

    act(() => {
      render(<DashboardPage />);
    });

    // Assert loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should render Calendar and SelectedJournal once authenticated", async () => {
    // Mock authenticated state
    useAuth.mockReturnValue({
      user: mockUser,
      userEntriesObj: mockUserEntriesObj,
      loading: false,
    });

    act(() => {
      render(<DashboardPage />);
    });

    // Wait for Calendar and SelectedJournal to appear
    await waitFor(() => {
      expect(screen.getByText("Mock Calendar")).toBeInTheDocument();
      expect(screen.getByText("Mock SelectedJournal")).toBeInTheDocument();
    });

    // Ensure correct props are passed to mocked components
    expect(screen.getByText("Selected Date: 2024-12-6")).toBeInTheDocument(); // Default date
    expect(screen.getByText("Entries Loaded")).toBeInTheDocument(); // Mock completeEntries passed to Calendar
    expect(screen.getByText("Journal Date: 2024-12-6")).toBeInTheDocument(); // Mock SelectedJournal receives date
  });

  test("should update selected date when a new date is clicked in Calendar", async () => {
    // Mock the user data and loading state from useAuth
    useAuth.mockReturnValue({
      user: {}, // mock user data
      userEntriesObj: {}, // mock user entries
      loading: false, // mock loading state
    });

    // Render the DashboardPage component with the mocked context
    render(<DashboardPage />);

    console.log(screen.debug());


  // Wait for the calendar grid cell to be available by checking for a day with the correct aria-label
  await waitFor(() => screen.getByRole("gridcell", { name: "2024-12-7" }));

  // Simulate clicking the date (e.g., the 7th)
  const dateCell = screen.getByRole("gridcell", { name: "2024-12-7" });
  fireEvent.click(dateCell);

    // Check if the selected date is updated to the expected date format
    expect(screen.getByText("Selected Date: 2024-12-7")).toBeInTheDocument(); // Adjust based on the expected format
  });
});
