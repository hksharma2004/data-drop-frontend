"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (type === "sign-up") {
        await createAccount({
          fullName: values.fullName!,
          email: values.email,
          password: values.password,
        });
        toast("Sign up complete! Please log in now.");
        router.push("/sign-in");
      } else {
        await signInUser({
          email: values.email,
          password: values.password,
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full">
            <div className="bg-white w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-10 text-black">
                {type === "sign-in" ? "Sign In" : "Sign Up"}
              </h1>

              {type === "sign-up" && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="mb-4 sm:mb-6">
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="w-full p-3 sm:p-4 bg-white rounded-none border-2 border-black placeholder:text-gray-500 focus:border-[#FF7A3D] focus:ring-0 transition-all duration-200 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4 sm:mb-6">
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="w-full p-3 sm:p-4 bg-white rounded-none border-2 border-black placeholder:text-gray-500 focus:border-[#FF7A3D] focus:ring-0 transition-all duration-200 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4 sm:mb-6">
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full p-3 sm:p-4 bg-white rounded-none border-2 border-black placeholder:text-gray-500 focus:border-[#FF7A3D] focus:ring-0 transition-all duration-200 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 sm:h-14 lg:h-[60px] bg-[#FF7A3D] text-white font-bold text-base sm:text-lg lg:text-xl uppercase border-2 border-black shadow-neo hover:shadow-neo-hover hover:bg-[#E5672A] transition-all duration-200 active:shadow-neo-active active:scale-95 rounded-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={20}
                      height={20}
                      className="animate-spin"
                    />
                    <span>Loading...</span>
                  </div>
                ) : type === "sign-in" ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="text-center mt-4 sm:mt-6">
                <p className="text-sm sm:text-base text-gray-600">
                  {type === "sign-in"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <Link
                    href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                    className="font-bold text-[#FF7A3D] underline ml-2 hover:text-[#E5672A] transition-colors duration-200"
                  >
                    {type === "sign-in" ? "Sign Up" : "Sign In"}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 text-red-700 text-sm text-center">
              {errorMessage}
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default AuthForm;