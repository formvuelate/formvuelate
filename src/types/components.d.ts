import { DefineComponent, PropType } from "vue";
import { FormArraySchema, FormObjectSchema } from "./schema";

type ClassBindingValue = string | Record<string, boolean>;
type ClassBindingExpression =
  | ClassBindingValue
  | (string | Record<string, boolean>)[];

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
  nestedSchemaModel: {
    type: PropType<string>;
    default: string;
  };
  schemaRowClasses: {
    type: PropType<ClassBindingExpression>;
    default: any;
  };
}>;

declare const SchemaWizard: DefineComponent<{
  schema: {
    type: PropType<(FormObjectSchema | FormArraySchema)[]>;
    required: true;
  };
  step: {
    type: PropType<number>;
    required: true;
  };
}>;
