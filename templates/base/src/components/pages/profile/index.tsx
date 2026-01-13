"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

import commonStyles from "@/assets/scss/admin.module.scss";
import CommonToast from "@/components/common/toast";
import SwitchButton from "@/components/pure-components/Button/SwitchButton/SwitchButton";
import CardWrapper from "@/components/pure-components/CardWrapper";
import { Form, FormControl, FormGroup, FormLabel, FormText } from "@/components/pure-components/Form";
import Input from "@/components/pure-components/Form/Input";
import { Eye, EyeOff } from "@/components/pure-components/Icons";
import { useAuth, useChangePassword, useUpdateProfile } from "@/hooks/auth";
import { useToast } from "@/hooks/useToast";
import { getRoleDisplayName } from "@/utils/roleManager";
import {
  createPasswordFormZodSchema,
  createProfileFormZodSchema,
  PasswordFormInputs,
  ProfileFormInputs,
} from "@/validations/schemas/profile.zod.schema";

import styles from "./profile.module.scss";

const ProfilePage: React.FC = () => {
  const t = useTranslations("common.profile");
  const tValidation = useTranslations("validations");
  const { user } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();

  // UI State
  const [editPassword, setEditPassword] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // API Mutations
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  // Create Zod schemas with translations
  const profileSchema = React.useMemo(
    () => createProfileFormZodSchema((key) => tValidation(key)),
    [tValidation]
  );

  const passwordSchema = React.useMemo(
    () => createPasswordFormZodSchema((key) => tValidation(key)),
    [tValidation]
  );

  // Profile Form with Zod validation
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { isSubmitting: isSubmittingProfile, errors: profileErrors },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    // mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      email: "",
    },
  });

  // Password Form with Zod validation
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { isSubmitting: isSubmittingPassword, errors },
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });


  // Update profile form when user changes
  useEffect(() => {
    if (user) {
      resetProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: getRoleDisplayName(user.role as unknown as number),
        email: user.email || "",
      });
      setProfileImage(user.avatar || null);
    }
  }, [user, resetProfileForm]);

  // Profile Submit Handler
  const onProfileSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    try {
      const response = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email:data.email
      });
      showSuccess(response.message);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      showError(errorMessage);
    }
  };

  // Password Submit Handler
  const onPasswordSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
    try {
      const response = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      showSuccess(response.message);
      resetPasswordForm();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      showError(errorMessage);
    }
  };

  return (
    <CardWrapper title={t("editProfile")}>
      <Form onSubmit={handleProfileSubmit(onProfileSubmit)}>
        <div className="mb-4">
          <Form className="fw-bold">{t("profileImage")}</Form>
          <div
            className={`d-flex align-items-center gap-3 ${styles.profileImageSection}`}
          >
            <img
              src={
                profileImage || "https://via.placeholder.com/80x80?text=User"
              }
              alt="Profile"
              className={styles.profileImage}
            />
            <div className={styles.profileUpload}>
              <FormControl
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                id="profile-upload"
                style={{ display: "none" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const fileInput = e.target as HTMLInputElement;
                  if (fileInput.files && fileInput.files[0]) {
                    setProfileImage(URL.createObjectURL(fileInput.files[0]));
                  }
                }}
              />
              <label htmlFor="profile-upload">
                <Button as="span" variant="primary" className="me-2">
                  {t("uploadPhoto")}
                </Button>
              </label>
              <Button
                variant="outline-secondary"
                onClick={() => setProfileImage(null)}
                type="button"
              >
                {t("removePhoto")}
              </Button>
              <div className="form-text">{t("photoHelp")}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="fw-bold mb-2">{t("profileInfo")}</div>
          <Row className="g-3">
            <Col md={6}>
              <FormLabel>
                {t("firstName")}{" "}
                <span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                {...registerProfile("firstName")}
                isInvalid={!!profileErrors.firstName}
                disabled={isUpdatingProfile || isSubmittingProfile}
              />
              {profileErrors.firstName && (
                <FormText className="text-danger d-block mt-1">
                  {profileErrors.firstName.message}
                </FormText>
              )}
            </Col>
            <Col md={6}>
              <FormLabel>
                {t("lastName")}{" "}
                <span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                {...registerProfile("lastName")}
                isInvalid={!!profileErrors.lastName}
                disabled={isUpdatingProfile || isSubmittingProfile}
              />
              {profileErrors.lastName && (
                <FormText className="text-danger d-block mt-1">
                  {profileErrors.lastName.message}
                </FormText>
              )}
            </Col>
            <Col md={6}>
              <FormLabel>
                {t("jobTitle")}{" "}
                <span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                {...registerProfile("role")}
                isInvalid={!!profileErrors.role}
                disabled
              />
              {profileErrors.role && (
                <FormText className="text-danger d-block mt-1">
                  {profileErrors.role.message}
                </FormText>
              )}
            </Col>
            <Col md={6}>
              <FormLabel>
                {t("email")}{" "}
                <span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                {...registerProfile("email")}
                disabled
              />
            </Col>
          </Row>
        </div>

        <div className="text-end">
          <Button
            variant="primary"
            type="submit"
            className="px-4"
            disabled={isSubmittingProfile || isUpdatingProfile}
          >
            {isSubmittingProfile || isUpdatingProfile ? "Saving..." : t("save")}
          </Button>
        </div>
      </Form>

      <Form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
        <div className="mb-4">
          <div className="mb-3">
            <SwitchButton
              checked={editPassword}
              onChange={(checked) => {
                setEditPassword(checked);
                if (checked) {
                  resetPasswordForm(); // Clear form when opening
                } else {
                  resetPasswordForm(); // Clear form when closing
                  setShowPassword(false);
                  setShowNewPassword(false);
                }
              }}
              id="editPasswordSwitch"
              label={t("editPassword")}
            />
          </div>
          {editPassword && (
            <Row className="g-3">
              <Col md={6}>
              <FormGroup>
                <FormLabel>
                  {t("password")}{" "}
                  <span className="text-danger">*</span>
                </FormLabel>
                <InputGroup>
                  <Input
                    {...registerPassword("currentPassword")}
                    type={showPassword ? "text" : "password"}
                    isInvalid={!!errors.currentPassword}
                    disabled={isChangingPassword || isSubmittingPassword}
                    placeholder="Enter current password"
                    feedback={errors.currentPassword?.message as string}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className={commonStyles.border}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
               </InputGroup>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormLabel>
                  {t("newPassword")}{" "}
                  <span className="text-danger">*</span>
                </FormLabel>
                <InputGroup>
                  <Input
                    {...registerPassword("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    isInvalid={!!errors.newPassword}
                    disabled={isChangingPassword || isSubmittingPassword}
                    placeholder="Enter new password"
                    feedback={errors.newPassword?.message as string}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowNewPassword((v) => !v)}
                    tabIndex={-1}
                    className={commonStyles.border}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
              </InputGroup>
              </Col>
              <Col md={6}>
                <FormLabel>
                  {t("confirmPassword")}{" "}
                  <span className="text-danger">*</span>
                </FormLabel>
                <InputGroup>
                  <Input
                    {...registerPassword("confirmPassword")}
                    type={showPassword ? "text" : "password"}
                    isInvalid={!!errors.confirmPassword}
                    disabled={isChangingPassword || isSubmittingPassword}
                    placeholder="Re-enter password"
                    feedback={errors.confirmPassword?.message as string}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className={commonStyles.border}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
             </InputGroup>
              </Col>
              <Col md={12}>
                <div className="text-end">
                  <Button
                    variant="secondary"
                    type="button"
                    className="px-4 me-2"
                    onClick={() => {
                      setEditPassword(false);
                      resetPasswordForm();
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-4"
                    disabled={isSubmittingPassword || isChangingPassword}
                  >
                    {isSubmittingPassword || isChangingPassword
                      ? "Changing..."
                      : t("changePassword")}
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </Form>
      
      <CommonToast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />
    </CardWrapper>
  );
};

export default ProfilePage;
