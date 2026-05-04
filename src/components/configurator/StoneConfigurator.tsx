import { useState } from 'react';

const basePrice: Record<string, number> = { essenza: 2950, signature: 4850, atelier: 8200 };
const stoneExtra: Record<string, number> = { travertijn: 0, emperador: 200, calacatta: 500, statuario: 800 };
const finishExtra: Record<string, number> = { gepolijst: 0, gezoet: 200, geborsteld: 150 };

const marbleTextures: Record<string, string> = {
  travertijn: 'linear-gradient(135deg, #e8d9be 0%, #d4c4a0 25%, #c8b48a 50%, #d6c4a2 75%, #e2d4b8 100%)',
  emperador: 'linear-gradient(155deg, #5c3d1e 0%, #7a5228 20%, #4e3518 40%, #6b4520 60%, #3e2810 80%, #5a3d1c 100%)',
  calacatta: 'linear-gradient(140deg, #f4ede0 0%, #ede0cc 20%, #f0e8d8 40%, #e8dcc8 60%, #f2eadc 80%, #ede4d2 100%)',
  statuario: 'linear-gradient(125deg, #f8f5f0 0%, #f0ece6 30%, #f5f1eb 60%, #ece8e2 100%)',
};

const stoneNames: Record<string, string> = {
  travertijn: 'Travertijn Classico',
  emperador: 'Light Emperador',
  calacatta: 'Calacatta Viola',
  statuario: 'Statuario',
};

const tierStones: Record<string, string[]> = {
  essenza: ['travertijn', 'emperador'],
  signature: ['travertijn', 'emperador', 'calacatta'],
  atelier: ['calacatta', 'statuario'],
};

const darkStones = ['emperador'];

const tiers = [
  { id: 'essenza', name: 'Essenza', price: 'vanaf €2.950', sub: 'Licht Mediterraan', badge: '' },
  { id: 'signature', name: 'Signature', price: 'vanaf €4.850', sub: 'Onze bestseller', badge: 'MEEST GEKOZEN' },
  { id: 'atelier', name: 'Atelier Edition', price: 'vanaf €8.200', sub: 'Genummerd 1/12', badge: '' },
];

const finishes = [
  { id: 'gepolijst', label: 'Gepolijst', extra: '' },
  { id: 'gezoet', label: 'Gezoet', extra: '+€200' },
  { id: 'geborsteld', label: 'Geborsteld', extra: '+€150' },
];

const bases = [
  { id: 'slim-zwart', label: 'Slim staal zwart' },
  { id: 'slim-goud', label: 'Slim staal goud' },
  { id: 'eiken', label: 'Massief eiken' },
  { id: 'smeedijzer', label: 'Smeedijzer' },
];

export default function StoneConfigurator() {
  const [tier, setTier] = useState('signature');
  const [stone, setStone] = useState('calacatta');
  const [shape, setShape] = useState('rechthoek');
  const [size, setSize] = useState('220x100');
  const [finish, setFinish] = useState('gepolijst');
  const [base, setBase] = useState('slim-zwart');

  const total = (basePrice[tier] ?? 4850) + (stoneExtra[stone] ?? 0) + (finishExtra[finish] ?? 0);

  const availableStones = tierStones[tier] ?? [];
  const visibleStone = availableStones.includes(stone) ? stone : availableStones[0];
  const stoneBg = marbleTextures[visibleStone];
  const stoneTextColor = darkStones.includes(visibleStone) ? '#f0e8d8' : '#2a1f12';

  const roundSizes = ['⌀120', '⌀140', '⌀160', 'Maatwerk'];
  const rectSizes = ['200x90', '220x100', '240x100', 'Maatwerk'];
  const sizes = shape === 'rond' ? roundSizes : rectSizes;

  const labelStyle = {
    fontSize: '11px',
    letterSpacing: '0.15em',
    color: '#c9a96e',
    marginBottom: '12px',
    display: 'block',
    textTransform: 'uppercase' as const,
  };

  const sectionStyle = { marginBottom: '32px' };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', background: '#0a0a0a', minHeight: '600px' }}>
      {/* LEFT: marble panel */}
      <div
        style={{
          flex: 1,
          minWidth: '320px',
          minHeight: '500px',
          background: stoneBg,
          transition: 'background 0.6s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div style={{ padding: '40px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: stoneTextColor, opacity: 0.7, marginBottom: '12px' }}>
            STEENSOORT
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: stoneTextColor, margin: 0, fontWeight: 400 }}>
            {stoneNames[visibleStone]}
          </h2>
        </div>
        <div style={{ padding: '40px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#c9a96e' }}>
            {tiers.find((t) => t.id === tier)?.name.toUpperCase()}
          </div>
        </div>
      </div>

      {/* RIGHT: options */}
      <div style={{ flex: 1, minWidth: '320px', padding: '48px 40px', background: '#0a0a0a', color: '#f0e8d8' }}>
        {/* SERIE */}
        <div style={sectionStyle}>
          <span style={labelStyle}>SERIE</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tiers.map((t) => {
              const selected = tier === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setTier(t.id)}
                  style={{
                    flex: '1 1 100px',
                    cursor: 'pointer',
                    padding: '14px 12px',
                    border: selected ? '2px solid #c9a96e' : '1px solid #2a2a2a',
                    background: selected ? '#1a1208' : 'transparent',
                    position: 'relative',
                    borderRadius: '2px',
                  }}
                >
                  {t.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#c9a96e',
                        color: '#0a0a0a',
                        fontSize: '10px',
                        padding: '2px 6px',
                        letterSpacing: '0.1em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t.badge}
                    </div>
                  )}
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#f0e8d8', marginBottom: '4px' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#c9a96e', marginBottom: '4px' }}>{t.price}</div>
                  <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>{t.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEEN */}
        <div style={sectionStyle}>
          <span style={labelStyle}>STEEN</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            {availableStones.map((s) => {
              const selected = visibleStone === s;
              return (
                <div key={s} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setStone(s)}>
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '4px',
                      background: marbleTextures[s],
                      outline: selected ? '2px solid #c9a96e' : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#aaa', marginTop: '8px' }}>{stoneNames[s]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FORMAAT */}
        <div style={sectionStyle}>
          <span style={labelStyle}>FORMAAT</span>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['rond', 'rechthoek'].map((sh) => {
              const selected = shape === sh;
              return (
                <button
                  key={sh}
                  onClick={() => {
                    setShape(sh);
                    setSize(sh === 'rond' ? '⌀140' : '220x100');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    cursor: 'pointer',
                    background: selected ? '#c9a96e' : 'transparent',
                    color: selected ? '#0a0a0a' : '#f0e8d8',
                    border: '1px solid ' + (selected ? '#c9a96e' : '#2a2a2a'),
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {sh}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {sizes.map((sz) => {
              const selected = size === sz;
              return (
                <button
                  key={sz}
                  onClick={() => setSize(sz)}
                  style={{
                    flex: '1 1 80px',
                    padding: '10px',
                    cursor: 'pointer',
                    background: selected ? '#c9a96e' : 'transparent',
                    color: selected ? '#0a0a0a' : '#f0e8d8',
                    border: '1px solid ' + (selected ? '#c9a96e' : '#2a2a2a'),
                    fontSize: '12px',
                  }}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* AFWERKING */}
        <div style={sectionStyle}>
          <span style={labelStyle}>AFWERKING</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {finishes.map((f) => {
              const selected = finish === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFinish(f.id)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    cursor: 'pointer',
                    background: selected ? '#c9a96e' : 'transparent',
                    color: selected ? '#0a0a0a' : '#f0e8d8',
                    border: '1px solid ' + (selected ? '#c9a96e' : '#2a2a2a'),
                    fontSize: '12px',
                  }}
                >
                  {f.label} {f.extra && <span style={{ opacity: 0.7, fontSize: '10px' }}>{f.extra}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ONDERSTEL */}
        <div style={sectionStyle}>
          <span style={labelStyle}>ONDERSTEL</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {bases.map((b) => {
              const selected = base === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setBase(b.id)}
                  style={{
                    flex: '1 1 140px',
                    padding: '12px',
                    cursor: 'pointer',
                    background: selected ? '#c9a96e' : 'transparent',
                    color: selected ? '#0a0a0a' : '#f0e8d8',
                    border: '1px solid ' + (selected ? '#c9a96e' : '#2a2a2a'),
                    fontSize: '12px',
                  }}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRIJS + CTA */}
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #2a2a2a' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: '#c9a96e', lineHeight: 1 }}>
            €{total.toLocaleString('nl-NL')}
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '8px', marginBottom: '20px' }}>
            Inclusief BTW · Transport inbegrepen · 2 jaar garantie
          </div>
          <button
            onClick={() => {
              window.location.href = '/aanvraag';
            }}
            style={{
              width: '100%',
              background: '#c9a96e',
              color: '#0a0a0a',
              padding: '16px',
              letterSpacing: '0.1em',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Start uw aanvraag →
          </button>
        </div>
      </div>
    </div>
  );
}
