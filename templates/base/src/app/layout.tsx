
import "@assets/scss/global.scss";

import { messages } from "@locales";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import type { PropsWithChildren } from "react";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Modern admin dashboard template",
};

export default async function RootLayout({
  children,
}: PropsWithChildren) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  const colorScheme = theme === "dark" ? "dark" : "light";

  return (
    <html lang={locale} className={theme} style={{ colorScheme }}>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages[locale as keyof typeof messages]}
        >
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
