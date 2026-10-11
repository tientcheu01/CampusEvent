export interface InscriptionPayload {
  titre_projet: string;
  porteurs: string;
  participation: string;
  nombre_membres?: number | null;
  encadreur?: string;
  problematique: string;
  objectif_general: string;
  objectif_spec1: string;
  objectif_spec2?: string;
  objectif_spec3?: string;
  principe_fonctionnement: string;
  innovation_apportee?: string;
  caractere_innovant: string;
  faisabilite_technique?: string;
  faisabilite_operationnelle?: string;
  impact_social: boolean;
  impact_economique: boolean;
  impact_environnemental: boolean;
  impact_academique: boolean;
  impact_technologique: boolean;
  description_impacts?: string;
  joint_ppt: boolean;
  joint_video: boolean;
  joint_maquette: boolean;
  joint_plan_tech: boolean;
  joint_plan_financier: boolean;
  joint_plan_admin: boolean;
  joint_autres?: string;
  fichiers_urls: string;
  date_signature: string;
}

export interface SubmitResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

export interface UploadUrlResponse {
  url: string;
}
