import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserCog,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { DEMO_ROLES, type DemoRole, useDemoRole } from "@/lib/demo-access";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Hyrje me OTP - Smart Dossier" },
      {
        name: "description",
        content: "Hyrje institucionale demo per Admin, Operator, Qytetar dhe Biznes me OTP.",
      },
    ],
  }),
  component: LoginPage,
});

type LoginStep = "credentials" | "otp" | "done";

const LOGIN_ROLES: Array<{
  role: DemoRole;
  title: string;
  hint: string;
  idLabel: string;
  idPlaceholder: string;
  icon: typeof UserRound;
  demoId: string;
}> = [
  {
    role: "citizen",
    title: "Qytetar",
    hint: "Aplikime dhe gjurmim publik",
    idLabel: "Vendosni kodin e perdoruesit NID",
    idPlaceholder: "H90803041W",
    icon: UserRound,
    demoId: "H90803041W",
  },
  {
    role: "business",
    title: "Biznes",
    hint: "Aplikime me NIPT",
    idLabel: "Vendosni NIPT-in e subjektit",
    idPlaceholder: "L22334455B",
    icon: Building2,
    demoId: "L22334455B",
  },
  {
    role: "operator",
    title: "Operator",
    hint: "Punon dosjet",
    idLabel: "Vendosni ID-ne e nepunesit",
    idPlaceholder: "OP-1024",
    icon: UserCog,
    demoId: "OP-1024",
  },
  {
    role: "admin",
    title: "Admin",
    hint: "Konfigurim dhe audit",
    idLabel: "Vendosni ID-ne e administratorit",
    idPlaceholder: "ADM-001",
    icon: ShieldCheck,
    demoId: "ADM-001",
  },
];

const DEMO_OTP = "246810";

function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useDemoRole();
  const [selectedRole, setSelectedRole] = useState<DemoRole>("citizen");
  const [identifier, setIdentifier] = useState(LOGIN_ROLES[0].demoId);
  const [password, setPassword] = useState("demo2026");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [step, setStep] = useState<LoginStep>("credentials");
  const [otp, setOtp] = useState("");

  const selected = useMemo(
    () => LOGIN_ROLES.find((item) => item.role === selectedRole) ?? LOGIN_ROLES[0],
    [selectedRole],
  );
  const SelectedIcon = selected.icon;

  function chooseRole(role: DemoRole) {
    const next = LOGIN_ROLES.find((item) => item.role === role) ?? LOGIN_ROLES[0];
    setSelectedRole(next.role);
    setIdentifier(next.demoId);
    setPassword("demo2026");
    setOtp("");
    setStep("credentials");
  }

  function continueToOtp() {
    if (!identifier.trim() || !password.trim()) {
      toast.error("Plotesoni kredencialet per te vazhduar.");
      return;
    }
    setStep("otp");
    toast.success(`OTP demo u dergua: ${DEMO_OTP}`);
  }

  async function verifyOtp() {
    if (otp !== DEMO_OTP) {
      toast.error("Kodi OTP nuk eshte i sakte. Per demo perdorni 246810.");
      return;
    }
    setStep("done");
    setRole(selectedRole);
    toast.success(`Hyrja u krye si ${DEMO_ROLES[selectedRole].label}`);
    await navigate({ to: DEMO_ROLES[selectedRole].defaultRoute });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="h-1.5 bg-accent" />
      <header className="flex min-h-[116px] items-center justify-between bg-[var(--brand-navy-dark)] px-6 text-white md:px-14">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-accent text-accent-foreground shadow-soft">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">Smart Dossier</div>
            <div className="text-xs text-white/65">Portali i Dosjeve Inteligjente</div>
          </div>
        </div>
        <div className="rounded-md border border-white/15 px-2 py-1 text-sm font-semibold">SQ</div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-7.75rem)] max-w-[620px] flex-col px-5 py-10">
        <div className="mb-8 grid grid-cols-2 gap-0 border-b md:grid-cols-4">
          {LOGIN_ROLES.map((item) => {
            const Icon = item.icon;
            const active = item.role === selectedRole;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => chooseRole(item.role)}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 border-b-2 px-3 text-sm transition-colors",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Icon className="size-4" />
                  {item.title}
                </span>
                <span className="text-[11px] font-normal">{item.hint}</span>
              </button>
            );
          })}
        </div>

        <Card className="border-0 bg-transparent p-0 shadow-none">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === "otp" ? "Verifikimi me OTP" : "Vendosni kredencialet tuaja"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Roli aktiv mbetet {DEMO_ROLES[selectedRole].label}; ndryshon vetem menyra e hyrjes.
            </p>
          </div>

          {step === "credentials" ? (
            <div className="mx-auto mt-8 max-w-[500px] space-y-6">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {selected.idLabel} <span className="text-primary">*</span>
                </Label>
                <div className="flex items-center gap-3 border-b-2 border-primary pb-2">
                  <SelectedIcon className="size-5 text-muted-foreground" />
                  <Input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder={selected.idPlaceholder}
                    className="h-11 border-0 bg-transparent px-0 text-lg shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Vendosni fjalekalimin <span className="text-primary">*</span>
                </Label>
                <div className="flex items-center gap-3 border-b-2 border-primary pb-2">
                  <LockKeyhole className="size-5 text-muted-foreground" />
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    className="h-11 border-0 bg-transparent px-0 text-lg shadow-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="grid size-9 place-items-center text-muted-foreground"
                    aria-label={showPassword ? "Fshih fjalekalimin" : "Shfaq fjalekalimin"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                <button type="button" className="text-sm text-primary">
                  Keni harruar fjalekalimin?
                </button>
              </div>

              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(value) => setRemember(Boolean(value))}
                />
                Me mbaj mend
              </label>

              <div className="space-y-3 pt-2">
                <Button
                  type="button"
                  onClick={continueToOtp}
                  className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  VAZHDONI ME IDENTIFIKIMIN
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full border-primary text-base font-semibold text-primary hover:bg-primary/10"
                >
                  REGJISTROHUNI
                </Button>
              </div>
            </div>
          ) : null}

          {step === "otp" ? (
            <div className="mx-auto mt-8 max-w-[500px] space-y-6 text-center">
              <div className="rounded-md border bg-white px-4 py-3 text-sm text-muted-foreground">
                Kodi OTP demo per {DEMO_ROLES[selectedRole].label} eshte{" "}
                <span className="font-mono font-semibold text-foreground">{DEMO_OTP}</span>.
              </div>
              <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="justify-center">
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} className="h-12 w-12 bg-white text-lg" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={verifyOtp}
                  className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  KONFIRMO OTP
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
                  Kthehu te kredencialet
                </Button>
              </div>
            </div>
          ) : null}

          {step === "done" ? (
            <div className="mx-auto mt-8 max-w-[500px] rounded-md border bg-white p-4 text-center">
              <CheckCircle2 className="mx-auto size-8 text-success" />
              <div className="mt-2 text-sm font-semibold">Hyrja u konfirmua</div>
            </div>
          ) : null}
        </Card>
      </main>
    </div>
  );
}
