import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
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
      { title: "Hyrje - Smart Dossier" },
      {
        name: "description",
        content: "Hyrje institucionale demo per Admin, Operator, Qytetar dhe Biznes me OTP.",
      },
    ],
  }),
  component: LoginPage,
});

type LoginStep = "credentials" | "otp" | "done";
type AuthMode = "login" | "register";
type LoginRole = Exclude<DemoRole, "admin">;
type RegisterRole = Extract<LoginRole, "citizen" | "business">;

const LOGIN_ROLES: Array<{
  role: LoginRole;
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
    hint: "Hyrje me NID",
    idLabel: "Numri personal (NID)",
    idPlaceholder: "H90803041W",
    icon: UserRound,
    demoId: "H90803041W",
  },
  {
    role: "business",
    title: "Biznes",
    hint: "Hyrje me NIPT",
    idLabel: "NIPT i subjektit",
    idPlaceholder: "L22334455B",
    icon: Building2,
    demoId: "L22334455B",
  },
  {
    role: "operator",
    title: "Nepunes",
    hint: "Hapesire pune",
    idLabel: "ID e nepunesit",
    idPlaceholder: "OP-1024",
    icon: UserCog,
    demoId: "OP-1024",
  },
];

const REGISTER_ROLES = LOGIN_ROLES.filter(
  (item) => item.role === "citizen" || item.role === "business",
) as Array<(typeof LOGIN_ROLES)[number] & { role: RegisterRole }>;

const DEMO_OTP = "246810";

function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useDemoRole();
  const [selectedRole, setSelectedRole] = useState<LoginRole>("citizen");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("Elira Kola");
  const [representativeName, setRepresentativeName] = useState("");
  const [email, setEmail] = useState("elira.kola@email.al");
  const [phone, setPhone] = useState("+355 69 123 4567");
  const [address, setAddress] = useState("Tirane");
  const [identifier, setIdentifier] = useState(LOGIN_ROLES[0].demoId);
  const [password, setPassword] = useState("demo2026");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [step, setStep] = useState<LoginStep>("credentials");
  const [otp, setOtp] = useState("");

  const selected = useMemo(
    () => LOGIN_ROLES.find((item) => item.role === selectedRole) ?? LOGIN_ROLES[0],
    [selectedRole],
  );
  const SelectedIcon = selected.icon;
  const visibleRoles = authMode === "register" ? REGISTER_ROLES : LOGIN_ROLES;
  const isBusinessRegistration = authMode === "register" && selectedRole === "business";

  function chooseRole(role: LoginRole) {
    const next = LOGIN_ROLES.find((item) => item.role === role) ?? LOGIN_ROLES[0];
    setSelectedRole(next.role);
    setFullName(DEMO_ROLES[next.role].displayName);
    setRepresentativeName(next.role === "business" ? "Arben Dervishi" : "");
    setEmail(next.role === "business" ? "info@albatech.al" : "elira.kola@email.al");
    setPhone(next.role === "business" ? "+355 69 555 0101" : "+355 69 123 4567");
    setAddress(next.role === "business" ? "Rruga e Durresit, Tirane" : "Tirane");
    setIdentifier(next.demoId);
    setPassword("demo2026");
    setOtp("");
    setStep("credentials");
  }

  function startRegister() {
    const nextRole: LoginRole = selectedRole === "operator" ? "citizen" : selectedRole;
    setAuthMode("register");
    if (nextRole !== selectedRole) {
      chooseRole(nextRole);
    } else {
      setFullName(DEMO_ROLES[nextRole].displayName);
      setRepresentativeName(nextRole === "business" ? "Arben Dervishi" : "");
      setEmail(nextRole === "business" ? "info@albatech.al" : "elira.kola@email.al");
      setPhone(nextRole === "business" ? "+355 69 555 0101" : "+355 69 123 4567");
      setAddress(nextRole === "business" ? "Rruga e Durresit, Tirane" : "Tirane");
    }
    setStep("credentials");
    setOtp("");
    setAcceptTerms(true);
  }

  function startLogin() {
    setAuthMode("login");
    setStep("credentials");
    setOtp("");
  }

  function continueToOtp() {
    if (authMode === "register") {
      if (selectedRole === "operator") {
        toast.error("Regjistrimi lejohet vetem per qytetare dhe biznese.");
        return;
      }
      if (!fullName.trim()) {
        toast.error(
          isBusinessRegistration
            ? "Plotesoni emrin ligjor te biznesit."
            : "Plotesoni emrin e plote.",
        );
        return;
      }
      if (isBusinessRegistration && !representativeName.trim()) {
        toast.error("Plotesoni emrin e perfaqesuesit ligjor.");
        return;
      }
      if (!email.trim() || !phone.trim() || !address.trim()) {
        toast.error("Plotesoni email-in, telefonin dhe adresen.");
        return;
      }
      if (!acceptTerms) {
        toast.error("Pranoni kushtet e regjistrimit per te vazhduar.");
        return;
      }
    }
    if (!identifier.trim() || !password.trim()) {
      toast.error("Plotesoni te dhenat e identifikimit per te vazhduar.");
      return;
    }
    setStep("otp");
    toast.success(`Kodi OTP demo u dergua: ${DEMO_OTP}`);
  }

  async function verifyOtp() {
    if (otp !== DEMO_OTP) {
      toast.error("Kodi OTP nuk eshte i sakte. Per demo perdorni 246810.");
      return;
    }
    setStep("done");
    setRole(selectedRole);
    toast.success(
      authMode === "register"
        ? `Regjistrimi u krye si ${DEMO_ROLES[selectedRole].label}`
        : `Hyrja u krye si ${DEMO_ROLES[selectedRole].label}`,
    );
    await navigate({ to: DEMO_ROLES[selectedRole].defaultRoute });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/brand/smart-dossier-logo.svg"
              alt="Smart Dossier"
              className="h-12 w-auto max-w-[240px] shrink-0 object-contain sm:h-14 sm:max-w-[270px]"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <img
              src="/brand/albanian-flag.svg"
              alt="Gjuha shqip"
              title="Gjuha shqip"
              className="hidden h-[18px] w-[26px] shrink-0 object-cover sm:block"
            />
            <Button
              asChild
              variant="ghost"
              className="h-9 px-2 text-sm font-semibold text-muted-foreground hover:text-primary sm:px-3"
            >
              <Link to="/admin-login">Hyrje admin</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-sm font-semibold text-primary"
              onClick={startRegister}
            >
              Regjistrohu
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-4.25rem)] max-w-6xl gap-5 px-4 py-5 md:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <section className="rounded-md border bg-white p-5 shadow-soft md:p-6">
          <div>
            <div className="mb-2 inline-flex rounded-md bg-[var(--brand-blue-soft)] px-2.5 py-1 text-xs font-semibold text-primary">
              Portal sherbimesh
            </div>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Identifikohuni dhe vazhdoni me dosjen tuaj.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Zgjidhni profilin, konfirmoni hyrjen me OTP dhe vazhdoni me aplikime, gjurmim dosjeje
              ose dokumente elektronike.
            </p>
          </div>

          <div className="mt-5">
            <div className="mb-3 text-sm font-semibold text-muted-foreground">
              {authMode === "register"
                ? "Regjistrimi eshte vetem per qytetare dhe biznese"
                : "Zgjidhni profilin e hyrjes"}
            </div>
            <div
              className={cn(
                "grid grid-cols-1 gap-2",
                authMode === "register" ? "sm:grid-cols-2" : "sm:grid-cols-3",
              )}
            >
              {visibleRoles.map((item) => {
                const Icon = item.icon;
                const active = item.role === selectedRole;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => chooseRole(item.role)}
                    className={cn(
                      "flex min-h-24 flex-col items-start justify-between rounded-md border p-3 text-left transition-colors",
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

        <Card className="border bg-white p-4 shadow-lift md:p-5">
          <div className="border-b pb-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">
              Hyr ne portal
            </div>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
              {step === "otp"
                ? "Verifikimi me kod OTP"
                : authMode === "register"
                  ? "Regjistrim i ri"
                  : "Identifikimi elektronik"}
            </h2>
            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              {step === "otp"
                ? "Vendosni kodin e derguar per te perfunduar hyrjen."
                : authMode === "register"
                  ? `Krijoni profil demo si ${DEMO_ROLES[selectedRole].label}. Regjistrimi nuk hapet per nepunes ose admin.`
                  : `Profili aktiv: ${DEMO_ROLES[selectedRole].label}. Te dhenat jane te plotesuara per demo.`}
            </p>
          </div>

          {step === "credentials" ? (
            <div className="mt-4 space-y-4">
              {authMode === "register" ? (
                <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-start gap-2">
                    <SelectedIcon className="mt-0.5 size-4 text-primary" />
                    <div>
                      <div className="text-sm font-semibold">
                        {isBusinessRegistration
                          ? "Formular regjistrimi per biznes"
                          : "Formular regjistrimi per qytetar"}
                      </div>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                        {isBusinessRegistration
                          ? "Perdor NIPT-in dhe te dhenat e perfaqesuesit ligjor per te krijuar profilin e biznesit."
                          : "Perdor NID-in dhe te dhenat personale per te krijuar profilin qytetar."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {authMode === "register" ? (
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">
                    {isBusinessRegistration ? "Emri ligjor i biznesit" : "Emri i plote"}{" "}
                    <span className="text-primary">*</span>
                  </Label>
                  <FieldShell icon={isBusinessRegistration ? Building2 : UserRound}>
                    <Input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder={isBusinessRegistration ? "AlbaTech sh.p.k." : "Elira Kola"}
                      className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                    />
                  </FieldShell>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  {selected.idLabel} <span className="text-primary">*</span>
                </Label>
                <FieldShell icon={SelectedIcon}>
                  <Input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder={selected.idPlaceholder}
                    className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                  />
                </FieldShell>
              </div>

              {isBusinessRegistration ? (
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">
                    Perfaqesuesi ligjor <span className="text-primary">*</span>
                  </Label>
                  <FieldShell icon={UserRound}>
                    <Input
                      value={representativeName}
                      onChange={(event) => setRepresentativeName(event.target.value)}
                      placeholder="Arben Dervishi"
                      className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                    />
                  </FieldShell>
                </div>
              ) : null}

              {authMode === "register" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-foreground">
                      Email <span className="text-primary">*</span>
                    </Label>
                    <FieldShell icon={Mail}>
                      <Input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        placeholder={isBusinessRegistration ? "info@biznes.al" : "emri@email.al"}
                        className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                      />
                    </FieldShell>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-foreground">
                      Telefon <span className="text-primary">*</span>
                    </Label>
                    <FieldShell icon={Phone}>
                      <Input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="+355 69 000 0000"
                        className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                      />
                    </FieldShell>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-sm font-semibold text-foreground">
                      Adresa <span className="text-primary">*</span>
                    </Label>
                    <FieldShell icon={MapPin}>
                      <Input
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Qyteti, rruga ose njesia administrative"
                        className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                      />
                    </FieldShell>
                  </div>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-foreground">
                  Fjalekalimi <span className="text-primary">*</span>
                </Label>
                <div className="flex items-center gap-3 rounded-md border bg-card px-3">
                  <LockKeyhole className="size-5 text-primary" />
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
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
                {authMode === "login" ? (
                  <button type="button" className="text-sm font-medium text-primary">
                    Keni harruar fjalekalimin?
                  </button>
                ) : null}
              </div>

              {authMode === "register" ? (
                <label className="flex items-start gap-2 text-sm leading-5">
                  <Checkbox
                    checked={acceptTerms}
                    onCheckedChange={(value) => setAcceptTerms(Boolean(value))}
                    className="mt-0.5"
                  />
                  <span>
                    Konfirmoj qe te dhenat jane te sakta dhe pranoj verifikimin elektronik me OTP.
                  </span>
                </label>
              ) : (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(value) => setRemember(Boolean(value))}
                  />
                  Me mbaj mend
                </label>
              )}

              <div className="space-y-2 pt-1">
                {authMode === "register" ? (
                  <>
                    <Button
                      type="button"
                      onClick={continueToOtp}
                      className="h-11 w-full text-base font-semibold"
                    >
                      {isBusinessRegistration ? "Krijo profil biznesi" : "Krijo profil qytetar"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-10 w-full text-primary"
                      onClick={startLogin}
                    >
                      Kam llogari, hyr
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={continueToOtp}
                      className="h-11 w-full text-base font-semibold"
                    >
                      Hyr
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full border-primary text-base font-semibold text-primary hover:bg-primary/10"
                      onClick={startRegister}
                    >
                      Regjistrohu
                    </Button>
                  </>
                )}
              </div>

              <div className="rounded-md bg-muted p-2.5 text-xs leading-5 text-muted-foreground">
                Per demo: perdorni fjalekalimin <span className="font-mono">demo2026</span> dhe
                kodin OTP <span className="font-mono">{DEMO_OTP}</span>.
              </div>
            </div>
          ) : null}

          {step === "otp" ? (
            <div className="mt-5 space-y-5 text-center">
              <div className="rounded-md border bg-muted px-4 py-3 text-sm text-muted-foreground">
                Kodi OTP demo per {DEMO_ROLES[selectedRole].label} eshte{" "}
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
                      className="h-11 w-11 bg-white text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={verifyOtp}
                  className="h-11 w-full text-base font-semibold"
                >
                  Konfirmo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-full"
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
            <div className="mt-5 rounded-md border bg-muted p-4 text-center">
              <CheckCircle2 className="mx-auto size-8 text-success" />
              <div className="mt-2 text-sm font-semibold">Hyrja u konfirmua</div>
            </div>
          ) : null}
        </Card>
      </main>
    </div>
  );
}

function FieldShell({ icon: Icon, children }: { icon: typeof UserRound; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-card px-3">
      <Icon className="size-5 shrink-0 text-primary" />
      {children}
    </div>
  );
}
