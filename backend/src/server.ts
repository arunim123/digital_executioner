import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DMSEngine from './engine/dmsEngine';
import releaseRoutes from './api/routes/release';
import vaultRoutes from './api/routes/vault';
import prisma from './prisma/client';

// Connect env variables from .env
dotenv.config();

const app = express();

// Middleware Setups
app.use(cors());
app.use(express.json());

// Expose API Endpoints
app.use('/api/release', releaseRoutes);
app.use('/api/vault', vaultRoutes);

// Health Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

// Seed default data for local testing
async function seedDefaultData() {
  try {
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: { email: 'test@example.com', fullName: 'Test User', hashedPassword: 'mock' }
    });
    await prisma.vaultMetadata.upsert({
      where: { id: 'default-vault-uuid' },
      update: {},
      create: { id: 'default-vault-uuid', userId: user.id, s3BucketPath: '' }
    });
    console.log('Database seeded with default testing vault.');
  } catch(err) {
    console.error('Failed to seed DB', err);
  }
}
seedDefaultData();

app.listen(PORT, () => {
  console.log(`Digital Executor Backend running on port ${PORT}`);
  
  // Attach Chron job engine explicitly to node boot process
  DMSEngine.init();
  console.log('DMS Engine tracking logic mounted.');
});
