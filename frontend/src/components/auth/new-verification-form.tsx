'use client';

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { newVerificationToken } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const onSubmit = useCallback(() => {
        if (success || error) {
            return;
        }

        if (!token) {
            setError('Token inválido');
            return;
        }

        newVerificationToken(token)
        .then((data) => {
            setSuccess(data.success);
            setError(data.error);
        })
        .catch(() => {
            setError('Erro ao confirmar e-mail');
        })
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return ( 
        <div>
            <CardWrapper
            headerLabel="Confirmando seu e-mail"
            backButtonHref="auth/login"
            backButtonLabel="Voltar para o login"
            >
               <div className="flex items-center w-full justify-center">
                    {!success && !error && (
                        <BeatLoader color="#000" />
                    )}
                    <FormSuccess message={success} />
                    {!success && ( 
                    <FormError message={error} />
                    )}
               </div>
            </CardWrapper>
        </div>
     );
}
