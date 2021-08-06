import { PluginFunction } from 'formvuelate'

interface PluginOptions {
  mapComponents: Record<string, string>;
  mapProps: Record<string, any>;
  preserveMappedProps: boolean;
}

declare const LookupPlugin: (opts?: Partial<PluginOptions>) => PluginFunction

export default LookupPlugin
