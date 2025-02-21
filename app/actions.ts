"use server";

import prisma from "@/lib/prisma";

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