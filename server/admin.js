import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // <--- 1. 引入 crypto 模块
import { User, UserSetting } from './models.js';

// --- 初始化管理员用户 ---
export const seedAdminUser = async () => {
  try {
    // 检查是否已存在 admin 用户
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      console.log('正在创建默认管理员账户...');
      
      // 2. 生成随机密码 (8字节 = 16个字符的十六进制字符串)
      const randomPassword = crypto.randomBytes(8).toString('hex');
      
      // 生成加密密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });

      await adminUser.save();
      
      // 初始化管理员设置
      await new UserSetting({ userId: adminUser._id }).save();

      // 3. 在控制台醒目地打印密码
      console.log('\n===========================================');
      console.log('管理员账户已自动生成');
      console.log(`用户名: admin`);
      console.log(`临时密码: ${randomPassword}`);
      console.log('请务必复制此密码，登录后建议立即修改！');
      console.log('===========================================\n');
    } else {
      // 确保现有 admin 用户拥有 admin 角色
      if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        await adminExists.save();
        console.log('已修复管理员权限');
      }
    }
  } catch (error) {
    console.error('初始化管理员失败:', error);
  }
};