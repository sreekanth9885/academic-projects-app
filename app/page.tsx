import Image from "next/image";
import AdminLogin from "./admin/page";
import ProjectsTable from "./admin/projects/page";

export default function Home() {
  return (
    <main>
      <h1 className="text-4xl text-center bg-emerald-700 text-amber-300">User App</h1>
      {/* <ProjectsTable/> */}
      <h1 className="text-3xl text-center bg-amber-300">Projects for users will come here</h1>
    </main>
  );
}
