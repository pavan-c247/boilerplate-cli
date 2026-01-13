"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import CommonToast from "@/components/common/toast";
import Button from "@/components/pure-components/Button";
import Checkbox from "@/components/pure-components/Checkbox";
import { Form, FormGroup, FormLabel } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import { Eye, EyeOff } from "@/components/pure-components/Icons";
import ImageWithFallback from "@/components/pure-components/ImageWithFallback";
import { useRegistrationMutation } from "@/hooks/auth";
import { useToast } from "@/hooks/useToast";
import { paths } from "@/routes";
import { SignupCredentials } from "@/types/auth";
import { getPasswordStrength } from "@/utils";
import { createSignupFormZodSchema, SignupFormInputs } from "@/validations/schemas/auth/signup.zod.schema";

import styles from "../auth.module.scss";

const SignupForm = () => {
  const t = useTranslations('validations');
  const tAuth = useTranslations('auth');
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Create Zod schema with translations
  const signupFormSchema = React.useMemo(
    () => createSignupFormZodSchema((key) => t(key)),
    [t]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      hasAcceptedTerms: false,
    },
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {mutateAsync : registerUser, isPending: isRegistering} =useRegistrationMutation()

  const password = watch("password");

  const passwordStrength = getPasswordStrength(password ,tAuth);

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      const payload: SignupCredentials = {
        firstName: data.firstName,
        ...(data.lastName?.trim() && { lastName: data.lastName }),
        email: data.email,
        password: data.password,
        hasAcceptedTerms : data.hasAcceptedTerms
      };

      const response = await registerUser(payload);
      showSuccess(response.message || tAuth('signup.success'));
    } catch (error: any) {
      showError(error?.message || tAuth('signup.error.failed'));
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
            <h1 className={styles.title}>{tAuth('signup.title')}</h1>
            <p className={styles.subtitle}>{tAuth('signup.subtitle')}</p>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormLabel>
                  {tAuth('signup.firstName.label')}
                  <span className="text-danger">*</span>
                </FormLabel>
                <Input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  placeholder={tAuth('signup.firstName.placeholder')}
                  isInvalid={!!errors.firstName}
                  feedback={errors.firstName?.message}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>{tAuth('signup.lastName.label')}</FormLabel>
                <Input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  placeholder={tAuth('signup.lastName.placeholder')}
                  isInvalid={!!errors.lastName}
                  feedback={errors.lastName?.message}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  {tAuth('signup.email.label')}
                  <span className="text-danger">*</span>
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder={tAuth('signup.email.placeholder')}
                  isInvalid={!!errors.email}
                  feedback={errors.email?.message}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  {tAuth('signup.password.label')}
                  <span className="text-danger">*</span>
                </FormLabel>
                <div className={styles.passwordInputWrapper}>
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
                <FormLabel>{tAuth('signup.confirmPassword.label')}</FormLabel>
                <div className={styles.passwordInputWrapper}>
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
                    className={`${styles.passwordToggleBtn} ${
                      showConfirmPassword ? styles.hidePassword : styles.showPassword
                    }`}
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
              <Checkbox
                id="hasAcceptedTerms"
                label={tAuth('signup.terms.label')}
                checked={watch("hasAcceptedTerms")}
                onChange={(checked) => {
                  register("hasAcceptedTerms").onChange({
                    target: { name: "hasAcceptedTerms", value: checked }
                  });
                }}
                isInvalid={!!errors.hasAcceptedTerms}
                feedback={errors.hasAcceptedTerms?.message}
                className={styles.rememberMe}
              />
              <Button
                variant="primary"
                type="submit"
                className={styles.submitButton}
                disabled={!isValid || isSubmitting || isRegistering}
              >
                {isRegistering ? tAuth('signup.submitting') : tAuth('signup.submit')}
              </Button>
            </Form>

            <p className={styles.signupText}>
              {tAuth('signup.signIn')}{" "}
              <Link href={paths.LOGIN} className={styles.signupLink}>
                {tAuth('login.signIn')}
              </Link>
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

export default SignupForm;
