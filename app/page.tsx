"use client";

import { useEffect, useState } from "react";
import Wrapper from "./components/Wrapper";
import { FolderGit2, X } from "lucide-react";
import { createProject, deleteProjectById, getProjectsCreatedByUser } from "./actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Project } from "@/type";
import ProjectComponent from "./components/ProjectComponent";
import EmptyState from "./components/EmptyState";

export default function Home() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([])

  const fetchProjects = async (email: string) => {
    try {
      const myproject = await getProjectsCreatedByUser(email)
      setProjects(myproject)
      console.log(myproject)
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  }

  useEffect(() => {
    if (email) {
      fetchProjects(email)
    }
  }, [email])

  const deleteProject = async (projectId: string) => {
    try {
      await deleteProjectById(projectId)
      fetchProjects(email)
      toast.success('Project supprimé !')
    } catch (error) {
      throw new Error('Error deleting project: ' + error);
    }
  }

  const handleSubmit = async () => {
    try
    {
      const modal = document.getElementById('new_project_modal') as HTMLDialogElement;
      const project = await createProject(name, description, email);
      if (modal) {
        modal.close();
      }
      setName("");
      setDescription("");
      fetchProjects(email);
      toast.success(`Projet ${project.name} créé avec succès !`);
    }
    catch (error)
    {
      toast.error('Erreur lors de la création du projet : ' + error);
    }
  }

  return (
    <Wrapper>
      <div>
        <button className="btn btn-primary mb-6" onClick={()=>(document.getElementById('new_project_modal') as HTMLDialogElement).showModal()}>Nouveau projet <FolderGit2/></button>
        <dialog id="new_project_modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><X/></button>
            </form>
            <h3 className="font-bold text-lg">Nouveau Projet</h3>
            <p className="py-4">Décrivez votre projet simplement grâce à la description</p>
            <div>
            <input type="text" placeholder="Nom du projet" className="border border-base-300 input input-bordered w-full mb-4 placeholder:text-sm" value={name} onChange={(e)=>setName(e.target.value)} required/>
            <textarea placeholder="Description" className="mb-2 textarea textarea-bordered border border-base-300 w-full resize-none textarea-md placeholder:text-sm" value={description} onChange={(e)=>setDescription(e.target.value)} required></textarea>
            <button className="btn btn-primary" onClick={handleSubmit}>Nouveau projet <FolderGit2/></button>
            </div>
          </div>
        </dialog>

        <div className="w-full">

          {projects.length > 0 ? (
            <ul className="w-full grid md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectComponent project={project} admin={1} style={true} onDelete={deleteProject}></ProjectComponent>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <EmptyState
                 imageSrc='/empty-project.png'
                 imageAlt="Picture of an empty project"
                 message="Vous n'avez pas encore de projet. Créez-en un dès maintenant !"
              />
            </div>
          )}

        </div>

      </div>
    </Wrapper>
  );
}
