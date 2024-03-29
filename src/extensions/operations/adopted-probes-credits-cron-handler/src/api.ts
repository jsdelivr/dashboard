import type { OperationContext } from '@directus/extensions';
import { defineOperationApi } from '@directus/extensions-sdk';
import { assignCredits } from './actions/assign-credits.js';

export default defineOperationApi({
	id: 'adopted-probes-credits-cron-handler',
	handler: async (_operationData, context: OperationContext) => {
		const creditIds = await assignCredits(context);
		return creditIds.length ? `Created credits with ids: ${creditIds.toString()}` : 'No credits created';
	},
});
