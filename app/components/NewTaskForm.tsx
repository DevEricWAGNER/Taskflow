"use client";

import { createTask, getProjectInfo, getProjectUsers } from "@/app/actions";
import AssignTask from "@/app/components/AssignTask";
import Wrapper from "@/app/components/Wrapper";
import { Project } from "@/type";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";

interface NewTaskFormProps {
  projectId: string;
}

const NewTaskForm = ({ projectId }: NewTaskFormProps) => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";

  const [project, setProject] = useState<Project | null>(null);
  const [usersProject, setUsersProject] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const fetchInfos = async (projectId: string) => {
    try {
      const projectData = await getProjectInfo(projectId, true);
      setProject(projectData);

      const associatedUsers = await getProjectUsers(projectId);
      setUsersProject(associatedUsers);
    } catch (error) {
      toast.error("Erreur lors du chargement du projet: " + error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchInfos(projectId);
    }
  }, [projectId]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleSubmit = async () => {
    if (!name || !projectId || !selectedUser || !description || !dueDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createTask(
        name,
        description,
        dueDate,
        projectId,
        email,
        selectedUser.email
      );
      router.push(`/project/${projectId}`);
    } catch (error) {
      toast.error("Erreur lors de la création de la tâche: " + error);
    }
  };

  return (
    <Wrapper>
      <div>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href={`/project/${projectId}`}>Retour</Link>
            </li>
            <li>
              <div className="badge badge-primary">{project?.name}</div>
            </li>
          </ul>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="md:w-1/4">
            <AssignTask
              users={usersProject}
              projectId={projectId}
              onAssignTask={handleUserSelect}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="badge">À livrer</span>
              <input
                placeholder="Date d'échéance"
                className="input input-bordered border-base-300"
                type="date"
                onChange={(e) => setDueDate(new Date(e.target.value))}
              />
            </div>
          </div>

          <div className="md:w-3/4 mt-4 md:mt-0 md:ml-4">
            <div className="flex flex-col justify-between w-full">
              <input
                placeholder="Nom de la tâche"
                className="w-full input input-bordered border border-base-300 font-bold mb-4"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <ReactQuill
                placeholder="Décrivez la tâche"
                value={description}
                onChange={setDescription}
              />
            </div>
            <div className="flex justify-end" onClick={handleSubmit}>
              <button className="btn mt-4 btn-md btn-primary">Créer la tâche</button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NewTaskForm;