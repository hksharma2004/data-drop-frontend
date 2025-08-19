"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Breadcrumb {
    id: string;
    name: string;
}

interface BreadcrumbsProps {
    path: Breadcrumb[];
}

const Breadcrumbs = ({ path }: BreadcrumbsProps) => {
    if (path.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 lg:gap-2 text-sm lg:text-base text-gray-600 overflow-x-auto pb-2">
                <li className="flex-shrink-0">
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-1 hover:text-[#FF7A3D] transition-colors duration-200 font-medium"
                    >
                        <Home size={16} className="flex-shrink-0" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                </li>
                {path.map((item, index) => {
                    const isLast = index === path.length - 1;
                    return (
                        <li key={item.id} className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                            {isLast ? (
                                <span className="font-semibold text-black truncate max-w-[120px] lg:max-w-[200px]">
                                    {item.name}
                                </span>
                            ) : (
                                <Link 
                                    href={`/dashboard?folderId=${item.id}`} 
                                    className="hover:text-[#FF7A3D] transition-colors duration-200 truncate max-w-[100px] lg:max-w-[150px]"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;