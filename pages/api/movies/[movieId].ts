import { NextApiRequest, NextApiResponse } from "next";

import primasdb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET")
    {
        return res.status(405).end();
    }

    try
    {
        await serverAuth(req);
        const { movieId } = req.query;

        if (typeof movieId !== "string")
        {
            throw new Error("Invalid movieId");
        }

        if (!movieId)
        {
            throw new Error("Invalid movieId");
        }

        const movie = await primasdb.movie.findUnique({
            where: {
                id: movieId
            }
        });

        if (!movie)
        {
            return res.status(404).end();
        }

        return res.status(200).json(movie);
    }
    catch (error)
    {
        return res.status(500).json(error);
    }
};