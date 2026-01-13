import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { SubmitHandler,useForm } from "react-hook-form";

import Input from "@/components/pure-components/Form/Input";
import { createUserFormZodSchema, UserFormInputs } from "@/validations";

export interface UserFormValues {
  lastName?: string;
  firstName: string;
  email: string;
  status: number;
}

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSubmit: SubmitHandler<UserFormValues>;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslations("users");
  
  // Create Zod schema with translations
  const userFormSchema = React.useMemo(
    () => createUserFormZodSchema((key) => t(key)),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      email: "",
      status: 0,
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>{t("firstName")}
          <span className="text-danger">*</span>
        </Form.Label>
        <Input
          {...register("firstName")}
          isInvalid={!!errors.firstName}
          feedback={errors.firstName?.message}
        />
      </Form.Group>
        <Form.Group className="mb-3">
        <Form.Label>{t("lastName")}</Form.Label>
        <Input
          {...register("lastName")}
          isInvalid={!!errors.lastName}
          feedback={errors.lastName?.message}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t("email")}
          <span className="text-danger">*</span>
        </Form.Label>
        <Input
          {...register("email")}
          isInvalid={!!errors.email}
          feedback={errors.email?.message}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t("status")}
          <span className="text-danger">*</span>
        </Form.Label>
        <Form.Select
          {...register("status", { valueAsNumber: true })}
          isInvalid={!!errors.status}
        >
          <option value={1}>{t("statusOptions.active")}</option>
          <option value={0}>{t("statusOptions.inactive")}</option>
        </Form.Select>
        {errors.status && (
          <div className="invalid-feedback d-block">
            {errors.status.message}
          </div>
        )}
      </Form.Group>
      <div className="d-flex justify-content-end gap-2 mt-4">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} type="button">
            {t("cancel")}
          </Button>
        )}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {t("save")}
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
