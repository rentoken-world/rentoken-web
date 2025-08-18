/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-17 21:37:14
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-17 23:13:43
 * @FilePath: /auto_dex/frontend/src/services/auth-service.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import axios from 'axios';
import ConfigService from './config-service';
import { User } from 'commons/models/user';
import { JWT } from 'commons/models/jwt';

const BACKEND_URL = `${ConfigService.BACKEND_URL}/auth`;

export type Auth = {
    wallet: string;
    secret: string;
    timestamp: number;
}

export async function signIn(data: Auth): Promise<string> {
    const response = await axios.post(`${BACKEND_URL}/signin`, data);
    return response.data;
}

export async function signUp(data: User) {
    const response = await axios.post(`${BACKEND_URL}/signup`, data);
    return response.data;
}

export async function signOut() {
    localStorage.clear();
    window.location.href = '/login';
}

export async function activate(wallet: string, code: string): Promise<string> {
    if(!wallet || !code) return '';
    const response = await axios.post(`${BACKEND_URL}/activate/${wallet}/${code}`, { wallet, code });
    return response.data;
}

export function parseJwt(token: string): JWT {
    if(!token) throw new Error('Token is required');
    
    // 取出JWT的payload部分（第二段），JWT格式为header.payload.signature
    const base64str = token.split('.')[1];
    console.log('parseJwt', base64str)
    // 将base64url格式的字符串替换为标准base64格式，便于后续解码
    const base64 = base64str.replace('-', '+').replace('_', '/'); // 使其成为合法的base64字符串
    return JSON.parse(window.atob(base64));
}

export function getJwt(): JWT | null {
    const token = localStorage.getItem('token');
    if(!token) return null;
    return parseJwt(token);
}