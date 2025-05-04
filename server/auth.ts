import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express } from 'express';
import session from 'express-session';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { storage } from './storage';
import { User as SelectUser } from '@shared/schema';

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'space-detect-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  };

  app.set('trust proxy', 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  app.post('/api/register', async (req, res, next) => {
    try {
      if (!req.body.username || !req.body.password || !req.body.name) {
        return res.status(400).json({ 
          message: 'All fields are required',
          code: 'invalid_input'
        });
      }
      
      const { confirmPassword, ...userData } = req.body;
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const user = await storage.createUser({
        ...userData,
        password: await hashPassword(userData.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password back to client
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: 'Registration failed', details: error.message });
    }
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password back to client
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
    // Don't send password back to client
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  app.put('/api/user', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
    try {
      const updatedUser = await storage.updateUser(req.user.id, req.body);
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update user' });
    }
  });

  app.delete('/api/user', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not authenticated' });
    try {
      await storage.deleteUser(req.user.id);
      req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.json({ message: 'Account deleted successfully' });
      });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete account' });
    }
  });
}
