import { BaseSchemaReturns } from "./schema";

export type PluginFunction = (
  baseReturns: BaseSchemaReturns
) => BaseSchemaReturns;
