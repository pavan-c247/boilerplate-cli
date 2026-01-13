"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import CommonToast from "@/components/common/toast";
import Button from "@/components/pure-components/Button";
import { Form, FormGroup, FormLabel } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import ImageWithFallback from "@/components/pure-components/ImageWithFallback";
import { useForgotPassword } from "@/hooks/auth";
import { useToast } from "@/hooks/useToast";

import styles from "../auth.module.scss";

export type ForgotPasswordInputs = {
  email: string;
};

const ForgotPassword = () => {
  const tAuth = useTranslations('auth');
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { mutateAsync: forgotPassword, isPending, error } = useForgotPassword();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordInputs>({
    defaultValues: { email: "" },
    mode: "onChange",
  });
  
  
  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    try {
      const response = await forgotPassword({ email: data.email });
      if (response.success) {
        showSuccess(tAuth('forgotPassword.success'));
      }
    } catch (error: any) {
      showError(error?.message || tAuth('forgotPassword.error.failed'));
    }
  };

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
            <h1 className={styles.title}>{tAuth('forgotPassword.title')}</h1>
            <p className={styles.subtitle}>
              {tAuth('forgotPassword.subtitle')}
            </p>

            {error && (
              <div className={styles.errorMessage}>
                {error.message || tAuth('forgotPassword.error.failed')}
              </div>
            )}
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormLabel>{tAuth('login.email.label')}</FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: tAuth('login.email.required'),
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: tAuth('login.email.invalid'),
                    },
                  })}
                  placeholder={tAuth('login.email.placeholder')}
                  isInvalid={!!errors.email}
                  feedback={errors.email?.message}
                  disabled={isPending}
                />
              </FormGroup>
              <Button
                variant="primary"
                type="submit"
                className={styles.submitButton}
                disabled={!isValid || isSubmitting || isPending}
              >
                {isPending ? tAuth('forgotPassword.submitting') : tAuth('forgotPassword.submit')}
              </Button>
            </Form>
            <p className={styles.signupText}>
              {tAuth('forgotPassword.signIn')}{" "}
              <a href="/login" className={styles.signupLink}>
                {tAuth('login.signUp')}
              </a>
            </p>
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

export default ForgotPassword;
