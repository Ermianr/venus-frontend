import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-validator";

async function RegisterPage() {
  await requireUnauth();
  return <RegisterForm />;
}

export default RegisterPage;
