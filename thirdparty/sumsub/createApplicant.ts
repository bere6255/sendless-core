// createApplicant.ts
import sumsubClient from '../../configs/sumsubClient';

export interface ApplicantInfo {
  externalUserId: string;
  email?: string;
  phone?: string;
  lang?: string;
  info?: {
    firstName?: string;
    lastName?: string;
    dob?: string;
    country?: string;
    idDocType?: string;
  };
}

export interface ApplicantResponse {
  id: string;
  createdAt: string;
  inspectionId: string;
  clientId: string;
  externalUserId: string;
  type: string;
  reviewStatus: string;
}

export async function createApplicant(applicant: ApplicantInfo): Promise<ApplicantResponse> {
  try {
    const response = (await sumsubClient.post('/resources/applicants?levelName=id-only', applicant,{
  headers: {
    'Content-Type': 'application/json',
  }
}));
    console.log('✅ Applicant created:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error creating applicant:', error?.response?.data || error.message);
    throw error;
  }
}
