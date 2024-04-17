import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET")
    {
        return res.status(405).end();
    }

    try
    {
        const { currentUser } = await serverAuth(req);
        const movies = await prismadb.movie.findMany({
            where: {
                id: {
                    in: currentUser?.favoriteIds
                }
            }
        });
        return res.json(movies);
    }
    catch (error)
    {
        console.error(error);
        return res.status(500).end();
    }
}