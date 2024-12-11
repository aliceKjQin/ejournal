import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
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

describe("SelectedJournal Component", () => {
  const mockGetEntry = jest.fn();
  const mockSaveEntry = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      userEntriesObj: {
        "2024-12-10": {
          morning: { affirmations: [], goals: [], gratitude: [] },
        },
        "2024-12-11": {
          evening: { amazingThings: [], improvements: [] },
        },
        "2024-12-20": {
          morning: { affirmations: [], goals: [], gratitude: [] },
          evening: { amazingThings: [], improvements: [] },
        },
      },
    });

    useJournal.mockReturnValue({
      getEntry: mockGetEntry,
      saveEntry: mockSaveEntry,
    });

    mockGetEntry.mockResolvedValue({
      evening: {
        amazingThings: ["It was a good day"],
        improvements: ["Sleep earlier"],
      },
    });
  });

  test("renders the selected date", async () => {
    render(<SelectedJournal selectedDate="2024-12-11" />);

    await waitFor(() => {
      expect(screen.getByText("2024-12-11")).toBeInTheDocument();
    });
  });

  test("fetches and displays journal data for the selected date", async () => {
    render(<SelectedJournal selectedDate="2024-12-11" />);

    await waitFor(() => {
      expect(mockGetEntry).toHaveBeenCalledWith("2024-12-11");
    });

    expect(screen.getByText("It was a good day")).toBeInTheDocument();
    expect(screen.getByText("Sleep earlier")).toBeInTheDocument();
  });

  test("displays default structure when no journal data exists for the selected date", async () => {
    mockGetEntry.mockResolvedValueOnce(null);

    render(<SelectedJournal selectedDate="2024-12-11" />);

    await waitFor(() => {
      expect(mockGetEntry).toHaveBeenCalledWith("2024-12-11");
    });

    expect(
      screen.getByText((content) => content.includes("I am grateful for ..."))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("What would make today great?")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("Daily affirmation. I am ...")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("Amazing things that happened today ...")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("How could I have made today better ...")
      )
    ).toBeInTheDocument();
  });

  test("calls saveEntry when journal data is updated", async () => {
    render(<SelectedJournal selectedDate="2024-12-11" />);

    // Expect calls getEntry with the selectedDate
    await waitFor(() => {
      expect(mockGetEntry).toHaveBeenCalledWith("2024-12-11");
    });

    // Expect journal data
    expect(screen.getByText("It was a good day")).toBeInTheDocument();
    // Expect to see Edit button since it has existing journal data
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

    // Get and click edit button to switch to edit mode
    const editButton = screen.getByRole("button", { name: "Edit" });
    fireEvent.click(editButton);

    // Query the textarea by its inner text content
    const textarea = screen.getByText("It was a good day").closest("textarea");
    // Simulate typing inside the textarea to update content
    fireEvent.change(textarea, {
      target: { value: "This is updated journal" },
    });
    // Get save button in evening entry
    const eveningEntryContainer = screen.getByLabelText("evening-entry");
    const saveButton = within(eveningEntryContainer).getByRole("button", {
      name: "Save",
    });
    fireEvent.click(saveButton);

    // Expect to call saveEntry
    await waitFor(() => {
      expect(mockSaveEntry).toHaveBeenCalled();
    });
    // Expect the updated journal data to render after save
    expect(screen.getByText("This is updated journal")).toBeInTheDocument();
  });
});
