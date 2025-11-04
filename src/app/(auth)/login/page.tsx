import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-validator";

async function LoginPage() {
  await requireUnauth();
  return <LoginForm />;
}

export default LoginPage;
