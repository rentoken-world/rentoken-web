import axios from '@/services/base-service';
import ConfigService from './config-service';
import { User } from 'commons/models/user';

const BACKEND_URL = `${ConfigService.BACKEND_URL}/users`;

export async function getUser(identifier: string): Promise<User> {
    const response = await axios.get(`${BACKEND_URL}/${identifier}`);
    return response.data;
}

export async function updateUser(id: string, user: User): Promise<User> {
    const response = await axios.patch(`${BACKEND_URL}/${id}`, user);
    return response.data;
}

export async function payUser(): Promise<User> {
    const response = await axios.post(`${BACKEND_URL}/pay`);
    return response.data;
}