import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCog,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
        content: "Hyrje dhe regjistrim i thjeshte per Qytetar, Biznes dhe Operator.",
      },
    ],
  }),
  component: LoginPage,
});

type AuthMode = "login" | "register";
type LoginRole = Exclude<DemoRole, "admin">;
type RegisterRole = Extract<LoginRole, "citizen" | "business">;

type RoleOption = {
  role: LoginRole;
  title: string;
  hint: string;
  idLabel: string;
  idPlaceholder: string;
  icon: LucideIcon;
  demoId: string;
  destination: string;
  actionLabel: string;
};

const LOGIN_ROLES: RoleOption[] = [
  {
    role: "citizen",
    title: "Qytetar",
    hint: "Aplikim dhe gjurmim dosjeje",
    idLabel: "Numri personal (NID)",
    idPlaceholder: "H90803041W",
    icon: UserRound,
    demoId: "H90803041W",
    destination: "Hapet faqja e aplikimit per qytetar",
    actionLabel: "Hyr si qytetar",
  },
  {
    role: "business",
    title: "Biznes",
    hint: "Regjistrim prone me NIPT",
    idLabel: "NIPT i subjektit",
    idPlaceholder: "L22334455B",
    icon: Building2,
    demoId: "L22334455B",
    destination: "Hapet portali i biznesit",
    actionLabel: "Hyr si biznes",
  },
  {
    role: "operator",
    title: "Operator",
    hint: "Dosje, AI dhe raporte pune",
    idLabel: "ID e operatorit",
    idPlaceholder: "OP-1024",
    icon: UserCog,
    demoId: "OP-1024",
    destination: "Hapet lista e dosjeve",
    actionLabel: "Hyr si operator",
  },
];

const REGISTER_ROLES = LOGIN_ROLES.filter(
  (item) => item.role === "citizen" || item.role === "business",
) as Array<RoleOption & { role: RegisterRole }>;

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

  const selected = useMemo(
    () => LOGIN_ROLES.find((item) => item.role === selectedRole) ?? LOGIN_ROLES[0],
    [selectedRole],
  );
  const visibleRoles = authMode === "register" ? REGISTER_ROLES : LOGIN_ROLES;
  const SelectedIcon = selected.icon;
  const isBusinessRegistration = authMode === "register" && selectedRole === "business";

  function applyDefaults(role: LoginRole) {
    const next = LOGIN_ROLES.find((item) => item.role === role) ?? LOGIN_ROLES[0];
    setSelectedRole(next.role);
    setFullName(DEMO_ROLES[next.role].displayName);
    setRepresentativeName(next.role === "business" ? "Arben Dervishi" : "");
    setEmail(next.role === "business" ? "info@albatech.al" : "elira.kola@email.al");
    setPhone(next.role === "business" ? "+355 69 555 0101" : "+355 69 123 4567");
    setAddress(next.role === "business" ? "Rruga e Durresit, Tirane" : "Tirane");
    setIdentifier(next.demoId);
    setPassword("demo2026");
  }

  function chooseRole(role: LoginRole) {
    if (authMode === "register" && role === "operator") return;
    applyDefaults(role);
  }

  function startRegister() {
    setAuthMode("register");
    applyDefaults(selectedRole === "business" ? "business" : "citizen");
    setAcceptTerms(true);
  }

  function startLogin() {
    setAuthMode("login");
    applyDefaults(selectedRole);
  }

  function validateLogin() {
    if (!identifier.trim() || !password.trim()) {
      toast.error("Plotesoni ID/NIPT dhe fjalekalimin.");
      return false;
    }
    return true;
  }

  function validateRegistration() {
    if (selectedRole === "operator") {
      toast.error("Regjistrimi eshte vetem per qytetare dhe biznese.");
      return false;
    }
    if (!fullName.trim()) {
      toast.error(
        isBusinessRegistration ? "Plotesoni emrin ligjor te biznesit." : "Plotesoni emrin e plote.",
      );
      return false;
    }
    if (!identifier.trim()) {
      toast.error(isBusinessRegistration ? "Plotesoni NIPT-in." : "Plotesoni NID-in.");
      return false;
    }
    if (isBusinessRegistration && !representativeName.trim()) {
      toast.error("Plotesoni emrin e perfaqesuesit ligjor.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Plotesoni nje email te vlefshem.");
      return false;
    }
    if (!phone.trim() || !address.trim()) {
      toast.error("Plotesoni telefonin dhe adresen.");
      return false;
    }
    if (!password.trim() || password.trim().length < 6) {
      toast.error("Fjalekalimi duhet te kete te pakten 6 karaktere.");
      return false;
    }
    if (!acceptTerms) {
      toast.error("Konfirmoni te dhenat per te krijuar profilin.");
      return false;
    }
    return true;
  }

  async function submitAccess() {
    const isValid = authMode === "register" ? validateRegistration() : validateLogin();
    if (!isValid) return;

    setRole(selectedRole);
    toast.success(
      authMode === "register"
        ? `Profili u krijua si ${DEMO_ROLES[selectedRole].label}.`
        : `Hyrja u krye si ${DEMO_ROLES[selectedRole].label}.`,
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
            <AlbanianLanguageFlag />
            <Button
              asChild
              variant="ghost"
              className="h-9 px-2 text-sm font-semibold text-muted-foreground hover:text-primary sm:px-3"
            >
              <Link to="/admin-login">Hyrje admin</Link>
            </Button>
            <Button
              type="button"
              variant={authMode === "register" ? "default" : "outline"}
              className="h-9 px-3 text-sm font-semibold"
              onClick={startRegister}
            >
              Regjistrohu
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-4.25rem)] max-w-6xl gap-5 px-4 py-5 md:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
        <section className="rounded-md border bg-white p-5 shadow-soft md:p-6">
          <div className="mb-2 inline-flex rounded-md bg-[var(--brand-blue-soft)] px-2.5 py-1 text-xs font-semibold text-primary">
            Hyrje e thjeshte
          </div>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Zgjidh profilin dhe hap direkt faqen qe te duhet.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Qytetaret aplikojne ose gjurmojne dosjen, bizneset regjistrojne prone me NIPT, ndersa
            operatoret hyjne ne hapesiren e punes.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <AccessPath
              icon={FileText}
              title="Qytetar"
              body="Aplikim per privatizim, shpronesim ose gjurmim me kod."
            />
            <AccessPath
              icon={Building2}
              title="Biznes"
              body="Regjistrim prone dhe ndjekje e aplikimit me link."
            />
            <AccessPath
              icon={UserCog}
              title="Operator"
              body="Dosje, AI Akt Vleresimi, audit dhe raporte."
            />
          </div>

          <div className="mt-5 rounded-md border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <div className="text-sm font-semibold">Pa hapa te panevojshem</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Ky prototip hap menjehere faqen perkatese pas hyrjes ose regjistrimit. Kodi i
                  gjurmimit krijohet me vone, kur dergohet aplikimi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Card className="border bg-white p-4 shadow-lift md:p-5">
          <div className="grid grid-cols-2 rounded-md bg-muted p-1">
            <button
              type="button"
              onClick={startLogin}
              className={cn(
                "h-10 rounded-md text-sm font-semibold transition-colors",
                authMode === "login"
                  ? "bg-white text-primary shadow-soft"
                  : "text-muted-foreground",
              )}
            >
              Hyr
            </button>
            <button
              type="button"
              onClick={startRegister}
              className={cn(
                "h-10 rounded-md text-sm font-semibold transition-colors",
                authMode === "register"
                  ? "bg-white text-primary shadow-soft"
                  : "text-muted-foreground",
              )}
            >
              Regjistrohu
            </button>
          </div>

          <div className="mt-4 border-b pb-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">
              {authMode === "register" ? "Krijo profil" : "Hyr ne portal"}
            </div>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
              {authMode === "register"
                ? isBusinessRegistration
                  ? "Regjistrim biznesi"
                  : "Regjistrim qytetari"
                : "Identifikimi elektronik"}
            </h2>
            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              {authMode === "register"
                ? "Regjistrimi eshte i hapur vetem per qytetare dhe biznese."
                : `${selected.destination}. Te dhenat demo jane te plotesuara.`}
            </p>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-sm font-semibold text-muted-foreground">
              {authMode === "register" ? "Zgjidh llojin e profilit" : "Zgjidh si do te hysh"}
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
                      "flex min-h-20 flex-col items-start justify-between rounded-md border p-3 text-left transition-colors",
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

          <div className="mt-4 space-y-4">
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
            </div>

            {authMode === "register" ? (
              <label className="flex items-start gap-2 text-sm leading-5">
                <Checkbox
                  checked={acceptTerms}
                  onCheckedChange={(value) => setAcceptTerms(Boolean(value))}
                  className="mt-0.5"
                />
                <span>Konfirmoj qe te dhenat jane te sakta dhe dua te krijoj profilin.</span>
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
              <Button
                type="button"
                onClick={submitAccess}
                className="h-11 w-full text-base font-semibold"
              >
                {authMode === "register"
                  ? isBusinessRegistration
                    ? "Krijo profil biznesi"
                    : "Krijo profil qytetari"
                  : selected.actionLabel}
                <ArrowRight className="ml-2 size-4" />
              </Button>

              {authMode === "register" ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-full text-primary"
                  onClick={startLogin}
                >
                  Kam llogari, dua te hyj
                </Button>
              ) : selectedRole === "operator" ? (
                <div className="rounded-md border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
                  Operatoret krijohen dhe menaxhohen nga administratori. Per hyrje admin perdorni
                  linkun lart.
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full border-primary text-base font-semibold text-primary hover:bg-primary/10"
                  onClick={startRegister}
                >
                  Nuk kam llogari, regjistrohu
                </Button>
              )}
            </div>

            <div className="rounded-md bg-muted p-2.5 text-xs leading-5 text-muted-foreground">
              Per demo: fushat jane te plotesuara. Klikimi i butonit hap direkt faqen e rolit te
              zgjedhur.
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

function FieldShell({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-card px-3">
      <Icon className="size-5 shrink-0 text-primary" />
      {children}
    </div>
  );
}

function AccessPath({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-md border bg-white p-3 shadow-soft">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        {title}
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}

function AlbanianLanguageFlag() {
  return (
    <span
      className="hidden h-8 w-10 items-center justify-center rounded-md border bg-white shadow-soft sm:inline-flex"
      role="img"
      aria-label="Gjuha shqip"
      title="Gjuha shqip"
    >
      <svg
        width="26"
        height="18"
        viewBox="0 0 26 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="26" height="18" rx="2" fill="#E41E20" />
        <path
          d="M13 4.2c-.7.9-1.1 1.6-1.1 2.3 0 .4.2.8.4 1.1-.7-.3-1.4-.7-2-1.2-.7-.5-1.4-.8-2.2-.8.6.6.8 1.2.7 1.9-.8-.3-1.6-.3-2.4.1.8.4 1.3.9 1.6 1.6-.7.1-1.3.5-1.8 1.1.8 0 1.5.2 2.1.6-.4.5-.5 1.1-.4 1.8.8-.5 1.7-.8 2.6-.8.8 0 1.5.3 2.1.9v1.4h-1.4v1h3.6v-1h-1.4v-1.4c.6-.6 1.3-.9 2.1-.9.9 0 1.8.3 2.6.8.1-.7 0-1.3-.4-1.8.6-.4 1.3-.6 2.1-.6-.5-.6-1.1-1-1.8-1.1.3-.7.8-1.2 1.6-1.6-.8-.4-1.6-.4-2.4-.1-.1-.7.1-1.3.7-1.9-.8 0-1.5.3-2.2.8-.6.5-1.3.9-2 1.2.2-.3.4-.7.4-1.1 0-.7-.4-1.4-1.1-2.3Z"
          fill="#111111"
        />
        <path d="M11.2 4.5 9.8 3.1h2.1L13 2l1.1 1.1h2.1l-1.4 1.4H11.2Z" fill="#111111" />
      </svg>
    </span>
  );
}
