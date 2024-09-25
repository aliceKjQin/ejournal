import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Main from "@/components/Main";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Broodl ⋅ Dashboard ",
  description: "Track your daily mood everyday of the year!",
};

export default function DashboardPage() {
  return (
    <Main>
      <Dashboard />
    </Main>
  );
}
