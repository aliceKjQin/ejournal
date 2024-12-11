import { render, screen, fireEvent } from "@testing-library/react";
import Calendar from "@/app/dashboard/Calendar";
import "@testing-library/jest-dom";

const mockOnDateSelect = jest.fn();

describe("Calendar", () => {
  const defaultProps = {
    onDateSelect: mockOnDateSelect,
    selectedDate: "2024-12-11",
    completeEntries: {
      "2024-12-10": { morning: { affirmations: [], goals: [], gratitude: [] } },
      "2024-12-11": { evening: { amazingThings: [], improvements: [] } },
      "2024-12-20": {
        morning: { affirmations: [], goals: [], gratitude: [] },
        evening: { amazingThings: [], improvements: [] },
      },
    },
  };

  test("renders the total journal days", () => {
    render(<Calendar {...defaultProps} />);
    expect(screen.getByText("Total journal days: 3")).toBeInTheDocument();
  });

  test("displays message when there are no journal entries", () => {
    render(
      <Calendar
        {...defaultProps}
        completeEntries={{}} // Overwrite completeEntries in defaultProps to no entries
      />
    );
    expect(
      screen.getByText(
        "You don't have any journal entries yet. Why not start one today and capture your thoughts?"
      )
    ).toBeInTheDocument();
  });

  test("highlights the selected date", () => {
    render(<Calendar {...defaultProps} />);

    const selectedDay = screen.getByText("11").closest("div");
    expect(selectedDay).toHaveClass("border-yellow-400");
  });

  test("marks today with dashed border", () => {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    render(
      <Calendar
        {...defaultProps}
        selectedDate="2024-12-1" // Since default selectedDate is today, need to pass a selectedDate that's different then today to differentiate the border style, as selectedDate will have a solid border
        completeEntries={{
          [formattedToday]: {
            evening: {
              amazingThings: [],
              improvements: [],
            },
          },
        }}
      />
    );

    const todayElement = screen
      .getByText(today.getDate().toString())
      .closest("div");
    expect(todayElement).toHaveClass("border-dashed");
  });

  test("calls onDateSelect when a date is clicked", () => {
    // Simulate get year and month from today in Calendar, so no matter when the test is run, it will reflect the corresponding year and month
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-10`;

    const defaultProps = {
      onDateSelect: mockOnDateSelect,
      selectedDate: formattedDate,
      completeEntries: {
        [formattedDate]: {
          evening: {
            amazingThings: ["example journal", "test journal"],
            improvements: [],
          },
        },
      },
    };

    render(<Calendar {...defaultProps} />);

    // Click on the 10th
    const day10 = screen.getByText("10").closest("div"); // the dayIndex is nested inside <p>, so need .closest("div") traverses up to find the nearest <div> ancestor, which is the <div> representing the day cell in the calendar grid. Why? the div has the classes and styles applied to the entire day cell, where properties like border-yellow-400 (highlighting for the selected day) are applied.
    fireEvent.click(day10);

    expect(mockOnDateSelect).toHaveBeenCalledWith(formattedDate);
  });

  test("displays pen icon on days that have entries", () => {
    render(<Calendar {...defaultProps} />);

    // The 10th and 11th should have icons
    const day10 = screen.getByText("10").closest("div");
    const day11 = screen.getByText("11").closest("div");

    expect(day10.querySelector(".fa-pen-to-square")).toBeInTheDocument();
    expect(day11.querySelector(".fa-pen-to-square")).toBeInTheDocument();

    // A day without entries should not have an icon
    const day12 = screen.getByText("12").closest("div");
    expect(day12.querySelector(".fa-pen-to-square")).not.toBeInTheDocument();
  });
});
