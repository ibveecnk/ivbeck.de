// app/routes/__root.tsx
import type { ReactNode } from "react";
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "~/utils/session";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  // for cookies to be secure we need to auth on the server
  const session = await useAppSession();

  if (!session.data.userName) {
    return null;
  }

  return {
    userName: session.data.userName,
  };
});

type RouterContext = {};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "ivbeck.de",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => {
    // preload the user
    const user = await fetchUser();

    return {
      user,
    };
  },
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { user } = Route.useRouteContext();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link
            to="/posts"
            activeProps={{
              className: "font-bold",
            }}
          >
            Posts
          </Link>
          <div className="ml-auto">
            {user ? (
              <>
                <span className="mr-2">{user.userName}</span>
                <Link to="/logout">Logout</Link>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
