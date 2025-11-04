"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient, getErrorMessage } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: "El nombre de usuario debe ser mínimo de 3 caracteres" })
      .max(20, {
        error: "El nombre de usuario debe ser máximo de 20 caracteres.",
      }),
    email: z.email({ error: "El correo debe tener un formato valido." }),
    password: z
      .string()
      .min(8, { error: "La contraseña debe tener como mínimo 8 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof formSchema>;

export function RegisterForm() {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    await authClient.signUp.email(
      {
        name: data.username,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("¡Registro exitoso!");
          form.reset();
        },
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (context) => {
          toast.error(getErrorMessage(context.error.code, "es"));
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrarse</CardTitle>
        <CardDescription>Regístrate para poder seguir adelante</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Campo username */}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Elige un nombre de usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo email */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese su correo electrónico"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo password */}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Campo confirmPassword */}

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              Registrarse
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Inicia Sesión aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
