import Calendar from '@/components/Calendar'
import Main from '@/components/Main'

export const metadata = {
  title: "Journal | Dashboard",
  description: "Journal to capture your daily thoughts📓!",
};

export default function DashboardPage() {
  return (
    <Main>
        <Calendar />
    </Main>
  )
}
