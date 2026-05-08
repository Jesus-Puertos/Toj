// WalletCard -- tarjeta de saldo wallet con gradiente verde TOJ
type WalletCardProps = {
  saldo: number;
  clabe: string;
};

export function WalletCard({ saldo, clabe }: WalletCardProps) {
  const formattedSaldo = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(saldo);

  return (
    <div className="relative bg-wallet-gradient rounded-2xl p-5 shadow-wallet overflow-hidden">
      {/* Circulo decorativo semitransparente */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />

      {/* Top: label + icono */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-label-caps font-bold text-white/70 tracking-widest uppercase">
          Saldo Wallet
        </p>
        <span
          className="material-symbols-outlined text-white/80 text-[22px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          account_balance_wallet
        </span>
      </div>

      {/* Centro: monto */}
      <p className="text-h2 font-bold text-white tabular-nums">
        {formattedSaldo}
      </p>

      {/* Separador */}
      <div className="border-t border-white/20 my-4" />

      {/* Bottom: CLABE */}
      <div className="space-y-1">
        <p className="text-label-caps font-bold text-white/60 tracking-widest uppercase">
          CLABE TOJ
        </p>
        <p className="font-mono text-sm text-white/90 tracking-wider">
          {clabe}
        </p>
      </div>
    </div>
  );
}
