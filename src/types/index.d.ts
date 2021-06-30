import { DefineComponent } from "vue";
import { PluginFunction } from "./plugins";

export declare function useSchemaForm<
  TValues extends Record<string, any> = Record<string, any>
>(initialFormValues?: TValues): { formModel: TValues };

export declare function SchemaFormFactory(
  plugins?: PluginFunction[],
  components?: Record<string, DefineComponent>
): DefineComponent;

// export all the types
export * from "./plugins";
export * from "./schema";
export * from "./components";
