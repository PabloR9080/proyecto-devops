import {NextApiRequest, NextApiResponse} from 'next'
import User from '../../../models/user'
import {API} from '../../../utils/const'

export default function handler(req: NextApiRequest, res: NextApiResponse<User>) {
    const { searchParams } = new URL(req.url || '', API)
    const name = searchParams.get('name') || 'Test'
    const response = {
        id: 1,
        name: name,
        email: 'exaple@example.com',
        password: '1234',
        lastLoginDate: '2021-01-01',
        createdDate: '2021-01-01'
    }
    res.status(200).json(response)
}