export interface FormField {
  _id?: string;
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'pannumber'; // ✅ Added 'pannumber'
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string; // Optional pattern (can be used for PAN format)
  };
}

export interface Form {
  _id?: string;
  id: string;
  name: string;
  description: string;
  category: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  _id?: string;
  id: string;
  formId: string;
  formName: string;
  data: Record<string, any>;
  submittedAt: string;

  /**  NEW: Status of submission (pending, approved) */
  status: 'pending' | 'approved'|'rejected'; //  Added field
}
