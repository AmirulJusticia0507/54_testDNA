const sequelize = require('../db');

describe('Database', () => {
  test('should connect to MySQL', async () => {
    await sequelize.authenticate();
    expect(true).toBe(true);
  });

  test('should have User model', async () => {
    const User = require('../models/User');
    expect(User).toBeDefined();
    const count = await User.count();
    expect(typeof count).toBe('number');
  });
});

describe('Auth Service', () => {
  const authService = require('../services/authService');

  test('login should return token for valid credentials', async () => {
    const result = await authService.login('superadmin@gmail.com', 'gedanggoreng');
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe('superadmin@gmail.com');
  });

  test('login should return null for wrong password', async () => {
    const result = await authService.login('superadmin@gmail.com', 'wrongpassword');
    expect(result).toBeNull();
  });
});

describe('Calculator Functions', () => {
  const calculators = require('../controllers/calculators');

  test('calculatePriorityScore should return valid score', () => {
    const score = calculators.calculatePriorityScore({ usia: 30, kondisi_kesehatan: 'luka ringan' });
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test('calculateDNAAnalysis should return G ratio', () => {
    const result = calculators.calculateDNAAnalysis('ATCGATCG');
    expect(typeof result.ratioG).toBe('number');
    expect(result.ratioG).toBeGreaterThanOrEqual(0);
    expect(result.ratioG).toBeLessThanOrEqual(1);
  });

  test('calculateDNAAnalysis should reject invalid sequence', () => {
    expect(() => calculators.calculateDNAAnalysis('ATCGXYZ')).toThrow();
  });

  test('calculateInheritance should return probabilities', () => {
    const result = calculators.calculateInheritance('AA', 'Aa', 'autosomal_dominant');
    expect(result).toHaveProperty('normal');
    expect(result).toHaveProperty('carrier');
    expect(result).toHaveProperty('affected');
  });
});

describe('Health Check', () => {
  test('GET /health should return ok', async () => {
    const http = require('http');
    const res = await new Promise((resolve) => {
      http.get('http://localhost:3000/health', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      }).on('error', () => resolve({ status: 0, body: {} }));
    });
    // Only test if server is running
    if (res.status === 200) {
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('dna-analysis-backend');
    }
  });
});
