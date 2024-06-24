'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '../../../routes';

export const Social = () => {
    const onClick = (provider: "google") => {
    signIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT //redirecionar para finalizar seu cadastro, para inserir CPF
    })
    
    }
    return ( 
    <div className="flex items-center w-full gap-x-2">
        <Button
        size={"lg"}
        className='w-full'
        variant={"outline"}
        onClick={() => onClick("google")}
        >
            <FcGoogle />
            
        </Button>
    </div> 
    );
}
 
