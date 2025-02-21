import NewTaskForm from "@/app/components/NewTaskForm";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "New Task",
};

// Correctly type the page function with Next.js dynamic routing
export default function NewTaskPage({
  params,
}: {
  params: { projectId: string };
}): JSX.Element {
  return <NewTaskForm projectId={params.projectId} />;
}
