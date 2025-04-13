import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "../hooks/useMutation";
import { Auth } from "./Auth";
import { loginFn } from "../routes/_authed";
import { signupFn } from "~/routes/signup";
import { motion } from "framer-motion";

export function Login() {
  const router = useRouter();

  const loginMutation = useMutation({
    fn: loginFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        await router.invalidate();
        router.navigate({ to: "/" });
      }
    },
  });

  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  });

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    loginMutation.mutate({
      data: {
        user: formData.get("name") as string,
        password: formData.get("password") as string,
      },
    });
  };

  const handleSignupInstead = (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData(e.currentTarget.form!);
    signupMutation.mutate({
      data: {
        name: formData.get("name") as string,
        password: formData.get("password") as string,
      },
    });
  };
  return (
    <Auth
      actionText="Login"
      status={loginMutation.status}
      onSubmit={handleLoginSubmit}
      afterSubmit={
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {loginMutation.data?.message && (
            <div className="text-red-400">{loginMutation.data.message}</div>
          )}
          {loginMutation.data?.userNotFound && (
            <div>
              <button
                className="text-blue-500 hover:underline transition"
                onClick={handleSignupInstead}
                type="button"
              >
                Sign up instead?
              </button>
            </div>
          )}
          {signupMutation.data?.error && (
            <div className="text-red-400">{signupMutation.data.message}</div>
          )}
          {signupMutation.data?.redirectUrl &&
            (window.location.href = signupMutation.data.redirectUrl)}
        </motion.div>
      }
    />
  );
}
