import { PluginFunction } from 'formvuelate'

interface ValidationProps {
  errorMessage?: string;
  errors: string[];
  meta: {
    valid: boolean;
    dirty: boolean;
    touched: boolean;
    pending: boolean;
    initialValue: any;
  },
  setTouched(touched: boolean): void;
}

interface PluginOptions {
  mapProps: (validation: ValidationProps) => Record<string, any>;
}

/**
 * The form-level validation state published via the `validation` slot prop and
 * the `update:validation` event (usable as `v-model:validation`).
 */
export interface FormValidationState {
  errors: Record<string, string | undefined>;
  values: Record<string, any>;
  isSubmitting: boolean;
  submitCount: number;
  meta: {
    valid: boolean;
    dirty: boolean;
    touched: boolean;
    pending: boolean;
    initialValues?: Record<string, any>;
  };
}

declare const VeeValidatePlugin: (opts?: Partial<PluginOptions>) => PluginFunction

export default VeeValidatePlugin
