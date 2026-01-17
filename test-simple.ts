import { Elysia } from 'elysia';
console.log('Starting simple server...');
try {
    const app = new Elysia()
        .get('/', () => 'Hello')
        .listen(3001);

    console.log('Simple server running on 3001');
} catch (e) {
    console.error('Error starting simple server:', e);
}
