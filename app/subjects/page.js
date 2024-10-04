
import Main from "@/components/Main";
import SubjectsView from "@/components/SubjectsView";

export const metadata = {
  title: "Stutra ⋅ Subjects ",
  description: "Track your daily study hours toward your goal!",
};

export default function SubjectsPage() {


    
  return (
    <Main>
        <SubjectsView />
    </Main>
  );
}
