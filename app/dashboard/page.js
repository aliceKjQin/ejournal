import Dashboard from "@/components/Dashboard";
import Main from "@/components/Main";


export const metadata = {
  title: "Stutra ⋅ Dashboard ",
  description: "Track your daily study hours toward your goal!",
};

export default function DashboardPage() {
  return (
    <Main>
      <Dashboard />
    </Main>
  );
}
