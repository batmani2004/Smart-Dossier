import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  HelpCircle,
  Landmark,
  LockKeyhole,
  Search,
  ShieldCheck,
  UserCog,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
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
    hint: "Shërbime publike me NID",
    idLabel: "Numri personal (NID)",
    idPlaceholder: "H90803041W",
    icon: UserRound,
    demoId: "H90803041W",
  },
  {
    role: "business",
    title: "Biznes",
    hint: "Shërbime për subjektet",
    idLabel: "NIPT i subjektit",
    idPlaceholder: "L22334455B",
    icon: Building2,
    demoId: "L22334455B",
  },
  {
    role: "operator",
    title: "Nëpunës",
    hint: "Hapësira institucionale",
    idLabel: "ID e nëpunësit",
    idPlaceholder: "OP-1024",
    icon: UserCog,
    demoId: "OP-1024",
  },
  {
    role: "admin",
    title: "Admin",
    hint: "Administrim portali",
    idLabel: "ID e administratorit",
    idPlaceholder: "ADM-001",
    icon: ShieldCheck,
    demoId: "ADM-001",
  },
];

const DEMO_OTP = "246810";

const PORTAL_LINKS = [
  "NGJARJET E JETËS",
  "SHËRBIMET MË TË PËRDORURA",
  "KATEGORITË E SHËRBIMEVE",
  "INSTITUCIONET",
];

const SERVICE_SHORTCUTS = [
  { label: "Dokumente me vulë", icon: FileCheck2 },
  { label: "Pagesa elektronike", icon: Landmark },
  { label: "Ndihmë dhe suport", icon: HelpCircle },
];

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
      toast.error("Plotësoni të dhënat e identifikimit për të vazhduar.");
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
    setRole(selectedRole);
    toast.success(`Hyrja u krye si ${DEMO_ROLES[selectedRole].label}`);
    await navigate({ to: DEMO_ROLES[selectedRole].defaultRoute });
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-foreground">
      <header className="bg-white text-sm shadow-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-muted-foreground md:px-8">
          <div className="hidden items-center gap-5 md:flex">
            <span>Historia e e-Albania</span>
            <span>Ndihmë dhe suport</span>
            <span>Institucionet</span>
          </div>
          <div className="flex w-full items-center justify-between gap-3 md:w-auto">
            <span className="font-medium text-foreground">SQ</span>
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-3 text-sm font-semibold text-primary"
            >
              Regjistrohu
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-[#0b3d76] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-md bg-white text-[#0b3d76] shadow-soft">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-tight">Smart Dossier</div>
                <div className="text-xs text-white/70">Hapësira ime e shërbimeve digjitale</div>
              </div>
            </div>
            <nav className="hidden items-center gap-5 text-xs font-semibold tracking-wide text-white/85 lg:flex">
              {PORTAL_LINKS.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </nav>
          </div>
          <div className="flex min-h-12 items-center gap-3 rounded-md bg-white px-4 text-[#2b3850] shadow-soft">
            <Search className="size-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Kërko shërbimin, institucionin ose kodin e dosjes
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto grid min-h-[calc(100vh-11rem)] max-w-7xl gap-8 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-start">
        <section className="space-y-7">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-md bg-white px-3 py-1 text-xs font-semibold text-primary shadow-soft">
              Njoftim
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#172338] md:text-5xl">
              Gjithçka për dosjen tuaj, në një hapësirë.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Identifikohuni si qytetar, biznes ose nëpunës për të aplikuar, gjurmuar dosjen,
              shkarkuar dokumente me vulë dhe kryer pagesa elektronike.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {SERVICE_SHORTCUTS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex min-h-24 items-center gap-3 rounded-md border bg-white p-4 shadow-soft"
                >
                  <div className="grid size-10 place-items-center rounded-md bg-[var(--brand-blue-soft)] text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-md border bg-white p-5 shadow-soft">
            <div className="mb-4 text-sm font-semibold text-muted-foreground">
              Zgjidhni profilin e hyrjes
            </div>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {LOGIN_ROLES.map((item) => {
                const Icon = item.icon;
                const active = item.role === selectedRole;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => chooseRole(item.role)}
                    className={cn(
                      "flex min-h-28 flex-col items-start justify-between rounded-md border p-4 text-left transition-colors",
                      active
                        ? "border-primary bg-[var(--brand-blue-soft)] text-primary"
                        : "border-border bg-white text-foreground hover:border-primary/50",
                    )}
                  >
                    <Icon className="size-5" />
                    <span>
                      <span className="block text-sm font-semibold">{item.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{item.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <Card className="border bg-white p-5 shadow-lift md:p-6">
          <div className="border-b pb-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">
              Hyr në portal
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {step === "otp" ? "Verifikimi me kod OTP" : "Identifikimi elektronik"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step === "otp"
                ? "Vendosni kodin e dërguar për të përfunduar hyrjen."
                : `Profili aktiv: ${DEMO_ROLES[selectedRole].label}. Të dhënat janë të plotësuara për demo.`}
            </p>
          </div>

          {step === "credentials" ? (
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  {selected.idLabel} <span className="text-primary">*</span>
                </Label>
                <div className="flex items-center gap-3 rounded-md border bg-card px-3">
                  <SelectedIcon className="size-5 text-primary" />
                  <Input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder={selected.idPlaceholder}
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
                    aria-label={showPassword ? "Fshih fjalekalimin" : "Shfaq fjalekalimin"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                <button type="button" className="text-sm font-medium text-primary">
                  Keni harruar fjalëkalimin?
                </button>
              </div>

              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(value) => setRemember(Boolean(value))}
                />
                Më mbaj mend
              </label>

              <div className="space-y-3 pt-2">
                <Button
                  type="button"
                  onClick={continueToOtp}
                  className="h-12 w-full text-base font-semibold"
                >
                  Hyr
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full border-primary text-base font-semibold text-primary hover:bg-primary/10"
                >
                  Regjistrohu
                </Button>
              </div>

              <div className="rounded-md bg-muted p-3 text-xs leading-5 text-muted-foreground">
                Për demo: përdorni fjalëkalimin <span className="font-mono">demo2026</span> dhe
                kodin OTP <span className="font-mono">{DEMO_OTP}</span>.
              </div>
            </div>
          ) : null}

          {step === "otp" ? (
            <div className="mt-6 space-y-6 text-center">
              <div className="rounded-md border bg-muted px-4 py-3 text-sm text-muted-foreground">
                Kodi OTP demo për {DEMO_ROLES[selectedRole].label} është{" "}
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
