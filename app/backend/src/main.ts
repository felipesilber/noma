import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
		// CORS: aceita múltiplas origens via env CORS_ORIGINS e wildcard para *.vercel.app
		const corsEnv = process.env.CORS_ORIGINS;
		const allowed =
			corsEnv?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
		app.enableCors({
			origin: (origin, callback) => {
				// Sem origin (ex: curl, servidores) -> permitir
				if (!origin) return callback(null, true);
				// Permitido explicitamente via env
				if (allowed.length > 0 && allowed.includes(origin)) {
					return callback(null, true);
				}
				// Permite domínios do Vercel
				if (origin.endsWith('.vercel.app')) {
					return callback(null, true);
				}
				// Em ausência de configuração, permite todos (reflete)
				if (allowed.length === 0) {
					return callback(null, true);
				}
				return callback(new Error('Not allowed by CORS'), false);
			},
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
			allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
			credentials: true,
		});
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = new DocumentBuilder()
        .setTitle('Noma')
        .setDescription('Endpoints documentation for the basic features the project covers.')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
