import {
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "@/app/dashboard/page";
import { useAuth } from "@/contexts/AuthContext";
import Calendar from "@/app/dashboard/Calendar";
import SelectedJournal from "@/app/dashboard/SelectedJournal";

// Mock dependencies
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));
jest.mock("@/app/dashboard/Calendar", () =>
  jest.fn(() => <div aria-label="calendar"></div>)
);
jest.mock("@/app/dashboard/SelectedJournal", () =>
  jest.fn(() => <div aria-label="selected-journal"></div>)
);

const mockUseAuth = useAuth;

describe("DashboardPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state when loadingAuth is true", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      userEntriesObj: null,
      loading: true,
    });

    render(<DashboardPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("renders Calendar and SelectedJournal with correct props", async () => {
    const userEntriesObjMock = {
      "2024-12-10": { journal: "example journal" },
    };
    const userMock = { uid: "mockUserId" };

    mockUseAuth.mockReturnValue({
      user: userMock,
      userEntriesObj: userEntriesObjMock,
      loading: false,
    });

    render(<DashboardPage />);

    // Expect Calendar and SelectedJournal to render
    expect(screen.getByLabelText("calendar")).toBeInTheDocument();
    expect(screen.getByLabelText("selected-journal")).toBeInTheDocument();

    // Expect Calendar received props: completeEntries, selectedDate, onDateSelect
    expect(Calendar).toHaveBeenCalledWith(
      expect.objectContaining({
        completeEntries: userEntriesObjMock,
        selectedDate: expect.any(String),
        onDateSelect: expect.any(Function),
      }),
      {}
    );

    // Expect SelectedJournal receive prop selectedDate
    expect(SelectedJournal).toHaveBeenCalledWith(
      expect.objectContaining({ selectedDate: expect.any(String) }),
      {}
    );
  });

  test("sets the default selectedDate to today", async () => {
    // The default selectedDate is from the current date when component mounts

    mockUseAuth.mockReturnValue({
      user: { uid: "mockUserId" },
      userEntriesObj: {},
      loading: false,
    });

    render(<DashboardPage />);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const expectedDate = `${year}-${month}-${day}`;

    await waitFor(() => {
      expect(Calendar).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedDate: expectedDate,
        }),
        {}
      );
    });
  });

  test("updates selectedDate state in DashboardPage when a date is selected from Calendar, then triggers a re-render on Calendar and SelectedJournal with the new selectedDate", () => {
    const userEntriesObjMock = {
      "2024-12-10": { morning: {}, evening: {} },
    };
    const userMock = { uid: "mockUserId" };

    mockUseAuth.mockReturnValue({
      user: userMock,
      userEntriesObj: userEntriesObjMock,
      loading: false,
    });

    render(<DashboardPage />);

    // Get all props passed to Calendar during first render
    const calendarProps = Calendar.mock.calls[0][0];
    // Simulate a user selecting a new date in Calendar by invoking onDateSelect
    const newDate = "2024-12-12";
    act(() => {
      calendarProps.onDateSelect(newDate);
    });

    // Expect when selectedDate state updates in DashboardPage, it will trigger Calendar and SelectedJournal a re-render with the updated selectedDate
    expect(Calendar).toHaveBeenCalledWith(
      expect.objectContaining({ selectedDate: newDate }),
      {}
    );
    expect(SelectedJournal).toHaveBeenCalledWith(
      expect.objectContaining({ selectedDate: newDate }),
      {}
    );
  });
});
