import { evaluateVisaAlerts } from "../services/visaAlert.service.js";

export async function runVisaAlerts() {
  await evaluateVisaAlerts();
}
