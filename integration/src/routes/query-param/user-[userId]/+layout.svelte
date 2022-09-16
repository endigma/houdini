<script lang="ts">
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { GQL_Page_User } from '$houdini';
  import Loading from '../Loading.svelte';
  import UserName from '../UserName.svelte';

  // TODO
  //   +layout.gql ???
  //   import type { LayoutData } from './$houdini'; ???

  // import type { LayoutData } from './$types';
  // export let data: LayoutData;
  // $: ({ Page_User } = data);

  // TODO: For what ever reason, sometimes in client side navigation, I get 2 Page_User query... But not always!

  $: browser && GQL_Page_User.fetch({ variables: { userId: $page.params['userId'] } });

  function TabLinkKeepingContext(id: string, url: URL) {
    const parts = url.pathname.split('/');
    return `../user-${id}/${parts[parts.length - 1]}?${url.searchParams.toString()}`;
  }
</script>

Pages 👉
<a href={TabLinkKeepingContext('1', $page.url)}>user-1</a>
<a href={TabLinkKeepingContext('2', $page.url)}>user-2</a>
<a href={TabLinkKeepingContext('3', $page.url)}>user-3</a>

<hr />
<h3>Page User</h3>
<UserName user={$GQL_Page_User.data?.user} />

<hr />

Tabs 👉
<a href="./birth">Birth</a>
<a href="./fiends">Fiends</a>
<a href="./fiends?size=3">Fiends (top 3)</a>

<hr />

<slot />
