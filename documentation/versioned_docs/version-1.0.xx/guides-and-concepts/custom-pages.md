---
id: custom-pages
title: Custom Pages
---

import basic from '@site/static/img/guides-and-concepts/custom-pages/basic.png'
import gif from '@site/static/img/guides-and-concepts/custom-pages/gif.gif'

refine allows us to add custom pages to our application. To do this, it is necessary to create an object array with [react-router-dom](https://reactrouter.com/web/api/Route) `<Route>` properties. Then, pass this array as `routes` property in the `<Refine>` component.

## Public Custom Pages

Allows creating custom pages that everyone can access via path.

```tsx title="src/App.tsx" {3, 8-14}
import { Refine } from "@pankod/refine";

import { CustomPage } from "pages/custom-page";

const App = () => {
    return (
        <Refine
            routes={[
                {
                    exact: true,
                    component: CustomPage,
                    path: "/custom-page",
                },
            ]}
        >
            ...
        </Refine>
    );
};

export default App;
```

Everyone can access this page via `/custom-page` path.

## Authenticated Custom Pages

Allows creating custom pages that only authenticated users can access via path.

```tsx title="src/App.tsx" {1-3, 5-22, 24-30, 39}
import { Refine, Authenticated, AuthProvider } from "@pankod/refine";

import { CustomPage } from "pages/custom-page";

const authProvider: AuthProvider = {
    login: (params: any) => {
        if (params.username === "admin") {
            localStorage.setItem("username", params.username);
            return Promise.resolve();
        }

        return Promise.reject();
    },
    logout: () => {
        localStorage.removeItem("username");
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () =>
        localStorage.getItem("username") ? Promise.resolve() : Promise.reject(),
    getPermissions: () => Promise.resolve(["admin"]),
};

const AuthenticatedCustomPage = () => {
    return (
        <Authenticated>
            <CustomPage />
        </Authenticated>
    );
};

const App = () => {
    return (
        <Refine
            authProvider={authProvider}
            routes={[
                {
                    exact: true,
                    component: AuthenticatedCustomPage,
                    path: "/custom-page",
                },
            ]}
        >
            ...
        </Refine>
    );
};

export default App;
```

Only authenticated users can access this page via `/custom-page` path.

:::caution attention
For authenticated custom page, your application needs an `authProvider`.

[Refer to the `authProvider` for more detailed information. &#8594](/api-references/providers/auth-provider.md)

:::

:::info
By default, custom pages don't have any layout. If you want to show your custom page in a layout, you can use `<LayoutWrapper>` component.

[Refer to the `<LayoutWrapper>` for more detailed information. &#8594](/api-references/components/layout-wrapper.md)
:::

## Example

Let's make a custom page for posts. On this page, the editor can approve or reject the posts with the "draft" status.

Before starting the example, let's assume that our [`dataProvider`](/api-references/providers/data-provider.md) has an endpoint that returns posts as following.

```ts title="https://api.fake-rest.refine.dev/posts"
{
    [
        {
            id: 1,
            title: "Dolorem suscipit assumenda laborum id facilis maiores.",
            content:
                "Non et asperiores dolores. Vero quas natus sed ut iste omnis sequi. Enim veniam soluta vel. Est soluta suscipit velit architecto et. Tenetur ea impedit alias rerum in tenetur. Aut tempore consequatur ipsa neque aspernatur sit. Ut ea aspernatur aut voluptatem. Nulla quos laboriosam molestiae impedit eius. Dicta est maxime fuga debitis. Dicta necessitatibus odit quis qui animi.",
            category: {
                id: 32,
            },
            status: "draft",
        },
        {
            id: 2,
            title: "Voluptatibus laboriosam dignissimos non.",
            content:
                "Dolor cumque blanditiis aspernatur earum quo autem voluptatem vel consequuntur. Consequatur et sed dolores rerum ipsam aut et sed. Nostrum provident voluptas facere distinctio voluptates in et. Magni asperiores quod unde tempore veritatis beatae qui cum officia. Omnis quia cumque et qui. Quis et explicabo et similique voluptatum. Culpa assumenda autem laborum impedit perspiciatis ducimus perferendis. Quo doloribus magnam perferendis doloremque voluptas libero autem. Nihil enim aliquam molestias aspernatur impedit. Ad eius qui sit et.",
            category: {
                id: 22,
            },
            status: "draft",
        },
        // ...
    ];
}
```

First, we will create the post's CRUD pages and bootstrap the app.

```tsx title="src/App.tsx"
import { Refine } from "@pankod/refine";
import dataProvider from "@pankod/refine-simple-rest";
import "@pankod/refine/dist/styles.min.css";

import { PostList, PostCreate, PostEdit, PostShow } from "pages/posts";

const App = () => {
    return (
        <Refine dataProvider={dataProvider("https://api.fake-rest.refine.dev")}>
            <Resource
                name="posts"
                list={PostList}
                create={PostCreate}
                edit={PostEdit}
                show={PostShow}
            />
        </Refine>
    );
};

export default App;
```

Now, let's create the custom page with the name `<PostReview>`. We will use the properties of `useList`, `filter` and `pagination` to fetch a post with "draft" status.

[Refer to the `useList` documentation for detailed usage. &#8594](/api-references/hooks/data/useList.md)

```tsx  title="src/pages/post-review.tsx"
import { useList } from "@pankod/refine";

const PostReview = () => {
    const { data, isLoading } = useList<IPost>({
        resource: "posts",
        config: {
            filters: [
                {
                    field: "status",
                    operator: "eq",
                    value: "draft",
                },
            ],
            pagination: { pageSize: 1 },
        },
    });
};

interface ICategory {
    id: string;
    title: string;
}

interface IPost {
    id: string;
    title: string;
    content: string;
    status: "published" | "draft" | "rejected";
    category: ICategory;
}
```

<br/>

We set the filtering process with `filters` then page size set with `pagination` to return only one post.

Post's category is relational. So we will use the post's category "id" to get the category title. Let's use `useOne` to fetch the category we want.

```tsx  title="src/pages/post-review.tsx" {1, 18-27}
import { useList, useOne } from "@pankod/refine";

export const PostReview = () => {
    const { data, isLoading } = useList<IPost>({
        resource: "posts",
        config: {
            filters: [
                {
                    field: "status",
                    operator: "eq",
                    value: "draft",
                },
            ],
            pagination: { pageSize: 1 },
        },
    });

    const post = data?.data[0];

    const { data: categoryData, isLoading: categoryIsLoading } =
        useOne<ICategory>({
            resource: "categories",
            id: post!.category.id,
            queryOptions: {
                enabled: !!post,
            },
        });
};
```

Now we have the data to display the post as we want. Let's use the `<Show>` component of refine to show this data.

:::tip
`<Show>` component is not required, you are free to display the data as you wish.
:::

```tsx  title="src/pages/post-review.tsx" {2-4, 10, 38-55}
import {
    Typography,
    Show,
    MarkdownField,
    useOne,
    useList,
} from "@pankod/refine";

const { Title, Text } = Typography;

export const PostReview = () => {
    const { data, isLoading } = useList<IPost>({
        resource: "posts",
        config: {
            filters: [
                {
                    field: "status",
                    operator: "eq",
                    value: "draft",
                },
            ],
            pagination: { pageSize: 1 },
        },
    });
    const record = data?.data[0];

    const { data: categoryData, isLoading: categoryIsLoading } =
        useOne<ICategory>({
            resource: "categories",
            id: record!.category.id,
            queryOptions: {
                enabled: !!record,
            },
        });

    return (
        <Show
            title="Review Posts"
            resource="posts"
            recordItemId={record?.id}
            isLoading={isLoading || categoryIsLoading}
            pageHeaderProps={{
                backIcon: false,
            }}
        >
            <Title level={5}>Status</Title>
            <Text>{record?.status}</Text>
            <Title level={5}>Title</Title>
            <Text>{record?.title}</Text>
            <Title level={5}>Category</Title>
            <Text>{categoryData?.data.title}</Text>
            <Title level={5}>Content</Title>
            <MarkdownField value={record?.content} />
        </Show>
    );
};
```

Then, pass this `<PostReview>` as the routes property in the `<Refine>` component:

```tsx title="src/App.tsx" {7, 13-19}
import { Refine } from "@pankod/refine";
import dataProvider from "@pankod/refine-simple-rest";
import "@pankod/refine/dist/styles.min.css";

import { PostList, PostCreate, PostEdit, PostShow } from "pages/posts";

import { PostReview } from "pages/post-review";

const App = () => {
    return (
        <Refine
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            routes={[
                {
                    exact: true,
                    component: PostReview,
                    path: "/post-review",
                },
            ]}
        >
            <Resource
                name="posts"
                list={PostList}
                create={PostCreate}
                edit={PostEdit}
                show={PostShow}
            />
        </Refine>
    );
};

export default App;
```

Now our page looks like this:

<div class="img-container">
    <div class="window">
        <div class="control red"></div>
        <div class="control orange"></div>
        <div class="control green"></div>
    </div>
    <img src={basic} alt="A custom page" />
</div>
<br />

Now let's put in approve and reject buttons to change the status of the post shown on the page. When these buttons are clicked, we will change the status of the post using `useUpdate`.

[Refer to the `useUpdate` documentation for detailed usage. &#8594](/api-references/hooks/data/useUpdate.md)

```tsx  title="src/pages/post-review.tsx" {5-6, 39, 41, 43-45, 47, 58-82}
import {
    Typography,
    Show,
    MarkdownField,
    Space,
    Button,
    useOne,
    useList,
    useUpdate,
} from "@pankod/refine";

const { Title, Text } = Typography;

export const PostReview = () => {
    const { data, isLoading } = useList<IPost>({
        resource: "posts",
        config: {
            filters: [
                {
                    field: "status",
                    operator: "eq",
                    value: "draft",
                },
            ],
            pagination: { pageSize: 1 },
        },
    });
    const record = data?.data[0];

    const { data: categoryData, isLoading: categoryIsLoading } =
        useOne<ICategory>({
            resource: "categories",
            id: record!.category.id,
            queryOptions: {
                enabled: !!record,
            },
        });

    const mutationResult = useUpdate<IPost>();

    const { mutate, isLoading: mutateIsLoading } = mutationResult;

    const handleUpdate = (item: IPost, status: string) => {
        mutate({ resource: "posts", id: item.id, values: { ...item, status } });
    };

    const buttonDisabled = isLoading || categoryIsLoading || mutateIsLoading;

    return (
        <Show
            title="Review Posts"
            resource="posts"
            recordItemId={record?.id}
            isLoading={isLoading || categoryIsLoading}
            pageHeaderProps={{
                backIcon: false,
            }}
            actionButtons={
                <Space
                    key="action-buttons"
                    style={{ float: "right", marginRight: 24 }}
                >
                    <Button
                        danger
                        disabled={buttonDisabled}
                        onClick={() =>
                            record && handleUpdate(record, "rejected")
                        }
                    >
                        Reject
                    </Button>
                    <Button
                        type="primary"
                        disabled={buttonDisabled}
                        onClick={() =>
                            record && handleUpdate(record, "published")
                        }
                    >
                        Approve
                    </Button>
                </Space>
            }
        >
            <Title level={5}>Status</Title>
            <Text>{record?.status}</Text>
            <Title level={5}>Title</Title>
            <Text>{record?.title}</Text>
            <Title level={5}>Category</Title>
            <Text>{categoryData?.data.title}</Text>
            <Title level={5}>Content</Title>
            <MarkdownField value={record?.content} />
        </Show>
    );
};
```

<div class="img-container">
    <div class="window">
        <div class="control red"></div>
        <div class="control orange"></div>
        <div class="control green"></div>
    </div>
    <img src={gif} alt="A custom page in action" />
</div>
<br />

## Live Codesandbox Example

<iframe src="https://codesandbox.io/embed/custom-pages-example-956pz?autoresize=1&fontsize=14&module=%2Fsrc%2FApp.tsx&theme=dark&view=preview"
    style={{width: "100%", height:"80vh", border: "0px", borderRadius: "8px", overflow:"hidden"}}
    title="custom-pages-example"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
