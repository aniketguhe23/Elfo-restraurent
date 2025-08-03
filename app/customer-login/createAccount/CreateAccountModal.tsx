"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Image from "next/image";
import ProjectApiList from "@/app/api/ProjectApiList";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
};

interface CreateAccountModalProps {
  waId: string;
  mobile: string;
  onClose: () => void;
}

export default function CreateAccountModal({
  onClose,
  waId,
  mobile,
}: CreateAccountModalProps) {
  const { api_createUserProfile } = ProjectApiList();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (mobile) {
      setValue("mobile", mobile);
    }
  }, [mobile, setValue]);

  const onSubmit = async (data: FormValues) => {
    const res = await fetch(api_createUserProfile, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, waId }),
    });

    const result = await res.json();
    if (result.token) {
      localStorage.setItem("token", result.token);
      window.location.reload();
    }

    router.refresh();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto px-6 py-6">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center w-full gap-1">
              {/* <Image
                src="/elephant.png"
                alt="Elfo's Pizza Logo"
                width={60}
                height={60}
              /> */}
              <DialogTitle className="text-xl">Create Account</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Quick signup to continue 🍕
              </DialogDescription>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 absolute right-2 top-2"
            >
             X
            </Button> */}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label>First Name</Label>
            <Input
              placeholder="John"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              placeholder="Doe"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label>Mobile Number</Label>
            <Input
              disabled
              className="bg-gray-100 cursor-not-allowed"
              {...register("mobile", {
                required: "Mobile number is required",
              })}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mobile.message}
              </p>
            )}
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              {...register("dateOfBirth", {
                required: "Birth date is required",
              })}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ED722E] hover:bg-orange-500"
          >
            Create Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
