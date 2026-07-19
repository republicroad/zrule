import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn, useSession } from "@/lib/auth-client";
import { rootRoute } from "./__root";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { AuthGridBackground } from "@/components/blocks/auth-1/components/auth-grid-background";
import { AuthLogo } from "@/components/blocks/auth-1/components/auth-logo";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";

function LoginPage() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (session) {
    navigate({ to: "/dashboard" });
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error: signInError } = await signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      toast.error("登录失败", {
        description: signInError.message || "邮箱或密码错误",
      });
      return;
    }

    navigate({ to: "/dashboard" });
  }

  return (
    <div className="bg-background relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
      <AuthGridBackground cellSize={40} />
      <div className="relative z-10 flex w-full items-center justify-center">
        <div className="mx-auto grid w-full max-w-[76rem] items-center justify-center gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,450px)] lg:gap-24 xl:grid-cols-[minmax(0,420px)_minmax(0,490px)] xl:gap-28">
          <section className="flex min-w-0 flex-col justify-between py-4 sm:py-6 lg:py-8">
            <div className="flex flex-1 flex-col justify-center">
              <div className="mx-auto flex w-full max-w-90 flex-col gap-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <AuthLogo />
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                      登录 ZRule
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      欢迎回来，请登录您的账户
                    </p>
                  </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <FieldGroup className="gap-3.5">
                    <Field className="gap-2">
                      <FieldLabel htmlFor="login-email">邮箱</FieldLabel>
                      <Input
                        id="login-email"
                        type="email"
                        autoComplete="username"
                        placeholder="you@example.com"
                        className="bg-background"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Field>

                    <Field className="gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <FieldLabel htmlFor="login-password">密码</FieldLabel>
                        <Button
                          type="button"
                          variant="link"
                          className="text-muted-foreground h-auto p-0 text-xs font-normal"
                        >
                          忘记密码?
                        </Button>
                      </div>

                      <InputGroup className="bg-background w-full">
                        <InputGroupInput
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="输入密码"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            size="icon-xs"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "隐藏密码" : "显示密码"}
                            aria-pressed={showPassword}
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOffIcon aria-hidden="true" className="size-4" />
                            ) : (
                              <EyeIcon aria-hidden="true" className="size-4" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  </FieldGroup>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "登录中..." : "登录"}
                  </Button>
                </form>

                <p className="text-muted-foreground text-center text-sm">
                  还没有账户?{" "}
                  <Link to="/register">
                    <Button type="button" variant="link" className="h-auto p-0">
                      注册
                    </Button>
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <div className="hidden lg:flex">
            <div className="border-border/70 bg-muted/20 flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="text-4xl font-bold">ZRule</div>
                <div className="text-muted-foreground text-sm">
                  智能决策规则引擎
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
