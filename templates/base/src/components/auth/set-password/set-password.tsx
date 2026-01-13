"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import CommonToast from "@/components/common/toast";
import Button from "@/components/pure-components/Button";
import { Form, FormGroup, FormLabel } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import { Eye, EyeOff } from "@/components/pure-components/Icons";
import ImageWithFallback from "@/components/pure-components/ImageWithFallback";
import { useSetPassword } from "@/hooks/user";
import { useToast } from "@/hooks/useToast";
import { paths } from "@/routes";
import { getPasswordStrength } from "@/utils";
import {
  createSetPasswordFormZodSchema,
  SetPasswordInputs,
} from "@/validations/schemas/auth/set-password.zod.schema";

import styles from "../auth.module.scss";

const SetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const tValidations = useTranslations("validations");
  const { toast, showSuccess, showError, hideToast } = useToast();

  const { mutateAsync: setPassword, isSuccess, isError, isPending } = useSetPassword();

  // Create Zod schema with translations
  const setPasswordFormSchema = React.useMemo(
    () => createSetPasswordFormZodSchema((key) => tValidations(key)),
    [tValidations],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetPasswordInputs>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = watch("password");
  const passwordStrength = getPasswordStrength(password, tAuth);

  const onSubmit: SubmitHandler<SetPasswordInputs> = async (data) => {
    try {
      await setPassword({ password: data.password, token });
      showSuccess(tAuth("setPassword.success"));
      // Redirect to dashboard after successful password setting
      router.push(paths.DASHBOARD);
    } catch (error: any) {
      showError(error?.message || tAuth("setPassword.error.failed"));
    }
  };

  // Handle success state
  if (isSuccess) {
    return (
      <>
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
              <h1 className={styles.title}>{tAuth("setPassword.title")}</h1>
              <p className={styles.subtitle}>{tAuth("setPassword.success")}</p>
              <Button
                variant="primary"
                onClick={() => router.push(paths.DASHBOARD)}
                className={styles.submitButton}
              >
                {t("buttons.text.continue")}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
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
            <h1 className={styles.title}>{tAuth("setPassword.title")}</h1>
            <p className={styles.subtitle}>{tAuth("setPassword.subTitle")}</p>

            {isError && (
              <div className={styles.errorMessage}>{tAuth("setPassword.error.failed")}</div>
            )}

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormLabel>{tAuth("signup.password.label")}</FormLabel>
                <div className={styles.passwordInputWrapper}>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder={tAuth("signup.password.placeholder")}
                    isInvalid={!!errors.password}
                    feedback={errors.password?.message}
                  />
                  <Button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className={`${styles.passwordToggleBtn} ${
                      showPassword ? styles.hidePassword : styles.showPassword
                    }`}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                {password && (
                  <div className={styles.passwordStrength}>
                    <span
                      className={`${styles.passwordStrengthLabel} ${
                        styles[`passwordStrength${passwordStrength}`]
                      }`}
                    >
                      {passwordStrength}
                    </span>
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <FormLabel>{tAuth("signup.confirmPassword.label")}</FormLabel>
                <div className={styles.passwordInputWrapper}>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    placeholder={tAuth("signup.confirmPassword.placeholder")}
                    isInvalid={!!errors.confirmPassword}
                    feedback={errors.confirmPassword?.message}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className={`${styles.passwordToggleBtn} ${
                      showConfirmPassword ? styles.hidePassword : styles.showPassword
                    }`}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormGroup>
              <Button
                variant="primary"
                type="submit"
                className={styles.submitButton}
                disabled={isPending}
              >
                {isPending ? t("loading.processing") : tAuth("setPassword.submit")}
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <CommonToast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />
    </>
  );
};

export default SetPassword;
