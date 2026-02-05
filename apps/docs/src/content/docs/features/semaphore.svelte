<script lang="ts">
	import type { Integration } from './types';

	let {
		entity,
		variant = 'default',
	}: {
		entity?: {
			value: boolean;
			stage?: number;
			link?: string;
			integration?: Integration;
		};
		variant?: 'default' | 'minimal';
	} = $props();
</script>

<span>
	{#if entity}
		{#if entity.value === true}
			✅
			{#if entity.stage !== undefined}
				Stage {entity.stage}
			{/if}
			{#if variant === 'default'}
				{#if entity.link}
					<a href={entity.link}>View</a>
				{/if}
				{#if entity.integration}
					via {entity.integration}
				{/if}
			{/if}
		{:else}
			❌
		{/if}
	{/if}
</span>
