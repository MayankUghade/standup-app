import { auth, signIn } from "@/auth";

export const Navbar = async () => {
    const session = await auth()
    console.log(session)
  return (
    <nav className="flex items-center justify-between border-b border-neutral-800 px-5 py-6">
      {/* Logo */}
      <h1 className="text-lg font-semibold tracking-tight">
        standup
      </h1>

      {/* GitHub Sign Up */}
      <button onClick={async () => {
        "use server"
        await signIn("github")
      }} className="flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium transition hover:bg-white/10 cursor-pointer">
        <span>Sign up with GitHub</span>
      </button>
    </nav>
  );
};