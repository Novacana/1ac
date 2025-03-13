
/**
 * Main FHIR utility exports
 * This file re-exports all FHIR-related functions for easy importing
 */

// Core GDPR/HIPAA compliance functions
export * from './gdprHipaaCompliance';

// FHIR resource conversion utilities
export * from './resources/patient';
export * from './resources/practitioner';
export * from './resources/consent';
export * from './resources/medicationRequest';
export * from './resources/documentReference';

// Activity logging
export * from './activityLogging';
