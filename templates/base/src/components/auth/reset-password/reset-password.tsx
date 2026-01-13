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
import { useResetPassword } from "@/hooks/auth";
import { useToast } from "@/hooks/useToast";
import { paths } from "@/routes";
import { createResetPasswordFormZodSchema, ResetPasswordInputs } from "@/validations/schemas/auth/reset-password.zod.schema";

import styles from "../auth.module.scss";

const ResetPassword = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tValidations = useTranslations('validations');
  const { toast, showSuccess, showError, hideToast } = useToast();

  const { mutateAsync: resetPassword ,isSuccess ,isError, isPending} = useResetPassword();

  // Create Zod schema with translations
  const resetPasswordFormSchema = React.useMemo(
    () => createResetPasswordFormZodSchema((key) => tValidations(key)),
    [tValidations]
  );

  const {
    register,
    handleSubmit,
    formState: { errors},
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    if (!token) {
      showError(tAuth('resetPassword.error.noTokenFound'));
      return;
    }
    try {
      await resetPassword({ token, password: data.password });
      showSuccess(tAuth('resetPassword.success'));
    } catch (error: any) {
      showError(error?.message || tAuth('resetPassword.error.failed'));
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
              <h1 className={styles.title}>{tAuth('resetPassword.title')}</h1>
              <p className={styles.subtitle}>
                {tAuth('resetPassword.success')}
              </p>
              <Button
                variant="primary"
                onClick={() => router.push(paths.LOGIN)}
                className={styles.submitButton}
              >
                {t('buttons.text.goToLogin')}
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
            <h1 className={styles.title}>{tAuth('resetPassword.title')}</h1>
            <p className={styles.subtitle}>{tAuth('resetPassword.subTitle')}</p>

            {isError && (
              <div className={styles.errorMessage}>
                {tAuth('resetPassword.error.failed')}
              </div>
            )}
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormLabel>{tAuth('signup.password.label')}</FormLabel>
                <div style={{ position: "relative" }}>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder={tAuth('signup.password.placeholder')}
                    isInvalid={!!errors.password}
                    feedback={errors.password?.message}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "#888",
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormGroup>
              <FormGroup>
                <FormLabel>{tAuth('signup.confirmPassword.label')}</FormLabel>
                <div style={{ position: "relative" }}>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder={tAuth('signup.confirmPassword.placeholder')}
                    isInvalid={!!errors.confirmPassword}
                    feedback={errors.confirmPassword?.message}
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "#888",
                    }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </FormGroup>
              <Button
                variant="primary"
                type="submit"
                className={styles.submitButton}
                disabled={isPending}
              >
                {isPending ? t('loading.processing') : tAuth('signup.submit')}
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

export default ResetPassword;
