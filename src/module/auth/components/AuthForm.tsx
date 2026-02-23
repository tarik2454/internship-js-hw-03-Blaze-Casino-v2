"use client";

import { Input } from "@/shared/components/Input";
import styles from "./AuthForm.module.scss";
import { Button } from "@/shared/components/Button";
import {
  useForm,
  SubmitHandler,
  Path,
  Resolver,
  FieldError,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginSchemaDto,
  loginSchema,
  RegisterSchemaDto,
  registerSchema,
} from "../auth.schema";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";

type AuthFormProps<T> = {
  mode: "login" | "register";
  onSubmit: SubmitHandler<T>;
};

export function AuthForm<T extends LoginSchemaDto | RegisterSchemaDto>({
  mode,
  onSubmit,
}: AuthFormProps<T>) {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const schema = mode === "login" ? loginSchema : registerSchema;

  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues:
      mode === "login"
        ? ({
            email: "test-user@gmail.com",
            password: "@Tarik-2454",
          } as DefaultValues<T>)
        : undefined,
  });

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = form;

  const getErrorMessage = (field: Path<T>) => {
    const error = errors[field] as FieldError;
    return error ? error.message : undefined;
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {mode === "register" && (
        <Input
          label={t.auth.username}
          {...registerField("username" as Path<T>)}
          type="text"
          placeholder={t.auth.usernamePlaceholder}
          stylesVariant="authInput"
          labelClassName={styles.label}
          error={getErrorMessage("username" as Path<T>)}
        />
      )}

      <Input
        label={t.auth.email}
        type="email"
        {...registerField("email" as Path<T>)}
        stylesVariant="authInput"
        placeholder={t.auth.emailPlaceholder}
        labelClassName={styles.label}
        error={getErrorMessage("email" as Path<T>)}
      />

      <Input
        label={t.auth.password}
        type="password"
        {...registerField("password" as Path<T>)}
        stylesVariant="authInput"
        placeholder={t.auth.passwordPlaceholder}
        labelClassName={styles.label}
        inputWrapperClassName={styles.inputWrapperLast}
        error={getErrorMessage("password" as Path<T>)}
      />

      <Button type="submit" stylesVariant="redGradient">
        {mode === "login" ? t.auth.login : t.auth.register}
      </Button>
    </form>
  );
}
