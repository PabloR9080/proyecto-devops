import { NextApiRequest, NextApiResponse } from 'next'
type Data = {
    message: string,
}


export const config = {
    runtime: 'edge',
}

export default function handler(req:NextApiRequest, res:NextApiResponse<Data>){
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name') || 'Pablo'
    return new Response(
        JSON.stringify({ message: `Hello ${name}` })
        ,{
            status:200
        })
}
