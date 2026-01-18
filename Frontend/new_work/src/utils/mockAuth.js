export const mockCredentials = {
  email: 'traveler@visatrack.com',
  password: 'Travel2026!'
};

export const login = async ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const rawUsers = localStorage.getItem('users');
        if (rawUsers) {
          const users = JSON.parse(rawUsers);
          const u = users.find((x) => x.email === email && x.password === password);
          if (u) {
            const token = 'mock-token-' + Date.now();
            resolve({ token, user: { id: u.id, name: u.name, email: u.email, passports: u.passports || [] } });
            return;
          }
        }
      } catch (e) {}

      if (email === mockCredentials.email && password === mockCredentials.password) {
        resolve({ token: 'mock-token-123', user: { name: 'Traveler', email } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 600);
  });
};

