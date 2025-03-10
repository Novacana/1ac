
// This is now just a barrel file that re-exports from the separate utility modules
import { createWebTools } from './utils/webTools';
import { detectToolIntent } from './utils/intentDetection';
import { processQuery } from './utils/productProcessor';
import { executeN8nActions, sendToN8nWebhook } from './utils/n8nIntegration';

export {
  createWebTools,
  detectToolIntent,
  processQuery,
  executeN8nActions,
  sendToN8nWebhook
};
