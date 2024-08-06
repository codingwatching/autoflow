import { BASE_URL, handleResponse, opaqueCookieHeader } from '@/lib/request';
import { z } from 'zod';

export interface RequiredBootstrapStatus {
  default_llm: boolean;
  default_embedding_model: boolean;
  datasource: boolean;
}

export interface OptionalBootstrapStatus {
  langfuse: boolean;
}

export interface BootstrapStatus {
  required: RequiredBootstrapStatus;
  optional: OptionalBootstrapStatus;
}

const requiredBootstrapStatusSchema = z.object({
  default_llm: z.boolean(),
  default_embedding_model: z.boolean(),
  datasource: z.boolean(),
});

const optionalBootstrapStatusSchema = z.object({
  langfuse: z.boolean(),
});

const bootstrapStatusSchema = z.object({
  required: requiredBootstrapStatusSchema,
  optional: optionalBootstrapStatusSchema,
});

export async function getBootstrapStatus (): Promise<BootstrapStatus> {
  return await fetch(`${BASE_URL}/api/v1/system/bootstrap-status`, {
    headers: {
      ...await opaqueCookieHeader(),
    },
  }).then(handleResponse(bootstrapStatusSchema));
}

export function isBootstrapStatusPassed (bootstrapStatus: BootstrapStatus): boolean {
  return Object.values(bootstrapStatus.required).reduce((res, flag) => res && flag, true);
}
