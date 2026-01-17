import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';

console.log('Starting test server (no await)...');
try {
    const app = new Elysia()
        .use(staticPlugin())
        .get('/', () => 'Hello')
        .listen(3001);

    console.log('Test server running on 3001');
} catch (e) {
    console.error('Error starting test server:', e);
}
