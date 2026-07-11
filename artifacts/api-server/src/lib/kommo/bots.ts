import { kommoRequest } from "./client";

export async function runSalesbot(botId: number, leadId: number): Promise<void> {
  await kommoRequest({
    method: "POST",
    path: `/bots/${botId}/run`,
    body: {
      entity_id: leadId,
      entity_type: "leads",
    },
  });
}
