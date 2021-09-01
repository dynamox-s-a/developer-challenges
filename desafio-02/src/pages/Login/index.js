import React, { useState } from 'react';
import { PageArea } from './styled';
import useApi from '../../helpers/loginAPI';
import {doLogin} from '../../helpers/AuthHandler';

import { PageContainer, PageTitle, ErrorMessage } from '../../components/MainComponents';

const Page = () => {
    const api = useApi();

    const [email, setEmail] = useState('');
    const [password, setPasswprd] = useState('');
    const [rememberPassword, setRememberPassword] = useState(false);
    const [desable, setDesable] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDesable(true);
        setError('');

        const json = await api.login(email, password);

        if (json.error) {
            setError(json.error);
        }else {
            doLogin(json.token, rememberPassword);
            window.location.href = '/';
        }
        setDesable(false);
    }

    return (
        <PageContainer>
            <PageTitle>Login</PageTitle>
            <PageArea>
                {error &&
                    <ErrorMessage>{error}</ErrorMessage>
                }

                <form onSubmit={handleSubmit}>
                    <label className="area">
                        <div className="area--title">E-mail</div>
                        <div className="area--input">
                            <input
                                type="email" 
                                desable={desable}
                                placeholder="gui1805@teste.com"
                                value={email}
                                onChange={e=>setEmail(e.target.value)}
                                required
                            />
                            
                        </div>
                    </label>
                    <label className="area">
                        <div className="area--title">Senha</div>
                        <div className="area--input">
                            <input
                                type="password"
                                desable={desable}
                                placeholder="teste"
                                value={password}
                                onChange={e=>setPasswprd(e.target.value)}
                                required
                            />
                        </div>
                    </label>
                    <div className="area">
                        <label className="area2">
                            <div className="area--title"><p>Lembrar Senha</p></div>
                            <div className="area--input">
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    desable={desable}
                                    checked={rememberPassword}
                                    onChange={()=>setRememberPassword(!rememberPassword)}
                                />
                            </div>
                        </label>
                    </div>
                    <div className="area">
                        <label className="area--title"></label>
                        <div className="area--input">
                            <button desable={desable}>Fazer Login</button>
                        </div>
                    </div>
                </form>
            </PageArea>
        </PageContainer>
    );
}

export default Page;