import { Link, useNavigate } from "@/lib/router";
import { Flame, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations";
import { requestPasswordResetApi } from "@/lib/api/auth";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldTypes } from "@/lib/form-field-type";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (data: ForgotPasswordInput) => {
    try {
      await requestPasswordResetApi(data.email);
      toast.success("Verification email sent. Check your inbox.");
      form.reset();
      navigate("/login");
    } catch {
      form.setError("root", {
        message: "We could not verify that email. Please try again.",
      });
      toast.error("Email verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Flame size={28} className="text-primary" />
            <span className="font-display font-bold text-2xl text-foreground">Holy Grills</span>
          </div>
          <p className="text-muted-foreground font-body text-sm">
            Enter your email to reset your password
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <CustomFormField
              control={form.control}
              name="email"
              label="Email"
              fieldType={FormFieldTypes.INPUT}
              type="email"
              placeholder="you@futa.edu.ng"
              iconSrc={Mail}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-destructive font-body text-center">
                {form.formState.errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending email...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground font-body mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
