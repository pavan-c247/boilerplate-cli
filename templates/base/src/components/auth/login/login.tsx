"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { SubmitHandler,useForm } from "react-hook-form";

import Button from "@/components/pure-components/Button";
import { Form, FormGroup, FormLabel } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import { Eye, EyeOff } from "@/components/pure-components/Icons";
import ImageWithFallback from "@/components/pure-components/ImageWithFallback";
import LoadingSpinner from "@/components/pure-components/LoadingSpinner";
import { useAuth } from "@/hooks/auth";
import { createLoginFormZodSchema, LoginFormInputs } from "@/validations/schemas/auth/login.zod.schema";

import styles from "../auth.module.scss";

const Login = () => {
  const { login, isLoggingIn, loginError, isAuthenticated, isLoadingUser } =
    useAuth();
  const router = useRouter();
  const tAuth = useTranslations('auth.login');
  const tValidations = useTranslations('validations');

  const [showPassword, setShowPassword] = useState(false);

  // Create Zod schema with translations
  const loginFormSchema = React.useMemo(
    () => createLoginFormZodSchema((key) => tValidations(key)),                                       
    [tValidations]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (!isLoadingUser && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoadingUser, router]);

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  if (isLoadingUser) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated) {
    return null;
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

          <h1 className={styles.title}>{tAuth("title")}</h1>
          <p className={styles.subtitle}>{tAuth("subtitle")}</p>

          {loginError && (
            <div className={styles.errorMessage}>{loginError.message}</div>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <FormLabel>{tAuth("email.label")}</FormLabel>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder={tAuth("email.placeholder")}
                disabled={isLoggingIn}
                isInvalid={!!errors.email}
                feedback={errors.email?.message}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>{tAuth("password.label")}</FormLabel>
              <div className={styles.passwordInputWrapper}>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder={tAuth("password.placeholder")}
                  disabled={isLoggingIn}
                  isInvalid={!!errors.password}
                  feedback={errors.password?.message}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className={`${styles.passwordToggleBtn} ${
                    showPassword ? styles.hidePassword : styles.showPassword
                  }`}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </FormGroup>

            <div className={styles.formFooter}>
              <a href="/forgot-password" className={styles.forgotPassword}>
                {tAuth("forgotPassword")}
              </a>
            </div>
            <FormGroup>
              <Button
                variant="primary"
                type="submit"
                className={styles.submitButton}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? tAuth("submitting") : tAuth("signIn")}
              </Button>
            </FormGroup>
          </Form>
          <p className={styles.signupText}>
            {tAuth("noAccount")}{" "}
            <a href="/signup" className={styles.signupLink}>
              {tAuth("signUp")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
