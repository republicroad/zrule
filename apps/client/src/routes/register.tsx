import { createRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signUp, useSession, organization } from "@/lib/auth-client";
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

function RegisterPage() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const [name, setName] = useState("");
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

    const { data, error: signUpError } = await signUp.email({
      name,
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      toast.error("注册失败", {
        description: signUpError.message || "注册失败，请重试",
      });
      return;
    }

    const orgName = name ? `${name}的组织` : "我的组织";
    const orgSlug = `org-${Date.now()}`;

    const { data: org, error: orgError } = await organization.create({
      name: orgName,
      slug: orgSlug,
    });

    if (!orgError && org?.id) {
      await organization.setActive({ organizationId: org.id });
    }

    setLoading(false);
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
                      创建账户
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      输入您的信息开始使用
                    </p>
                  </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <FieldGroup className="gap-3.5">
                    <Field className="gap-2">
                      <FieldLabel htmlFor="register-name">姓名</FieldLabel>
                      <Input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        placeholder="您的姓名"
                        className="bg-background"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Field>

                    <Field className="gap-2">
                      <FieldLabel htmlFor="register-email">邮箱</FieldLabel>
                      <Input
                        id="register-email"
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
                      <FieldLabel htmlFor="register-password">密码</FieldLabel>
                      <InputGroup className="bg-background w-full">
                        <InputGroupInput
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="创建密码"
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
                    {loading ? "创建中..." : "注册"}
                  </Button>
                </form>

                <p className="text-muted-foreground text-center text-sm">
                  已有账户?{" "}
                  <Link to="/login">
                    <Button type="button" variant="link" className="h-auto p-0">
                      登录
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

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});
