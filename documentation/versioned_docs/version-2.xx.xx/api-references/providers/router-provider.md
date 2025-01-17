---
id: router-provider
title: Router Provider
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

**refine** needs some router functions to create resource pages, navigate, etc. This provider allows you to use the router library you want.

A router provider must include the following methods:

```tsx
const routerProvider = {
    useHistory: () => {
        push: (...args) => any,
        replace: (...args) => any,
        goBach: (...args) => any,
    },
    useLocation: () => {
        pathname: string,
        search: string,
    },
    useParams: <Params extends { [K in keyof Params]?: string } = {}>() => Params,
    Prompt: React.FC<PromptProps*>,
    Link: React.FC<any>,
    RouterComponent?: React.FC<any>,
};
```

> `*`: Too see &#8594 [`<PromptProps>`](/api-references/interfaces.md#promptprops)

:::info

**refine** includes many out-of-the-box router providers to use in your projects like

-   [react-router][react-router]
-   [nextjs-router][nextjs-router]

:::

:::tip

We do not recommend creating this provider unless you do not need any customization on the router. Instead, you can use [nextjs-router][nextjs-router] for your [Next.js](https://nextjs.org/) app and [react-router][react-router] for your [react](https://en.reactjs.org/) app.

:::

## Usage

To activate router provider in **refine**, we have to pass the `routerProvider` to the `<Refine />` component.

<Tabs
defaultValue="react"
values={[
{label: 'react-router', value: 'react'},
{label: 'nextjs-router', value: 'nextjs'}
]}>
<TabItem value="react">

```tsx title="App.tsx"
import { Refine } from "@pankod/refine";
import routerProvider from "@pankod/refine-react-router";

const App: React.FC = () => {
    return <Refine routerProvider={routerProvider} />;
};
```

  </TabItem>
    <TabItem value="nextjs">

```tsx title="App.tsx"
import { Refine } from "@pankod/refine";
import routerProvider from "@pankod/refine-nextjs-router";

const App: React.FC = () => {
    return <Refine routerProvider={routerProvider} />;
};
```

  </TabItem>
</Tabs>

## Creating a router provider

The `routerProvider` methods **refine** expects are exactly the same as [react-router-dom](https://reactrouter.com/web) methods.

To understand how to create a `routerProvider`, let's examine how the [react-router][react-router] and [nextjs-router][nextjs-router] libraries provided by **refine** create a `routerProvider`.

### `useHistory`

**refine** uses `push`, `replace`, and `goBack` functions of `useHistory` for navigation.

<Tabs
defaultValue="react-useHistory"
values={[
{label: 'react-router', value: 'react-useHistory'},
{label: 'nextjs-router', value: 'nextjs-useHistory'}
]}>
<TabItem value="react-useHistory">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-next-line
import { useHistory } from "react-router-dom";

const routerProvider: IRouterProvider = {
    ...
// highlight-next-line
    useHistory,
    ...
};
```

  </TabItem>
    <TabItem value="nextjs-useHistory">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-next-line
import { useRouter } from "next/router";

const routerProvider: IRouterProvider = {
    ...
// highlight-start
    useHistory: () => {
        const router = useRouter();
        const { push, replace, back } = router;
        return {
            push,
            replace,
            goBack: back,
        };
    },
// highlight-end
    ...
};
```

  </TabItem>
</Tabs>

### `useLocation`

**refine** uses the `pathname` to find the location of the user and `search` to find the query string.

<Tabs
defaultValue="react-useLocation"
values={[
{label: 'react-router', value: 'react-useLocation'},
{label: 'nextjs-router', value: 'nextjs-useLocation'}
]}>
<TabItem value="react-useLocation">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-next-line
import { useLocation } from "react-router-dom";

const routerProvider: IRouterProvider = {
    ...
// highlight-next-line
    useLocation,
    ...
};
```

  </TabItem>
    <TabItem value="nextjs-useLocation">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-start
import { useRouter } from "next/router";
import qs from "qs";
// highlight-end

const routerProvider: IRouterProvider = {
    ...
// highlight-start
    useLocation: () => {
        const router = useRouter();
        const { pathname, query } = router;

        const queryParams = qs.stringify(query);

        return {
            pathname,
            search: queryParams && `?${queryParams}`,
        };
    },
// highlight-end
    ...
};
```

  </TabItem>
</Tabs>

### `useParams`

**refine** uses `useParams` to use action name, record id, etc. found in the route.

<Tabs
defaultValue="react-useParams"
values={[
{label: 'react-router', value: 'react-useParams'},
{label: 'nextjs-router', value: 'nextjs-useParams'}
]}>
<TabItem value="react-useParams">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-next-line
import { useParams } from "react-router-dom";

const routerProvider: IRouterProvider = {
    ...
// highlight-next-line
    useParams,
    ...
};
```

  </TabItem>
    <TabItem value="nextjs-useParams">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-next-line
import { useRouter } from "next/router";

const routerProvider: IRouterProvider = {
    ...
// highlight-start
    useParams: <Params>() => {
        const router = useRouter();

        const { query } = router;
        return query as unknown as Params;
    },
// highlight-end
    ...
};
```

  </TabItem>
</Tabs>

### `Prompt`

**refine** uses `<Prompt>` to display the alert when [warnWhenUnsavedChanges](/api-references/components/refine-config.md#warnwhenunsavedchanges) is `true`.

<Tabs
defaultValue="react-prompt"
values={[
{label: 'react-router', value: 'react-prompt'},
{label: 'nextjs-router', value: 'nextjs-prompt'}
]}>
<TabItem value="react-prompt">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-next-line
import { Prompt } from "react-router-dom";

const routerProvider: IRouterProvider = {
    ...
// highlight-next-line
    Prompt: Prompt as any,
    ...
};
```

  </TabItem>
    <TabItem value="nextjs-prompt">

```tsx title="Prompt.tsx"
import { useRouter } from "next/router";
import { useEffect } from "react";

import type { PromptProps } from "@pankod/refine";

export const Prompt: React.FC<PromptProps> = ({
    message,
    when,
    setWarnWhen,
}) => {
    const router = useRouter();

    useEffect(() => {
        const routeChangeStart = () => {
            if (when) {
                const allowTransition = window.confirm(message);
                if (allowTransition) {
                    setWarnWhen?.(false);
                } else {
                    router.events.emit("routeChangeError");
                    throw "Abort route change due to unsaved changes prompt. Ignore this error.";
                }
            }
        };
        router.events.on("routeChangeStart", routeChangeStart);

        return () => router.events.off("routeChangeStart", routeChangeStart);
    }, [when]);
    return null;
};
```

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";

// highlight-next-line
import { Prompt } from "./prompt";

const routerProvider: IRouterProvider = {
    ...
// highlight-next-line
    Prompt,
    ...
};
```

  </TabItem>
</Tabs>

### `Link`

**refine** uses `<Link>` for navigation.

<Tabs
defaultValue="react-link"
values={[
{label: 'react-router', value: 'react-link'},
{label: 'nextjs-router', value: 'nextjs-link'}
]}>
<TabItem value="react-link">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-next-line
import { Link } from "react-router-dom";

const routerProvider: IRouterProvider = {
    ...
// highlight-next-line
    Link,
    ...
};
```

  </TabItem>
    <TabItem value="nextjs-link">

```ts title="routerProvider.ts"
import { IRouterProvider } from "@pankod/refine";
// highlight-next-line
import { Link } from "next/link";

const routerProvider: IRouterProvider = {
    ...
// highlight-next-line
    Link,
    ...
};
```

  </TabItem>
</Tabs>

### `routes`

`routes` allow us to create custom pages in your **react** apps that have different paths than those defined by `resources`.

[Refer to the Custom Pages documentation for detailed information. &#8594](guides-and-concepts/custom-pages.md)

:::info

Since **Nextjs** has a file system based router built on the page concept, you can create your custom pages under the pages folder you don't need `routes` property.

:::


### `RouterComponent`

It creates the navigation routes of the **refine** app and determines how the components will be rendered on which paths.

In general, we can list what it does as follows:

-   It creates create, edit, list, show pages with paths according to the resources' own name.
-   Allows rendering of custom [`routes`](#routes) passed to `routerProviders` as properties.
-   Different routes render when the user is authenticated and not.

:::info
`RouterComponent` is required for **refine** React apps but not required for Nextjs apps.

Since Nextjs has a folder base route structure, it is used by exporting the `<NextRouteComponent>` from the created page.
:::

<br />

&#8594 [Refer to the react-router's `<RouterComponent>` for detailed usage information.][routercomponent]  
&#8594 [Refer to the nextjs-router's `<NextRouteComponent>` for detailed usage information.](https://github.com/pankod/refine/blob/master/packages/nextjs-router/src/nextRouteComponent.tsx)

## Serving the application from a subdirectory

<Tabs
defaultValue="react-subdirectory"
values={[
{label: 'React', value: 'react-subdirectory'},
{label: 'Nextjs', value: 'nextjs-subdirectory'}
]}>
<TabItem value="react-subdirectory">

If you want to serve from a subdirectory in your **refine** react app. You can use `basename` property of [`<BrowserRouter>`][browserrouter].

The [`<RouterComponent>`][routercomponent] in the [react-router][react-router] package passes all its properties to the [`<BrowserRouter>`][browserrouter] component. Therefore, a `<BrowserRouter>` property that we will give to the `<RouterComponent>` is passed to the `<BrowserRouter>` that wraps our application.

In the example below you can see how to serve the application in a subdirectory.

```tsx title="src/App.tsx"
import { Refine } from "@pankod/refine";
// highlight-next-line
import routerProvider from "@pankod/refine-react-router";
import dataProvider from "@pankod/refine-simple-rest";
import "@pankod/refine/dist/styles.min.css";

import { PostList, PostCreate, PostEdit, PostShow } from "pages/posts";

const API_URL = "https://api.fake-rest.refine.dev";

const { RouterComponent } = routerProvider;

// highlight-next-line
const CustomRouterComponent = () => <RouterComponent basename="/admin" />;

const App: React.FC = () => {
    return (
        <Refine
// highlight-start
            routerProvider={{
                ...routerProvider,
                RouterComponent: CustomRouterComponent,
            }}
// highlight-end
            dataProvider={dataProvider(API_URL)}
            resources={[
                {
                    name: "posts",
                    list: PostList,
                    create: PostCreate,
                    edit: PostEdit,
                    show: PostShow,
                },
            ]}
        />
    );
};

export default App;
```

Now you can access our application at `www.domain.com/admin`.

  </TabItem>
    <TabItem value="nextjs-subdirectory">

To serve your application from a subdirectory in your **refine** Nextjs application, simply add `basePath` to your `next.config.js` file.

```ts
module.exports = {
    basePath: "/admin",
};
```

[Refer to the `Nextjs` documentation for detailed usage information. &#8594](https://nextjs.org/docs/api-reference/next.config.js/basepath)

Now you can access our application at `www.domain.com/admin`.

  </TabItem>
</Tabs>

[browserrouter]: https://reactrouter.com/web/api/BrowserRouter
[routercomponent]: https://github.com/pankod/refine/blob/master/packages/react-router/src/routerComponent.tsx
[react-router]: https://github.com/pankod/refine/tree/master/packages/react-router
[nextjs-router]: https://github.com/pankod/refine/tree/master/packages/nextjs-router
