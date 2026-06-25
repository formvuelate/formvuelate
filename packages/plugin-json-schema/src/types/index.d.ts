import { PluginFunction } from 'formvuelate'
import { Component } from 'vue'

/** A loose JSON Schema node (draft-07 / 2020-12). */
export type JsonSchemaNode = Record<string, any>

/** A converted FormVueLate field. */
export type FvlField = Record<string, any>

/** Validator function compatible with vee-validate's `useField`. */
export type ValidatorFn = (value: any) => true | string

/** Messages used when building validators, with {label}/{min}/{max} interpolation. */
export interface ValidationMessages {
  required?: string;
  minLength?: string;
  maxLength?: string;
  minimum?: string;
  maximum?: string;
  exclusiveMinimum?: string;
  exclusiveMaximum?: string;
  pattern?: string;
  email?: string;
  uri?: string;
  integer?: string;
  enum?: string;
  minItems?: string;
  maxItems?: string;
}

export interface JsonSchemaPluginOptions {
  /** Maps a logical key (type/`object`/`array`/`enum`) to a component name or component. */
  components: Record<string, string | Component>;
  /** Takes precedence over `components`; return a falsy value to fall back to defaults. */
  mapComponent: (node: JsonSchemaNode, ctx: { name: string; type?: string; format?: string }) => string | Component | undefined | null;
  /** Maps a string `format` to a component, overriding the type default. */
  formatComponents: Record<string, string | Component>;
  /** Remaps the emitted prop keys (e.g. `{ hint: 'description', inputType: 'type', options: 'options' }`). */
  propNames: Record<string, string>;
  /** Whether to attach a `validations` function per field. Defaults to `true`. */
  includeValidations: boolean;
  /** Custom validation messages. */
  messages: ValidationMessages;
}

/** Convert a JSON Schema into a FormVueLate (object form) schema. */
export declare function convertJsonSchema(
  jsonSchema: JsonSchemaNode,
  options?: Partial<JsonSchemaPluginOptions>
): Record<string, FvlField>;

/** Build a synchronous validator function from a JSON Schema node's constraints. */
export declare function buildValidations(
  node: JsonSchemaNode,
  ctx?: { required?: boolean; label?: string; messages?: ValidationMessages }
): ValidatorFn | undefined;

declare const JsonSchemaPlugin: (options?: Partial<JsonSchemaPluginOptions>) => PluginFunction

export default JsonSchemaPlugin
