import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình database
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'shop_quan_ao',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: console.log, 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test kết nối database
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Kết nối database thành công!');
    return true;
  } catch (error) {
    console.error(' Không thể kết nối database:', error);
    return false;
  }
};

export default sequelize;
