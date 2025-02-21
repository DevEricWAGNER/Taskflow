"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { cp } from 'fs';
import { FolderGit2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { checkAddUser } from '../actions';

const Navbar = () => {
    const {user} = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        {
            href: "/general-projects", label: "Collaborations"
        },
        {
            href: "/", label: "Mes projets"
        }
    ]

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress && user?.fullName) {
            checkAddUser(user?.primaryEmailAddress?.emailAddress, user?.fullName);
        }
    }, [user]);

    const renderLinks = (classNames : string) => {
        return navLinks.map(({href, label}) => {
            return <Link key={href} href={href} className={`${classNames} btn-sm ${ isActiveLink(href) ? 'btn-primary' : ''}`}>
                    {label}
                </Link>
        })
    }

    const isActiveLink = (href : string) => {
        return pathname.replace(/\/$/, "") === href.replace(/\/$/, "");
    }

    return (
        <div className='border-b border-base-300 px-5 md:px-[10%] py-4 relative'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                    <div className='bg-primary-content text-primary rounded-full p-2'>
                        <FolderGit2 className='w-6 h-6'/>
                    </div>
                    <span className='ml-3 font-bold text-3xl'>
                        Task <span className='text-primary'>Flow</span>
                    </span>
                </div>
                <button className='btn w-fit btn-sm sm:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                    <Menu className='w-4'/>
                </button>
                <div className='hidden sm:flex space-x-4 items-center'>
                    {renderLinks("btn")}
                    <UserButton />
                </div>

                {/* menu responsive */}
                <div className={`absolute top-0 w-full h-screen flex flex-col gap-2 p-4 transition-all duration-300 sm:hidden bg-white z-50 ${menuOpen ? 'left-0' : '-left-full'}`}>
                    <div className='flex justify-between'>
                        <UserButton />
                        <button className='btn w-fit btn-sm' onClick={() => setMenuOpen(!menuOpen)}>
                            <X className='w-4'/>
                        </button>
                    </div>
                    {renderLinks("btn")}
                </div>
            </div>
        </div>
    );
}

export default Navbar;