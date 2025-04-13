export function Auth({
  actionText,
  onSubmit,
  status,
  afterSubmit,
}: {
  actionText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: "pending" | "idle" | "success" | "error";
  afterSubmit?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-800 flex items-start justify-center p-8 my-10">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg m-4 border border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {actionText}
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-xs">
              Username
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white rounded py-2 font-black uppercase"
            disabled={status === "pending"}
          >
            {status === "pending" ? "..." : actionText}
          </button>
          {afterSubmit ? <div className="mt-4">{afterSubmit}</div> : null}
        </form>
      </div>
    </div>
  );
}
