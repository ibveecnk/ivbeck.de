import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { hashPassword, prismaClient } from "~/utils/prisma";
import { useMutation } from "~/hooks/useMutation";
import { Auth } from "~/components/Auth";
import { useAppSession } from "~/utils/session";
import { z } from "zod";

const SignupProps = z.object({
  name: z.string().min(3),
  password: z.string().min(8),
  redirectUrl: z.string().optional(),
});

export const signupFn = createServerFn({ method: "POST" })
  .validator((user: unknown) => {
    return SignupProps.safeParse(user);
  })
  .handler(async ({ data }) => {
    // Check if the data is valid
    if (!data.success) {
      return {
        error: true,
        message: data.error.errors.map((err) => err.message).join(", "),
      };
    }

    const safeData = data.data!;
    const session = await useAppSession();

    // Check if the user already exists
    const found = await prismaClient.user.findUnique({
      where: {
        name: safeData.name,
      },
    });

    const password = await hashPassword(safeData.password);

    if (found) {
      if (found.password !== password) {
        return {
          error: true,
          userExists: true,
          message: "User already exists with a different password.",
        };
      }

      // Store the user's name in the session
      await session.update({
        userName: found.name,
      });

      return {
        error: false,
        redirectUrl: safeData.redirectUrl || "/",
      };
    }

    // Create the user
    const user = await prismaClient.user.create({
      data: {
        name: safeData.name,
        password,
      },
    });

    // Store the user's name in the session
    await session.update({
      userName: user.name,
    });

    return {
      error: false,
      redirectUrl: safeData.redirectUrl || "/",
    };
  });

export const Route = createFileRoute("/signup")({
  component: SignupComp,
});

function SignupComp() {
  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  });

  return (
    <Auth
      actionText="Sign Up"
      status={signupMutation.status}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        signupMutation.mutate({
          data: {
            name: formData.get("name") as string,
            password: formData.get("password") as string,
            redirectUrl:
              new URLSearchParams(window.location.search).get("redirect") ||
              "/",
          },
        });
      }}
      afterSubmit={
        signupMutation.data?.error ? (
          <div className="text-red-400">{signupMutation.data.message}</div>
        ) : signupMutation.data?.redirectUrl ? (
          (window.location.href = signupMutation.data.redirectUrl)
        ) : null
      }
    />
  );
}
