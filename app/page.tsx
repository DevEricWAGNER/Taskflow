"use client";

import { useState } from "react";
import Wrapper from "./components/Wrapper";
import { FolderGit2, X } from "lucide-react";
import { createProject } from "./actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
      toast.success(`Projet ${project.name} créé avec succès !`);
    }
    catch (error)
    {
      console.error("Erreur lors de la création du projet : ", error);
      throw new Error("Erreur lors de la création du projet.");
    }
  };


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
            <input type="text" placeholder="Nom du projet" className="border border-base-300 input input-bordered w-full mb-4 placeholder:text-sm" value={name} onChange={(e)=>setName(e.target.value)} required/>
            <textarea placeholder="Description" className="mb-2 textarea textarea-bordered border border-base-300 w-full resize-none textarea-md placeholder:text-sm" value={description} onChange={(e)=>setDescription(e.target.value)} required></textarea>
            <button className="btn btn-primary" onClick={handleSubmit}>Nouveau projet <FolderGit2/></button>
          </div>
        </dialog>
      </div>
    </Wrapper>
  );
}
