import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";

export const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between px-10 py-5">
      <div className="flex items-center gap-2">
        {/* Fixed SVG with proper sizing */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="30" 
          height="30" 
          viewBox="0 0 256 256"
          className="h-8 w-8 flex-shrink-0"
        >
          <path 
            d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" 
            fill="#f97316"
          />
        </svg>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Standup
        </h1>
      </div>

      {/* Authentication */}
      {session?.user ? (
        <div className="flex items-center gap-3">
          {/* Profile */}
          <div className="flex items-center gap-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? "Profile"}
                className="h-8 w-8 rounded-full"
              />
            )}

            <span className="text-sm font-medium text-neutral-800">
              {session.user.name}
            </span>
          </div>

          {/* Sign out */}
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              type="submit"
              className="cursor-pointer rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              Sign out
            </Button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button
            type="submit"
            className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
          >
            Sign up with GitHub
          </button>
        </form>
      )}
    </nav>
  );
};