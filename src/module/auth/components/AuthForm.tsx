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
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginSchemaDto,
  loginSchema,
  RegisterSchemaDto,
  registerSchema,
} from "../auth.schema";

type AuthFormProps<T> = {
  mode: "login" | "register";
  onSubmit: SubmitHandler<T>;
};

export function AuthForm<T extends LoginSchemaDto | RegisterSchemaDto>({
  mode,
  onSubmit,
}: AuthFormProps<T>) {
  const schema = mode === "login" ? loginSchema : registerSchema;

  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
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
          label="Username"
          {...registerField("username" as Path<T>)}
          type="text"
          placeholder="Enter username"
          stylesVariant="authInput"
          labelClassName={styles.label}
          error={getErrorMessage("username" as Path<T>)}
        />
      )}

      <Input
        label="Email"
        type="email"
        {...registerField("email" as Path<T>)}
        stylesVariant="authInput"
        placeholder="Enter email"
        labelClassName={styles.label}
        error={getErrorMessage("email" as Path<T>)}
      />

      <Input
        label="Password"
        type="password"
        {...registerField("password" as Path<T>)}
        stylesVariant="authInput"
        placeholder="Enter password"
        labelClassName={styles.label}
        inputWrapperClassName={styles.inputWrapperLast}
        error={getErrorMessage("password" as Path<T>)}
      />

      <Button type="submit" stylesVariant="redGradient">
        {mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}
