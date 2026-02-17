<script lang="ts">
	import type { Entity } from './types';

	let {
		entity,
		variant = 'default',
	}: {
		entity?: Entity;
		variant?: 'default' | 'details';
	} = $props();
</script>

<span>
	{#if entity}
		{#if entity.value === true}
			✅
			{#if variant === 'details'}
				{#if entity.stage !== undefined}
					Stage {entity.stage}
				{/if}
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
