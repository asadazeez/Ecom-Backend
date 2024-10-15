import * as dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
	ENV: str({ choices: ['local', 'production'], default: 'local' }),
	PORT: port({ default: 8000 }),
	ADMIN_JWT_SECRET_KEY: str({
		default: 
			'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQioPQW4iLCJlbWFpbCI6ImFkbWluQGVtYy5jb20ifQ.xCyQt3wQXRj8NojG-m26LS9GktX90VBxU15BoxLuTS8',
	}),
	USER_JWT_SECRET_KEY: str({
		default:
			'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlYTFJHT60UGHYiLCJlbWFpbCI6ImFkbWluQGVtYy5jb20ifQ.xCyQt3wQXRj8NojG-m26LS9GktX90VBxU15BoxLuTS8',
	}),
	JWT_EXPIRES: str({ default: '7 days' }),
	ADMIN_EMAIL: str({ default: 'admin@ecommerce.com' }),
	ADMIN_PASSWORD: str({ default: 'admin' }),
	STRIPE_SECRET_KEY:str({default:'sk_test_51Q9jMK2Ke57wrUvFNgQyAkJJuydB5GOeko0PCcGDzINiJRKEH7m8URhY7EmITYjGm6OEiIPamvTakO1SXp3ZiUCp00KHbmUa9i'
})	});

	

export default env;