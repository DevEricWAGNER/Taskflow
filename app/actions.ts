"use server";

import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function checkAddUser(email: string, name: string) {
    if (!email) return;
    try 
    {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        if (!existingUser && name) {
            await prisma.user.create({
                data: {
                    email: email,
                    name: name
                }
            });
        } else {
            console.error("Utilisateur déjà présent dans la base de données.");
        }
    } 
    catch (error) 
    {
        console.error("Erreur lors de la vérification de l'utilisateur : ", error);
    }
}

function generateUniqueCode():string {
    return randomBytes(6).toString('hex');
}

export async function createProject(name: string, description: string, email: string) {
    try 
    {
        const inviteCode = generateUniqueCode();
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }
        const newProject = await prisma.project.create({
            data: {
                name: name,
                description: description,
                inviteCode: inviteCode,
                createdById: user.id
            }
        })

        return newProject;
    }
    catch (error) 
    {
        console.error("Erreur lors de la création du projet : ", error);
        throw new Error("Erreur lors de la création du projet.");
    }
}

export async function getProjectsCreatedByUser(email: string) {
    try 
    {
        const projects = await prisma.project.findMany({
            where: {
                createdBy: {
                    email: email
                }
            },
            include: {
                tasks: {
                    include: {
                        user: true,
                        createdBy: true
                    }
                },
                users: {
                    select: {
                        user : {
                            select: {
                                id: true,
                                email: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        const formattedProjects = projects.map((project) => ({
            ...project,
            users: project.users.map((useEntry) => useEntry.user)
        }))

        return formattedProjects;

    }
    catch (error) 
    {
        console.error("Erreur lors de la récupération des projets : ", error);
        throw new Error("Erreur lors de la récupération des projets.");
    }
}

export async function deleteProjectById(projectId: string) {
    try {
        await prisma.project.delete({
            where: {
                id: projectId
            }
        })
        console.log(`Projet avec l'ID ${projectId} supprimé avec succès.`);
    } catch (error) {
        console.error(error)
        throw new Error
    }
}