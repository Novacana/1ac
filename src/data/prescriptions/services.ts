
import { PrescriptionRequest } from "@/types/prescription";
import { prescriptionRequests } from "./mockData";

/**
 * Service-Funktionen zum Abrufen und Aktualisieren der Daten
 * In der Produktion würde dies durch API-Aufrufe ersetzt werden
 */

/**
 * Holt alle Rezeptanfragen
 * @returns Promise mit einer Liste aller Rezeptanfragen
 */
export function getPrescriptionRequests(): Promise<PrescriptionRequest[]> {
  // Simulation einer API-Anfrage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(prescriptionRequests);
    }, 500);
  });
}

/**
 * Holt eine Rezeptanfrage anhand ihrer ID
 * @param id ID der gesuchten Rezeptanfrage
 * @returns Promise mit der gefundenen Rezeptanfrage oder undefined
 */
export function getPrescriptionRequestById(id: string): Promise<PrescriptionRequest | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = prescriptionRequests.find(req => req.id === id);
      resolve(request);
    }, 300);
  });
}

/**
 * Aktualisiert eine Rezeptanfrage anhand ihrer ID
 * @param id ID der zu aktualisierenden Rezeptanfrage
 * @param updates Teilweise oder vollständige Daten für die Aktualisierung
 * @returns Promise mit der aktualisierten Rezeptanfrage
 */
export function updatePrescriptionRequest(
  id: string, 
  updates: Partial<PrescriptionRequest>
): Promise<PrescriptionRequest> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = prescriptionRequests.findIndex(req => req.id === id);
      if (index === -1) {
        reject(new Error("Rezeptanfrage nicht gefunden"));
        return;
      }
      
      prescriptionRequests[index] = {
        ...prescriptionRequests[index],
        ...updates
      };
      
      resolve(prescriptionRequests[index]);
    }, 400);
  });
}

/**
 * Weist einen Arzt einer Rezeptanfrage zu
 * @param requestId ID der Rezeptanfrage
 * @param doctorId ID des Arztes
 * @returns Promise mit der aktualisierten Rezeptanfrage
 */
export function assignDoctorToRequest(
  requestId: string,
  doctorId: string
): Promise<PrescriptionRequest> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = prescriptionRequests.findIndex(req => req.id === requestId);
      if (index === -1) {
        reject(new Error("Rezeptanfrage nicht gefunden"));
        return;
      }
      
      prescriptionRequests[index] = {
        ...prescriptionRequests[index],
        assignedDoctorId: doctorId
      };
      
      resolve(prescriptionRequests[index]);
    }, 300);
  });
}
