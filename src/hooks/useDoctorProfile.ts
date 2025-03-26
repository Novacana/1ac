
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { logGdprActivity } from '@/utils/fhir/activityLogging';

interface DoctorLicense {
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate?: string;
  specialty: string;
}

interface DoctorStatistics {
  patientsCount: number;
  prescriptionsCount: number;
  consultationsCount: number;
  totalRevenue: number;
}

interface DoctorSchedule {
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
      // Log GDPR activity - profile data access
      await logGdprActivity(
        user.id,
        'profile_data_access',
        'Doctor accessed their profile data'
      );
      
      // Fetch license information from database
      const { data: licenseData, error: licenseError } = await supabase
        .from('doctor_licenses')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (licenseError && licenseError.code !== 'PGRST116') {
        console.error('Error fetching license data:', licenseError);
      }
      
      if (licenseData) {
        setLicenseInfo({
          licenseNumber: licenseData.license_number || '',
          issuingAuthority: licenseData.issuing_authority || '',
          issueDate: licenseData.issue_date || '',
          expiryDate: licenseData.expiry_date || '',
          specialty: licenseData.specialty || 'Allgemeinmedizin'
        });
      }
      
      // Fetch statistics from database
      const { data: statsData, error: statsError } = await supabase
        .from('doctor_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching statistics:', statsError);
      }
      
      if (statsData) {
        setStatistics({
          patientsCount: statsData.patients_count || 0,
          prescriptionsCount: statsData.prescriptions_count || 0,
          consultationsCount: statsData.consultations_count || 0,
          totalRevenue: statsData.total_revenue || 0
        });
      }
      
      // Fetch schedule from database
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', user.id)
        .order('day_of_week', { ascending: true });
        
      if (scheduleError) {
        console.error('Error fetching schedule:', scheduleError);
      }
      
      if (scheduleData) {
        const formattedSchedule = scheduleData.map((item: any) => ({
          dayOfWeek: item.day_of_week,
          startTime: item.start_time,
          endTime: item.end_time,
          isAvailable: item.is_available
        }));
        
        setSchedule(formattedSchedule);
      }
    } catch (error) {
      console.error('Error loading doctor data:', error);
      toast.error('Fehler beim Laden der Arztdaten');
    } finally {
      setLoading(false);
    }
  };

  const updateLicenseInfo = async (data: Partial<DoctorLicense>) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Check if license record exists
      const { data: existingLicense, error: checkError } = await supabase
        .from('doctor_licenses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      // Log GDPR activity - license data update
      await logGdprActivity(
        user.id,
        'license_data_update',
        'Doctor updated their license information'
      );
      
      const licenseData = {
        license_number: data.licenseNumber,
        issuing_authority: data.issuingAuthority,
        issue_date: data.issueDate,
        expiry_date: data.expiryDate,
        specialty: data.specialty,
        user_id: user.id
      };
      
      let result;
      
      if (existingLicense) {
        // Update existing record
        result = await supabase
          .from('doctor_licenses')
          .update(licenseData)
          .eq('user_id', user.id);
      } else {
        // Insert new record
        result = await supabase
          .from('doctor_licenses')
          .insert(licenseData);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Update local state
      setLicenseInfo(prev => ({
        ...prev,
        ...data
      }));
      
      toast.success('Lizenzdaten erfolgreich aktualisiert');
      return true;
    } catch (error) {
      console.error('Error updating license info:', error);
      toast.error('Fehler beim Aktualisieren der Lizenzdaten');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (newSchedule: DoctorSchedule[]) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Log GDPR activity - schedule update
      await logGdprActivity(
        user.id,
        'schedule_update',
        'Doctor updated their availability schedule'
      );
      
      // Delete existing schedule
      const { error: deleteError } = await supabase
        .from('doctor_schedules')
        .delete()
        .eq('doctor_id', user.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Insert new schedule
      const scheduleData = newSchedule.map(item => ({
        doctor_id: user.id,
        day_of_week: item.dayOfWeek,
        start_time: item.startTime,
        end_time: item.endTime,
        is_available: item.isAvailable
      }));
      
      const { error: insertError } = await supabase
        .from('doctor_schedules')
        .insert(scheduleData);
        
      if (insertError) {
        throw insertError;
      }
      
      // Update local state
      setSchedule(newSchedule);
      toast.success('Zeitplan erfolgreich aktualisiert');
      return true;
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Fehler beim Aktualisieren des Zeitplans');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    licenseInfo,
    statistics,
    schedule,
    updateLicenseInfo,
    updateSchedule,
    loadDoctorData
  };
};
