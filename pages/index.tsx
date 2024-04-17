import Image from "next/image";
import { getSession, signOut } from "next-auth/react";
import { NextPageContext } from "next";
import useCurrentUser from "@/hooks/useCurrentUser";
import Navbar from "@/components/Navbar";
import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import useMovieList from "@/hooks/useMovieList";
import useFavorites from "@/hooks/useFavorites";
import useInfoModal from "@/hooks/useInfoModal";
import InfoModal from "@/components/InfoModal";

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);
    console.log(session);

    if (!session) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default function Home() {
    const { data: user } = useCurrentUser();
    const { data: movies = [] } = useMovieList();
    const { data: favorites = [] } = useFavorites();
    const { isOpen, closeModal } = useInfoModal();

    return (
        <>
            <InfoModal visible={isOpen} onClose={closeModal} />
            <Navbar />
            <Billboard />
            <div>
                <MovieList title="Trending Now" data={movies} />
                <MovieList title="My List" data={favorites} />
            </div>
        </>
    );
}
