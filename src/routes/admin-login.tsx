import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { DEMO_ROLES, useDemoRole } from "@/lib/demo-access";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Hyrje Admin - Smart Dossier" },
      {
        name: "description",
        content: "Hyrje e vecante per administratoret e platformes Smart Dossier.",
      },
    ],
  }),
  component: AdminLoginPage,
});

type LoginStep = "credentials" | "otp" | "done";

const DEMO_OTP = "246810";

function AdminLoginPage() {
  const navigate = useNavigate();
  const { setRole } = useDemoRole();
  const [identifier, setIdentifier] = useState("ADM-001");
  const [password, setPassword] = useState("demo2026");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [step, setStep] = useState<LoginStep>("credentials");
  const [otp, setOtp] = useState("");

  function continueToOtp() {
    if (!identifier.trim() || !password.trim()) {
      toast.error("Plotësoni të dhënat e administratorit për të vazhduar.");
      return;
    }
    setStep("otp");
    toast.success(`Kodi OTP demo u dërgua: ${DEMO_OTP}`);
  }

  async function verifyOtp() {
    if (otp !== DEMO_OTP) {
      toast.error("Kodi OTP nuk është i saktë. Për demo përdorni 246810.");
      return;
    }
    setStep("done");
    setRole("admin");
    toast.success(`Hyrja u krye si ${DEMO_ROLES.admin.label}`);
    await navigate({ to: DEMO_ROLES.admin.defaultRoute });
  }

  return (
    <div className="min-h-screen bg-[#eef3f9] text-foreground">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Kthehu te hyrja publike
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <img
              src="/brand/smart-dossier-logo.png"
              alt="Smart Dossier"
              className="h-10 w-12 object-contain"
            />
            Admin
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-3.75rem)] max-w-6xl gap-8 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
        <section className="max-w-2xl">
          <div className="mb-4 inline-flex rounded-md bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-soft">
            Hyrje e veçantë
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#172338] md:text-5xl">
            Paneli i administratorit
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Kjo hyrje përdoret vetëm për konfigurim, auditim, menaxhim përdoruesish dhe kontroll të
            plotë mbi platformën.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <AdminCapability title="Auditim" body="Shikim i historikut dhe veprimeve në dosje." />
            <AdminCapability
              title="Konfigurim"
              body="Menaxhim procesesh, përdoruesish dhe roleve."
            />
          </div>
        </section>

        <Card className="border bg-white p-5 shadow-lift md:p-6">
          <div className="border-b pb-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <ShieldCheck className="size-4" />
              Hyrje admin
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {step === "otp" ? "Verifikimi me OTP" : "Identifikimi i administratorit"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step === "otp"
                ? "Vendosni kodin demo për të përfunduar hyrjen si admin."
                : "Përdorni kredencialet demo të administratorit për këtë prototip."}
            </p>
          </div>

          {step === "credentials" ? (
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  ID e administratorit <span className="text-primary">*</span>
                </Label>
                <div className="flex items-center gap-3 rounded-md border bg-card px-3">
                  <UserCog className="size-5 text-primary" />
                  <Input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="ADM-001"
                    className="h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Fjalëkalimi <span className="text-primary">*</span>
                </Label>
                <div className="flex items-center gap-3 rounded-md border bg-card px-3">
                  <LockKeyhole className="size-5 text-primary" />
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    className="h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="grid size-9 place-items-center text-muted-foreground"
                    aria-label={showPassword ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(value) => setRemember(Boolean(value))}
                />
                Më mbaj mend
              </label>

              <Button
                type="button"
                onClick={continueToOtp}
                className="h-12 w-full text-base font-semibold"
              >
                Hyr si admin
              </Button>

              <div className="rounded-md bg-muted p-3 text-xs leading-5 text-muted-foreground">
                Për demo: përdorni fjalëkalimin <span className="font-mono">demo2026</span> dhe
                kodin OTP <span className="font-mono">{DEMO_OTP}</span>.
              </div>
            </div>
          ) : null}

          {step === "otp" ? (
            <div className="mt-6 space-y-6 text-center">
              <div className="rounded-md border bg-muted px-4 py-3 text-sm text-muted-foreground">
                Kodi OTP demo për admin është{" "}
                <span className="font-mono font-semibold text-foreground">{DEMO_OTP}</span>.
              </div>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="h-12 w-12 bg-white text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={verifyOtp}
                  className="h-12 w-full text-base font-semibold"
                >
                  Konfirmo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 w-full"
                  onClick={() => {
                    setOtp("");
                    setStep("credentials");
                  }}
                >
                  Kthehu te identifikimi
                </Button>
              </div>
            </div>
          ) : null}

          {step === "done" ? (
            <div className="mt-6 rounded-md border bg-muted p-4 text-center">
              <CheckCircle2 className="mx-auto size-8 text-success" />
              <div className="mt-2 text-sm font-semibold">Hyrja u konfirmua</div>
            </div>
          ) : null}
        </Card>
      </main>
    </div>
  );
}

function AdminCapability({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border bg-white p-4 shadow-soft">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}
