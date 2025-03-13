
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { logGdprActivity } from '@/utils/fhirCompliance';

export interface DoctorLicense {
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate?: string;
  specialty: string;
}

export interface DoctorStatistics {
  patientsCount: number;
  prescriptionsCount: number;
  consultationsCount: number;
  totalRevenue: number;
}

export interface DoctorSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export const useDoctorProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<DoctorLicense>({
    licenseNumber: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    specialty: 'Allgemeinmedizin'
  });
  const [statistics, setStatistics] = useState<DoctorStatistics>({
    patientsCount: 0,
    prescriptionsCount: 0,
    consultationsCount: 0,
    totalRevenue: 0
  });
  const [schedule, setSchedule] = useState<DoctorSchedule[]>([]);

  useEffect(() => {
    if (user) {
      loadDoctorData();
    }
  }, [user]);

  const loadDoctorData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch doctor license
      const { data: licenseData, error: licenseError } = await supabase
        .from('medical_licenses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (licenseError) throw licenseError;
      
      if (licenseData) {
        setLicenseInfo({
          licenseNumber: licenseData.license_number || '',
          issuingAuthority: licenseData.issuing_authority || '',
          issueDate: licenseData.issue_date ? new Date(licenseData.issue_date).toISOString().split('T')[0] : '',
          expiryDate: licenseData.expiry_date ? new Date(licenseData.expiry_date).toISOString().split('T')[0] : '',
          specialty: licenseData.specialty || 'Allgemeinmedizin'
        });
      }
      
      // Fetch doctor statistics
      const { data: statsData, error: statsError } = await supabase
        .from('doctor_statistics')
        .select('*')
        .eq('doctor_id', user.id)
        .maybeSingle();
      
      if (statsError) throw statsError;
      
      if (statsData) {
        setStatistics({
          patientsCount: statsData.patients_treated || 0,
          prescriptionsCount: statsData.prescriptions_issued || 0,
          consultationsCount: statsData.consultations_completed || 0,
          totalRevenue: statsData.total_earnings || 0
        });
      }
      
      // Fetch doctor schedule
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', user.id)
        .order('day_of_week', { ascending: true });
      
      if (scheduleError) throw scheduleError;
      
      if (scheduleData) {
        setSchedule(scheduleData.map((item: any) => ({
          dayOfWeek: item.day_of_week,
          startTime: item.start_time,
          endTime: item.end_time,
          isAvailable: item.is_available
        })));
      }
      
      // Log GDPR activity
      await logGdprActivity(
        user.id,
        'profile_view',
        'Doctor viewed their profile'
      );
      
    } catch (error) {
      console.error('Error loading doctor data:', error);
      toast.error('Fehler beim Laden der Arztdaten');
    } finally {
      setLoading(false);
    }
  };

  const saveLicenseInfo = async (license: DoctorLicense) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('medical_licenses')
        .upsert({
          user_id: user.id,
          license_number: license.licenseNumber,
          issuing_authority: license.issuingAuthority,
          issue_date: license.issueDate,
          expiry_date: license.expiryDate,
          specialty: license.specialty,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      setLicenseInfo(license);
      
      // Log GDPR activity
      await logGdprActivity(
        user.id,
        'license_update',
        'Doctor updated their license information'
      );
      
      toast.success('Approbationsdaten erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving license info:', error);
      toast.error('Fehler beim Speichern der Approbationsdaten');
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async (scheduleData: DoctorSchedule[]) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First delete existing schedule
      await supabase
        .from('doctor_availability')
        .delete()
        .eq('doctor_id', user.id);
      
      // Then insert new schedule
      const scheduleToInsert = scheduleData.map(item => ({
        doctor_id: user.id,
        day_of_week: item.dayOfWeek,
        start_time: item.startTime,
        end_time: item.endTime,
        is_available: item.isAvailable
      }));
      
      const { error } = await supabase
        .from('doctor_availability')
        .insert(scheduleToInsert);
      
      if (error) throw error;
      
      setSchedule(scheduleData);
      
      // Log GDPR activity
      await logGdprActivity(
        user.id,
        'schedule_update',
        'Doctor updated their availability schedule'
      );
      
      toast.success('Sprechzeiten erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Fehler beim Speichern der Sprechzeiten');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    licenseInfo,
    statistics,
    schedule,
    loadDoctorData,
    saveLicenseInfo,
    saveSchedule
  };
};

export default useDoctorProfile;
