import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";

import type { Preview } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import React from "react";

import { messages } from "../locales";
// import "@/src/assets/scss/globals.scss";

// Flatten the messages for react-intl
const flattenMessages = (
  nestedMessages: any,
  prefix = ""
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key in nestedMessages) {
    const value = nestedMessages[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      result[newKey] = value;
    } else if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenMessages(value, newKey));
    }
  }

  return result;
};

const flatMessages = flattenMessages(messages.en);

// Create a QueryClient instance for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      // Enable the "Show Code" feature
      source: {
        state: "open",
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider
          locale="en"
          messages={flatMessages}
          onError={(err) => {
            console.error("IntlProvider error:", err);
          }}
        >
          <Story />
        </NextIntlClientProvider>
      </QueryClientProvider>
    ),
  ],
};

export default preview;
