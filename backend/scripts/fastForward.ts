import { redisClient } from '../src/services/redisClient';
import DMSEngine from '../src/engine/dmsEngine';
import dotenv from 'dotenv';
import prisma from '../src/prisma/client';

dotenv.config();

const fastForward = async (days: number) => {
  const vaultId = process.argv[3]; // Optional parameter to target specific vault
  
  if(!vaultId) {
    console.log("Usage: npx ts-node fastForward.ts <days> <vaultId>");
    process.exit(1);
  }

  const offsetMs = days * 24 * 60 * 60 * 1000;
  const simulatedTime = Date.now() - offsetMs;
  
  console.log(`Fast-forwarding time by ${days} days... Setting heartbeat to ${new Date(simulatedTime).toISOString()}`);
  
  // Set in Redis to trick the sub-millisecond layer
  await redisClient.set(`heartbeat:vault:${vaultId}`, simulatedTime.toString());
  
  // Also set in DB to align backup layer
  await prisma.vaultMetadata.update({
    where: { id: vaultId },
    data: { lastHeartbeat: new Date(simulatedTime) }
  });

  // Manually trigger process escalations immediately bypassing cron
  await DMSEngine.processEscalations();

  console.log('Escalation ladder evaluated successfully.');
  process.exit(0);
};

const daysArg = process.argv[2] ? parseInt(process.argv[2], 10) : NaN;
if(isNaN(daysArg)) {
  console.log("Please provide a valid day offset (e.g. 7, 14, 35).");
  process.exit(1);
}

// ensure redis connects before operation
setTimeout(() => {
  fastForward(daysArg);
}, 1000);
