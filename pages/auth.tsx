
import { useCallback, useState } from "react";
import axios from "axios";
import Input from "@/components/Input";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Auth = () => {

    const [name, setName] = useState('');

    const [email, setEmail] = useState('');
    
    const [password, setPassword] = useState('');

    const [variant, setVariant] = useState('login');
    
    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login')
    }, []);

    const login = useCallback(async () => {
        try {
            const response = await signIn('credentials', {
                email,
                password,
                callbackUrl: '/profiles'
            });
            console.log(response);
        }
        catch (error) {
            console.error(error);
        }
    }, [email, password]);

    const register = useCallback(async () => {
        try {
            const response = await axios.post('/api/register', {
                email,
                name,
                password
            });

            if (response?.status === 200) {
                login();
            }
        }
        catch (error) {
            console.error(error);
        }
    }, [email, name, password, login]);

    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="logo" className="h-12" />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Sign In' : 'Sign Up'}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant === 'register' && (
                                <Input
                                    label="Name"
                                    onChange={(ev: any) => { setName(ev.target.value) }}
                                    value={name}
                                    id="name"
                                    type="text"
                                />
                            )}
                            <Input
                                label="Email"
                                onChange={(ev: any) => { setEmail(ev.target.value) }}
                                value={email}
                                id="email"
                                type="email"
                            />
                            <Input
                                label="Password"
                                onChange={(ev: any) => { setPassword(ev.target.value) }}
                                value={password}
                                id="password"
                                type="password"
                            />
                        </div>
                        <button onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                            {variant === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                        <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                            <div
                                onClick={() => signIn('google', { callbackUrl: '/profiles' })}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                <FcGoogle size={30} />
                            </div>
                            <div
                                onClick={() => signIn('github', { callbackUrl: '/profiles' })}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                <FaGithub size={30} />
                            </div>
                        </div>
                        <p className="text-neutral-500 mt-12">
                            {variant === 'login' ? 'New to Netflix?' : 'Already have an account?'}
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                {variant === 'login' ? 'Sign up now!' : 'Login now!'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;