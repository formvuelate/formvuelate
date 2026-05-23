import { PluginFunction } from 'formvuelate'
import { Component } from 'vue'

interface PluginOptions {
  mapComponents: Record<string, string | Component>;
  mapProps: Record<string, any> | ((el: Record<string, any>) => Record<string, any>);
  preserveMappedProps: boolean;
}

declare const LookupPlugin: (opts?: Partial<PluginOptions>) => PluginFunction

export default LookupPlugin

/**
 * Signal nested SchemaForm elements to use the plugin-enhanced SchemaForm.
 * Call inside setup with the component returned by SchemaFormFactory.
 */
export declare function lookupSubSchemas(SchemaFormWithPlugins: Component): void;

/**
 * Map every element in each row of a (2D) schema with the given function.
 */
export declare function mapElementsInSchema<T = Record<string, any>>(
  schema: T[][],
  fn: (el: T) => T
): T[][];
