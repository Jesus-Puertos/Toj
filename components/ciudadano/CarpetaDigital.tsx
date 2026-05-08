// CarpetaDigital -- grid de documentos digitales del ciudadano (datos demo)

type DocumentTile = {
  icon: string;
  label: string;
  status: 'activo' | 'pendiente';
};

const DOCUMENTOS: DocumentTile[] = [
  { icon: 'badge',          label: 'INE Digital',       status: 'activo'    },
  { icon: 'directions_car', label: 'Licencia',           status: 'activo'    },
  { icon: 'home',           label: 'Comprobante Dom.',   status: 'pendiente' },
  { icon: 'receipt_long',   label: 'Recibo Predial',     status: 'activo'    },
];

export function CarpetaDigital() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {DOCUMENTOS.map((doc) => (
          <button
            key={doc.label}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col items-center gap-2 text-center active:scale-95 transition-transform duration-100 hover:border-primary/40 hover:bg-primary/5"
          >
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: '32px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
            >
              {doc.icon}
            </span>
            <span className="text-body-sm font-semibold text-on-surface leading-tight">
              {doc.label}
            </span>
            {doc.status === 'activo' ? (
              <span className="text-[11px] font-semibold text-primary flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Activo
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-secondary">Pendiente</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
