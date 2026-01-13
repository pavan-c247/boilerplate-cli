import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import styles from "../../components/web/web.module.scss";
import WebFooter from "../../components/web/WebFooter";
import WebHeader from "../../components/web/WebHeader";

export const metadata: Metadata = {
  title: "Web Pages",
  description: "Web page template",
};

export default function ViewLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className={styles["web-layout"]}>
      <WebHeader />
      <main className={styles["web-main-content"]}>{children}</main>
      <WebFooter />
    </div>
  );
}
