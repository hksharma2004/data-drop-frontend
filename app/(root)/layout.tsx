

import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'

import {Toaster} from '@/components/ui/sonner'

const Layout = async ({ children } : {children:React.ReactNode}) => {

  const currentUser = await getCurrentUser();

  if(!currentUser) return redirect("/sign-in")


  return  <main className='flex h-screen'>
    <Sidebar { ...currentUser } />

    <section className='flex h-full flex-1 flex-col'>

        <div className="md:hidden">
          <MobileNavigation { ...currentUser }/>
        </div>
        

        <div className="hidden md:block">
          <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        </div>
        
        <div className='main-content'>{children}</div>
    </section>

    <Toaster />
  </main>
 
  
}

export default Layout