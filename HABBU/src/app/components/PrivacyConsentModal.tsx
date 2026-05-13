import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { useState } from "react";

export interface PrivacyConsent {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  thirdParty: boolean;
}

interface PrivacyConsentModalProps {
  open: boolean;
  onAccept: (consent: PrivacyConsent) => void;
  onOpenPolicy?: () => void;
}

const OPTIONAL_USES: {
  key: keyof PrivacyConsent;
  label: string;
  description: string;
}[] = [
  {
    key: "analytics",
    label: "Analítica de uso",
    description:
      "Métricas anónimas para entender cómo se usa la plataforma y mejorarla.",
  },
  {
    key: "marketing",
    label: "Correos de novedades",
    description:
      "Recibir mensajes ocasionales sobre nuevas funciones o consejos de Habbu.",
  },
  {
    key: "personalization",
    label: "Recomendaciones personalizadas",
    description:
      "Ajustar retos y sugerencias según tus hábitos e intereses.",
  },
  {
    key: "thirdParty",
    label: "Servicios de terceros",
    description:
      "Compartir datos limitados con proveedores externos para funciones específicas.",
  },
];

export function PrivacyConsentModal({
  open,
  onAccept,
  onOpenPolicy,
}: PrivacyConsentModalProps) {
  const [consent, setConsent] = useState<PrivacyConsent>({
    analytics: false,
    marketing: false,
    personalization: false,
    thirdParty: false,
  });

  const toggle = (key: keyof PrivacyConsent) =>
    setConsent((c) => ({ ...c, [key]: !c[key] }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-consent-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start gap-4 px-8 pb-4 pt-8">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 id="privacy-consent-title" className="text-foreground">
                  Tus datos y privacidad
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Antes de continuar, queremos contarte cómo usamos tu
                  información.
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-4 px-8 pb-2 text-sm text-muted-foreground">
              <p>
                Usamos tus datos personales para crear tu cuenta, personalizar
                tu experiencia, registrar tu progreso en los hábitos y mejorar
                el funcionamiento de la plataforma.
              </p>
              <p>
                Si te encuentras en la Unión Europea o el Espacio Económico
                Europeo, el tratamiento de tus datos podrá realizarse conforme
                a las normas aplicables de protección de datos, incluido el
                Reglamento General de Protección de Datos —RGPD/GDPR—.
              </p>
              <p>
                Puedes consultar cómo recopilamos, usamos, almacenamos y
                protegemos tu información en nuestra{" "}
                <button
                  type="button"
                  onClick={onOpenPolicy}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Política de Privacidad
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
                .
              </p>
            </div>

            {/* Optional consents */}
            <div className="mt-5 px-8">
              <h3 className="mb-3 text-sm text-foreground">
                Usos opcionales (puedes activarlos si quieres)
              </h3>
              <div className="space-y-2">
                {OPTIONAL_USES.map((use) => (
                  <label
                    key={use.key}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      checked={consent[use.key]}
                      onChange={() => toggle(use.key)}
                      className="mt-1 h-4 w-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{use.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {use.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer / actions */}
            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border bg-muted/30 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onOpenPolicy}
                className="text-sm text-primary hover:underline"
              >
                Leer Política de Privacidad
              </button>
              <button
                type="button"
                onClick={() => onAccept(consent)}
                className="rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-md transition-transform hover:scale-[1.02] hover:bg-primary/90"
              >
                Aceptar y continuar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
