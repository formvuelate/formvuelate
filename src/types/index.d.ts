import { Component } from "vue";
import { PluginFunction } from "./plugins";
import { SchemaForm } from "./components";

export declare function useSchemaForm<
  TValues extends Record<string, any> = Record<string, any>
>(initialFormValues?: TValues): { formModel: TValues };

export declare function SchemaFormFactory(
  plugins?: PluginFunction[],
  components?: Record<string, Component>
): typeof SchemaForm;

// export all the types
export * from "./plugins";
export * from "./schema";
export * from "./components";
