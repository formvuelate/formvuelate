import { ComputedRef, DefineComponent } from "vue";

export interface FieldSchema extends Record<string, any> {
  component: DefineComponent;
}

export interface FieldSchemaWithModel extends FieldSchema {
  model: any;
}

export type FormArraySchema = FieldSchemaWithModel[];

export type FormObjectSchema = Record<string, FieldSchema>;

export interface BaseSchemaReturns {
  behaveLikeParentSchema: ComputedRef<boolean>;
  parsedSchema: ComputedRef<FormArraySchema[]>;
  hasParentSchema: boolean;
  formBinds: ComputedRef<Record<string, any>>;
  slotBinds: ComputedRef<Record<string, any>>;
}
