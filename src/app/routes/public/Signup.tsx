import { Link } from "@/lib/router";
import { Flame, Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, CreateUserInput } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldTypes } from "@/lib/form-field-type";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const SignupPage = () => {
  // React form hook
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone_number: "",
    },
  });

  const handleSubmit = async (data: CreateUserInput) => {
    form.setError("root", {
      message: "This is a demo, registration is disabled.",
    });
    toast.error(
      "Registration is disabled in this demo. Please use the login page.",
    );
    return;
  };

  const fields = [
    {
      key: "name",
      label: "Full Name",
      icon: User,
      type: "text",
      placeholder: "John Doe",
      formType: FormFieldTypes.INPUT,
    },
    {
      key: "email",
      label: "Email",
      icon: Mail,
      type: "email",
      placeholder: "you@futa.edu.ng",
      formType: FormFieldTypes.INPUT,
    },
    {
      key: "phone_number",
      label: "Phone Number",
      icon: User,
      type: "text",
      placeholder: "08012345678",
      formType: FormFieldTypes.PHONE_INPUT,
    },
    {
      key: "password",
      label: "Password",
      icon: Lock,
      type: "password",
      placeholder: "••••••••",
      formType: FormFieldTypes.INPUT,
    },
    {
      key: "confirmPassword",
      label: "Confirm Password",
      icon: Lock,
      type: "password",
      placeholder: "••••••••",
      formType: FormFieldTypes.INPUT,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Flame size={28} className="text-primary" />
            <span className="font-display font-bold text-2xl text-foreground">
              Holy Grills
            </span>
          </div>
          <p className="text-muted-foreground font-body text-sm">
            Create your account and start earning HP
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {fields.map((f) => (
              <div className="relative">
                <CustomFormField
                  key={f.key}
                  control={form.control}
                  name={f.key}
                  label={f.label}
                  iconSrc={f.icon}
                  type={f.type}
                  placeholder={f.placeholder}
                  fieldType={f.formType}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating
                  account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </Form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground font-body">or</span>
          </div>
        </div>

        {/* Google */}
        <GoogleAuthButton type="signup" />

        <p className="text-center text-sm text-muted-foreground font-body mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
