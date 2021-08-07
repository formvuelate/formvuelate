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

declare const VeeValidatePlugin: (opts?: Partial<PluginOptions>) => PluginFunction

export default VeeValidatePlugin
