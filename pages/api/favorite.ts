import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";
import serverAuth2 from "@/lib/serverAuth2";
import prismadb from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try
    {
        const { currentUser } = await serverAuth2(req, res);
        const { movieId } = req.body;
        
        const existingMovie = await prismadb.movie.findUnique({
            where: { id: movieId }
        });

        if (!existingMovie) {
            return res.status(404).json({ error: "Movie not found." });
        }

        if (req.method === "POST")
        {
            const user = await prismadb.user.update({
                where: { id: currentUser.id },
                data: { favoriteIds: {
                    push: movieId
                }}
            });

            return res.status(200).json(user);
        }
        else if (req.method === "DELETE")
        {
            const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);
            const updatedUser = await prismadb.user.update({
                where: { id: currentUser.id },
                data: { favoriteIds: updatedFavoriteIds }
            });

            return res.status(200).json(updatedUser);
        }

        return res.status(405).end();
    }
    catch (error)
    {
        console.error(error);
        return res.status(401).json({ error: 'Not authorized.' });
    }
}