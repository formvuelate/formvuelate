import { DefineComponent, PropType, Component, ComputedRef } from 'vue'

export interface FieldSchema extends Record<string, any> {
  component: Component | string;
}

export interface FieldSchemaWithModel extends FieldSchema {
  model: string;
}

export type FormArraySchema = FieldSchemaWithModel[];

export type FormObjectSchema = Record<string, FieldSchema>;

interface PluginExtensionFunctions {
  extendFormProps(extendedProps: Record<string, any>): void;
}

export type PluginExtenderFunction = (extensions: PluginExtensionFunctions) => unknown;

export interface BaseSchemaReturns {
  behaveLikeParentSchema: ComputedRef<boolean>;
  parsedSchema: ComputedRef<FormArraySchema[]>;
  hasParentSchema: boolean;
  formBinds: ComputedRef<Record<string, any>>;
  slotBinds: ComputedRef<Record<string, any>>;
}

export declare function useSchemaForm<
  TValues extends Record<string, any> = Record<string, any>
>(initialFormValues?: TValues): { formModel: TValues };

export type PluginFunction = { extend?: PluginExtenderFunction } & ((
  baseReturns: BaseSchemaReturns
) => BaseSchemaReturns);

export declare function SchemaFormFactory(
  plugins?: PluginFunction[],
  components?: Record<string, Component>
): typeof SchemaForm;

export type SlotBinds = Record<string, any>;

// export all the types

type ClassBindingValue = string | Record<string, boolean>;

type ClassBindingExpression =
  | ClassBindingValue
  | (string | Record<string, boolean>)[];

interface FormSlots {
  // eslint-disable-next-line camelcase
  __VLS_slots: {
    beforeForm: SlotBinds;
    afterForm: SlotBinds;
  };
}

declare const SchemaForm: DefineComponent<{
  schema: {
    type: PropType<FormObjectSchema | FormArraySchema>;
    default: any;
  };
  sharedConfig: {
    type: ObjectConstructor;
    default: any;
  };
  preventModelCleanupOnSchemaChange: {
    type: PropType<boolean>;
    default: boolean;
  };
  schemaRowClasses: {
    type: PropType<ClassBindingExpression>;
    default: any;
  };
}> &
  FormSlots

// eslint-disable-next-line no-unused-vars
declare const SchemaWizard: DefineComponent<{
  schema: {
    type: PropType<(FormObjectSchema | FormArraySchema)[]>;
    required: true;
  };
  step: {
    type: PropType<number>;
    required: true;
  };
}> &
  FormSlots

export declare function definePlugin(plugin: PluginFunction | { setup: PluginFunction, extend: PluginExtenderFunction }): PluginFunction;
