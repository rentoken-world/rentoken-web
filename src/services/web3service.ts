/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-17 21:37:14
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 09:26:41
 * @FilePath: /keke-frontend/src/services/web3service.ts
 * @Description: Web3服务模块，处理区块链钱包连接、用户认证和支付功能
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// 导入JWT类型定义，用于处理JSON Web Token
import { JWT } from 'commons/models/jwt';
// 导入配置服务，用于获取应用配置信息
import ConfigService from './config-service';
// 从ethers.js库导入BrowserProvider和Contract类，用于与以太坊区块链交互
import { BrowserProvider, Contract } from 'ethers';
// 导入计划/套餐模型类型定义
import { Plan } from 'commons/models/plan';
// 导入ERC20代币标准的ABI(应用程序二进制接口)，用于与ERC20代币合约交互
import ERC20_ABI from 'commons/services/ERC20.json';
// 从认证服务导入JWT解析和登录函数
import { parseJwt, signIn } from './auth-service';

/**
 * 获取以太坊提供者(Provider)实例
 * 检查浏览器是否安装了MetaMask钱包，并返回BrowserProvider实例
 * @returns {BrowserProvider} 以太坊浏览器提供者实例
 * @throws {Error} 如果未检测到MetaMask钱包则抛出错误
 */
function getProvider() {
    // 检查浏览器window对象中是否存在ethereum属性（MetaMask注入的对象）
    if(!window.ethereum) {
        // 如果没有找到MetaMask，抛出错误提示用户安装
        throw new Error('No Metamask found');
    }
    // 返回基于MetaMask的以太坊浏览器提供者实例，用于后续区块链交互
    return new BrowserProvider(window.ethereum);
}

/**
 * 获取用户的以太坊钱包地址
 * 请求用户连接MetaMask钱包并获取账户地址
 * @returns {Promise<string>} 返回用户的第一个以太坊钱包地址
 * @throws {Error} 如果用户拒绝连接或没有可用账户则抛出错误
 */
export async function getWallet(): Promise<string> {
    // 获取以太坊提供者实例
    const provider = getProvider();
    // 控制台输出提供者信息，用于调试
    console.log('getProvider', provider);
    // 向MetaMask发送请求，要求用户授权访问账户列表
    // eth_requestAccounts 是以太坊标准RPC方法，会弹出MetaMask连接确认窗口
    const accounts = await provider.send('eth_requestAccounts', []);

    // 检查是否成功获取到账户列表
    if(!accounts || accounts.length === 0) {
        // 如果没有获取到账户，说明用户拒绝了连接请求或没有可用账户
        throw new Error('Metamask did not allow access to accounts');
    }

    // 获取用户授权的第一个钱包地址
    const firstAllowedWallet = accounts[0];
    // 将钱包地址保存到浏览器本地存储中，便于后续使用
    localStorage.setItem('wallet', firstAllowedWallet);

    // 返回钱包地址
    return firstAllowedWallet;
}

/**
 * 执行Web3钱包登录流程
 * 通过MetaMask钱包签名验证用户身份并获取JWT令牌
 * @returns {Promise<JWT | undefined>} 返回解析后的JWT对象，登录失败则返回undefined
 */
export async function doLogin(): Promise<JWT | undefined> {
    // 控制台输出登录开始标记，用于调试流程追踪
    console.log('doLogin');
    // 获取当前时间戳，用于防重放攻击
    const timestamp = Date.now();
    // 调试输出：步骤0
    console.log('doLogin0');
    // 从配置服务获取认证消息模板，用户需要对此消息进行签名
    const message = ConfigService.getAuthMessage();
    // 调试输出：步骤1
    console.log('doLogin1');
    // 获取用户的钱包地址，这会触发MetaMask连接请求
    const wallet = await getWallet();
    // 调试输出：步骤2
    console.log('doLogin2');
    // 获取以太坊提供者实例
    const provider = getProvider();
    // 调试输出：步骤3
    console.log('doLogin3');
    // 获取签名器对象，用于对消息进行数字签名
    const signer = await provider.getSigner();
    // 调试输出：步骤4
    console.log('doLogin4');
    // 使用用户的私钥对认证消息进行签名，这是身份验证的关键步骤
    const challenge = await signer.signMessage(message);
    // 输出待签名的消息内容，用于调试
    console.log('message', message);
    // 调用后端认证服务，传入签名、时间戳和钱包地址进行身份验证
    // signIn 返回的是一个包含 token、expiresAt、user 等字段的对象
    const tokenObj = await signIn({
        secret: challenge,     // 用户的数字签名
        timestamp,            // 时间戳，防止重放攻击
        wallet                // 用户钱包地址
    });
    // 输出获取到的完整token对象，用于调试
    console.log('tokenObj', tokenObj);
    // 只取出JWT字符串部分
    const token = tokenObj.token;
    // 将JWT令牌保存到本地存储，用于后续API请求的身份验证
    localStorage.setItem('token', token);

    // 解析JWT令牌并返回其内容
    return parseJwt(token);
}

/**
 * 启动支付流程
 * 批准Poseidon Pay合约使用用户的ERC20代币进行支付
 * @param {Plan} plan 包含代币地址和价格信息的付费计划对象
 * @returns {Promise<boolean>} 支付授权成功返回true
 */
export async function startPayment(plan: Plan): Promise<boolean> {
    // 获取以太坊提供者实例
    const provider = getProvider();
    // 获取用户的签名器对象，用于执行区块链交易
    const signer = await provider.getSigner();
    // 创建ERC20代币合约实例，使用计划中指定的代币地址和标准ERC20 ABI
    const tokenContract = new Contract(plan.tokenAddress, ERC20_ABI, signer);
    // 调用代币合约的approve方法，授权Poseidon Pay合约使用指定数量的代币
    // 授权金额为计划价格乘以12（可能是12个月的年度订阅）
    const tx = await tokenContract.approve(ConfigService.POSEIDON_PAY_CONTRACT, BigInt(plan.price) * BigInt(12));
    // 等待交易在区块链上确认完成
    await tx.wait();
    // 返回成功状态
    return true;
}