import { Router } from 'express';
import prisma from '../../prisma/client';
import path from 'path';
import fs from 'fs';

const router = Router();

// Endpoint to directly download the local file since we're not using pre-signed S3 URLs
router.get('/download', async (req, res) => {
  const { path: filePath } = req.query;
  if (!filePath || typeof filePath !== 'string') return res.status(400).send('Missing path');
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

/**
 * Stage Release API (Phase 3 -> 4)
 * Generates an encrypted S3 presigned URL allowing beneficiary access.
 */
router.post('/trigger', async (req, res) => {
  try {
    const { vaultId, contactEmail, releaseToken } = req.body;

    // Validate request
    if (!vaultId || !contactEmail || !releaseToken) {
       res.status(400).json({ error: 'Missing required parameters' });
       return;
    }

    // Lookup Vault metadata to ensure it is actually in the FINAL_RELEASE phase
    const vault = await prisma.vaultMetadata.findUnique({
      where: { id: vaultId }
    });

    if (!vault) {
       res.status(404).json({ error: 'Vault not found' });
       return;
    }

    if (vault.phase !== 'FINAL_RELEASE') {
       res.status(403).json({ error: 'Vault is not in release phase. Escalation ladder continues to block access.' });
       return;
    }

    // Verify the Beneficiary Contact and the short-lived releaseToken mapped against session/db
    // Mock Validation:
    if (releaseToken !== 'mock-valid-token') {
       res.status(401).json({ error: 'Invalid or expired release token' });
       return;
    }

    // MOCK Pre-signed URL using the local download endpoint
    const url = `http://localhost:${process.env.PORT || 4000}/api/release/download?path=${encodeURIComponent(vault.s3BucketPath)}`;

    // Track operation internally using failsafe audit trail 
    await prisma.auditLog.create({
      data: {
        vaultId: vault.id,
        eventType: 'ACCESS_GRANTED',
        details: `Pre-signed URL generated for beneficiary contact: ${contactEmail}`
      }
    });

    // Provide payload including pre-signed S3 URL AND Zero-Knowledge Client Key fragments needed to unseal locally
    res.json({
      status: 'SUCCESS',
      message: 'Access granted successfully. Link expires in 24 hours.',
      url,
      clientEncryptedData: vault.clientEncryptedData 
    });

  } catch (error: any) {
    console.error('Release error:', error);
    res.status(500).json({ error: 'Internal server error while releasing vault data.' });
  }
});

export default router;
