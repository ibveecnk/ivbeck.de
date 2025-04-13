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
import { motion } from "framer-motion";

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
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
        <div className="p-4 bg-gray-800 text-white shadow-md fixed top-0 left-0 right-0 z-50">
          <nav className="flex justify-between items-center">
            <span className="font-semibold">Iven Beck</span>
            <div className="flex space-x-6">
              <Link
                to="/"
                activeProps={{
                  className: "font-bold underline",
                }}
                activeOptions={{ exact: true }}
                className="hover:opacity-80 transition"
              >
                Home
              </Link>
              <Link
                to="/posts"
                activeProps={{
                  className: "font-bold underline",
                }}
                className="hover:opacity-80 transition"
              >
                Posts
              </Link>
            </div>
          </nav>
        </div>
        <div className="flex-grow flex items-center justify-center py-10">
          {children}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
