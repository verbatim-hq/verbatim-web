import { SignIn } from "@clerk/nextjs";

import { Wordmark } from "@/components/brand/wordmark";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Google OAuth only — disable password / other social providers in the Clerk
 * Dashboard (User & Authentication → Social connections) so this surface never
 * offers alternatives to "Continue with Google".
 */
export default function SignInPage() {
  return (
    <main className="relative z-[1] flex min-h-screen flex-col items-center justify-center gap-8 px-8 py-16">
      <Wordmark />

      <Card className="w-full max-w-md border-[var(--border)] shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-[28px] font-normal tracking-tight">
            Sign in to Verbatim
          </CardTitle>
          <CardDescription className="text-[15px] leading-relaxed">
            Private preview · Use your Google workspace or personal account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-10">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "var(--color-blue)",
                colorBackground: "var(--bg-elevated)",
                colorInputBackground: "var(--bg)",
                colorText: "var(--text)",
                colorTextSecondary: "var(--text-soft)",
                colorNeutral: "var(--border)",
                borderRadius: "10px",
                fontFamily: "var(--sans)",
              },
              elements: {
                card: "shadow-none border border-[var(--border)] bg-[var(--bg-elevated)]",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "min-h-10 border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--bg-hover)]",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-[var(--border)]",
                dividerText: "text-[var(--text-faint)]",
                footer: "hidden",
                formFieldInputShowPasswordButton: "hidden",
              },
            }}
            forceRedirectUrl="/projects"
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-in"
          />
        </CardContent>
      </Card>
    </main>
  );
}
