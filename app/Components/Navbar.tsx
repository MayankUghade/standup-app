import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";

export const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="px-[80px] flex items-center justify-between px-10 py-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
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
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? "Profile"}
                className="h-9 w-9 rounded-full border border-[#e5ded3]"
              />
            )}

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">
                {session.user.name}
              </p>
              <p className="text-xs text-[#78716c]">
                {session.user.email}
              </p>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-[#d6cec2] px-4 py-2 text-sm font-medium text-[#57534e] transition hover:bg-[#f0ebe4]"
              >
                Sign out
              </button>
            </form>
          </div>
      ) : (
        <form
          action={async () => {
            "use server";
                await signIn("github", {
      redirectTo: "/dashboard",
    });
          }}
        >
          <button
            type="submit"
            className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 cursot-pointer"
          >
            Sign up with GitHub
          </button>
        </form>
      )}
    </nav>
  );
};