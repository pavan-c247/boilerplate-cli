"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import Button from "@/components/pure-components/Button";
import ImageWithFallback from "@/components/pure-components/ImageWithFallback";
import LoadingSpinner from "@/components/pure-components/LoadingSpinner";
import { useVerifyEmailMutation } from "@/hooks/auth";

import styles from "../auth.module.scss";

const EmailVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const t = useTranslations("verify");
  const tCommon = useTranslations("common");

  const [message, setMessage] = useState<string>("");

  const {
    mutateAsync: verifyEmail,
    isSuccess,
    isError,
    isPending
  } = useVerifyEmailMutation();

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setMessage(t("messages.noTokenFound"));
        return;
      }
      verifyEmail({ token });
    };

    handleVerification();
  }, [token, verifyEmail]);

  useEffect(() => {
    if (isSuccess) {
      setMessage(t("messages.success.emailVerify"));
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else if (isError) {
    }
  }, [isSuccess, isError, router]);

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const handleGoToSignup = () => {
    router.push("/signup");
  };

  if (isPending) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.cardContent}>
            <div className={styles.logoContainer}>
              <ImageWithFallback
                src="/logo.svg"
                alt="Company Logo"
                width={48}
                height={48}
                priority
              />
            </div>
            <LoadingSpinner />
            <h1 className={styles.title}>{t("messages.verifying")}</h1>
            <p className={styles.subtitle}>{t("messages.processing")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.cardContent}>
          <div className={styles.logoContainer}>
            <ImageWithFallback
              src="/logo.svg"
              alt="Company Logo"
              width={48}
              height={48}
              priority
            />
          </div>

          {isSuccess && (
            <>
              <div className={styles.successIcon}>✓</div>
              <h1 className={styles.title}>{t("messages.success.verified")}</h1>
              <p className={styles.subtitle}>{message}</p>
              <Button
                variant="primary"
                onClick={handleGoToLogin}
                className={styles.submitButton}
              >
                {tCommon("buttons.text.goToLogin")}
              </Button>
            </>
          )}

          {isError ||
            (!token && (
              <>
                <div className={styles.errorIcon}>!</div>
                <h1 className={styles.title}>No Token Found</h1>
                <p className={styles.subtitle}>{message}</p>
                <div className={styles.errorActions}>
                  <Button
                    variant="primary"
                    onClick={handleGoToSignup}
                    className={styles.submitButton}
                  >
                    {tCommon("buttons.text.signUpAgain")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleGoToLogin}
                    className={styles.secondaryButton}
                  >
                    {tCommon("buttons.text.goToLogin")}
                  </Button>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
