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

export const formSchema = z.object({
  email: z.email({ error: "El correo debe tener un formato valido." }),
  password: z
    .string()
    .min(8, { error: "La contraseña debe tener como mínimo 8 caracteres." }),
});

type LoginSchema = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("¡Inicio de Sesión exitoso!");
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
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Inicia Sesión para poder charlar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
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

            <Button type="submit" disabled={isPending} className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Regístrate aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
