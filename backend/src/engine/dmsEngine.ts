import cron from 'node-cron';
import { redisClient } from '../services/redisClient';
import prisma from '../prisma/client';
import NotificationService from '../services/notificationService';

export enum EscalationPhase {
  HEALTHY = 'HEALTHY',
  NUDGE_EMAIL = 'NUDGE_EMAIL',          // Day 1
  NUDGE_SMS = 'NUDGE_SMS',              // Day 7
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT', // Day 14-28
  FINAL_RELEASE = 'FINAL_RELEASE'       // Day 35
}

export enum ReleaseGate {
  STAGE_1_URGENT = 'STAGE_1_URGENT',
  STAGE_2_CONTACTS = 'STAGE_2_CONTACTS',
  STAGE_3_FULL = 'STAGE_3_FULL',
  STAGE_4_LEGAL = 'STAGE_4_LEGAL'
}

class DMSEngine {
  static init() {
    // Run checks hourly
    cron.schedule('0 * * * *', async () => {
      console.log('[DMS CRON] Evaluating Escalation ladder...');
      await this.processEscalations();
    });
  }

  static async processEscalations() {
    const trackedVaults = await prisma.vaultMetadata.findMany({
      where: { isActive: true },
      include: { user: true }
    });

    const now = Date.now();

    for (const vault of trackedVaults) {
      const redisKey = `heartbeat:vault:${vault.id}`;
      const lastHeartbeatStr = await redisClient.get(redisKey);
      
      let lastHeartbeat = lastHeartbeatStr ? parseInt(lastHeartbeatStr, 10) : vault.lastHeartbeat.getTime();
      const daysSinceHeartbeat = (now - lastHeartbeat) / (1000 * 60 * 60 * 24);

      if (daysSinceHeartbeat >= 35 && vault.phase !== EscalationPhase.FINAL_RELEASE) {
        await this.escalateToPhase(vault, EscalationPhase.FINAL_RELEASE, ReleaseGate.STAGE_4_LEGAL);
      } else if (daysSinceHeartbeat >= 14 && vault.phase !== EscalationPhase.EMERGENCY_CONTACT && vault.phase !== EscalationPhase.FINAL_RELEASE) {
        await this.escalateToPhase(vault, EscalationPhase.EMERGENCY_CONTACT, ReleaseGate.STAGE_2_CONTACTS);
      } else if (daysSinceHeartbeat >= 7 && vault.phase !== EscalationPhase.NUDGE_SMS && vault.phase !== EscalationPhase.EMERGENCY_CONTACT && vault.phase !== EscalationPhase.FINAL_RELEASE) {
        await this.escalateToPhase(vault, EscalationPhase.NUDGE_SMS, ReleaseGate.STAGE_1_URGENT);
      } else if (daysSinceHeartbeat >= 1 && vault.phase === EscalationPhase.HEALTHY) {
        await this.escalateToPhase(vault, EscalationPhase.NUDGE_EMAIL, null);
      }
    }
  }

  static async escalateToPhase(vaultData: any, phase: EscalationPhase, releaseGate: ReleaseGate | null) {
    console.log(`[DMS ALERT] Vault ${vaultData.id} escalated to ${phase}`);
    // Update DB state
    await prisma.vaultMetadata.update({
      where: { id: vaultData.id },
      data: { phase }
    });

    const email = vaultData.user?.email || "unknown@user.com";
    const phone = "+15555555555"; // Mock lookup

    switch(phase) {
      case EscalationPhase.NUDGE_EMAIL:
        await NotificationService.sendEmail(email, "Family Instruction Manual: Weekly Check-In", 
          `Hi ${vaultData.user?.fullName || "User"}, checking in to extend your vault security streak. Please push the wellness button.`);
        break;
      case EscalationPhase.NUDGE_SMS:
        await NotificationService.sendSMS(phone, 
          `Failsafe Alert: It's been 7 days since your last check-in. Please open your Family Instruction Manual to pause the escalation.`);
        break;
      case EscalationPhase.EMERGENCY_CONTACT:
        // Assume beneficiary is contact@test.com
        await NotificationService.sendEmail("beneficiary@example.com", "Urgent: Reach out to your loved one", 
          `Hello. You are a designated contact for ${vaultData.user?.fullName || "User"}. They have missed their failsafe window. Please ensure they are well.`);
        break;
      case EscalationPhase.FINAL_RELEASE:
        await NotificationService.sendEmail("beneficiary@example.com", "Action Required: The Family Instruction Manual Unsealed", 
          `Sadly we have reached Phase 4. A pre-signed payload unseal link has been generated for you to commence urgent actions.`);
        break;
    }
    
    await prisma.auditLog.create({
      data: { vaultId: vaultData.id, eventType: 'ESCALATION', details: `Escalated to ${phase}` }
    });
  }
}

export default DMSEngine;
