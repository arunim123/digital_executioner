import { Router } from 'express';
import prisma from '../../prisma/client';
import { redisClient } from '../../services/redisClient';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

// LIFE LINE (CHECK-IN)
router.post('/check-in', async (req, res) => {
  try {
    const { vaultId } = req.body;
    if (!vaultId) return res.status(400).json({ error: 'Vault ID is required' });

    const vault = await prisma.vaultMetadata.findUnique({ where: { id: vaultId }, include: { user: true } });
    if (!vault) return res.status(404).json({ error: 'Vault not found' });

    const now = Date.now();
    const redisKey = `heartbeat:vault:${vault.id}`;
    if (redisClient.isOpen) {
      await redisClient.set(redisKey, now.toString());
    }

    await prisma.vaultMetadata.update({
      where: { id: vault.id },
      data: { lastHeartbeat: new Date(now), phase: 'HEALTHY' }
    });

    const user = await prisma.user.update({
      where: { id: vault.userId },
      data: { securityStreak: { increment: 1 } }
    });

    res.json({ status: 'SUCCESS', streak: user.securityStreak, timestamp: now });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// LOCAL FILE UPLOAD (Mocks S3)
router.post('/upload', async (req, res) => {
  try {
    const { vaultId, encryptedPayload } = req.body;
    
    const buffer = Buffer.from(JSON.stringify(encryptedPayload), 'utf-8');
    const localDir = path.join(__dirname, '../../../../local_storage/vaults', vaultId);
    await fs.mkdir(localDir, { recursive: true });
    
    const filePath = path.join(localDir, 'manual.enc');
    await fs.writeFile(filePath, buffer);

    await prisma.vaultMetadata.update({
      where: { id: vaultId },
      data: { s3BucketPath: filePath, clientEncryptedData: 'Stored locally in mock-S3 (Zero-Knowledge)' }
    });

    await prisma.auditLog.create({
      data: { vaultId, eventType: 'CONTENT_UPLOADED', details: 'Zero-knowledge manual payload sealed locally.' }
    });

    res.json({ status: 'SUCCESS' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Zero-Knowledge Local Upload failed' });
  }
});

// FAIL-SAFE REVOCATION
router.post('/revoke', async (req, res) => {
  try {
    const { vaultId } = req.body;
    if (!vaultId) return res.status(400).json({ error: 'Vault ID missing' });

    const now = Date.now();
    await prisma.vaultMetadata.update({
      where: { id: vaultId },
      data: { phase: 'HEALTHY', lastHeartbeat: new Date(now) }
    });

    if (redisClient.isOpen) {
      await redisClient.set(`heartbeat:vault:${vaultId}`, now.toString());
    }

    await prisma.auditLog.create({
      data: { vaultId, eventType: 'ESCALATION_REVOKED', details: 'User gracefully restored security state.' }
    });

    // Option: Use NotificationService.sendSMS(...) to tell user: "Security Restored"
    
    res.json({ status: 'SUCCESS', message: 'Security Restored' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Revoke failed' });
  }
});

export default router;
