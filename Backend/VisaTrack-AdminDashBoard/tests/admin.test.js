const request = require('supertest');
const app = require('../src/app'); // Adjust the path as necessary

describe('Admin Routes', () => {
    it('should render the admin dashboard', async () => {
        const res = await request(app).get('/admin/dashboard');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Admin Dashboard');
    });

    it('should list visa requirements', async () => {
        const res = await request(app).get('/admin/visas');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Visa Requirements');
    });

    it('should render the visa form', async () => {
        const res = await request(app).get('/admin/visa-form');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Visa Form');
    });

    // Add more tests for other admin functionalities as needed
});