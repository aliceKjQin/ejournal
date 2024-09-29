import Dashboard from "@/components/Dashboard";
import Main from "@/components/Main";


export const metadata = {
  title: "bYou ⋅ Dashboard ",
  description: "Track your daily mood everyday of the year!",
};

export default function DashboardPage() {
  return (
    <Main>
      <Dashboard />
    </Main>
  );
}
