import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const crafts = [
  {
    id: 'paint',
    name: 'Paint by Numbers',
    emoji: '🎨',
    description: 'Custom canvas from our memory',
  },
  {
    id: 'scratch',
    name: 'Scratch Art',
    emoji: '🖤',
    description: 'Hidden colors revealed',
  },
  {
    id: 'diamond',
    name: 'Diamond Painting',
    emoji: '💎',
    description: 'Piece by piece, it shines',
  },
  {
    id: 'flowers',
    name: 'Pipe Cleaner Flowers',
    emoji: '🌻',
    description: 'Sunflowers & more',
  },
];

const paintGrid = [
  [1, 1, 2, 2, 3, 3, 2, 1],
  [1, 2, 2, 3, 3, 4, 2, 1],
  [2, 2, 3, 3, 4, 4, 3, 2],
  [2, 3, 3, 4, 5, 4, 3, 2],
  [2, 3, 4, 5, 5, 4, 3, 2],
  [1, 2, 3, 4, 4, 3, 2, 1],
  [1, 1, 2, 3, 3, 2, 1, 1],
  [1, 1, 2, 2, 2, 2, 1, 1],
];

const paintColors: Record<number, string> = {
  1: 'hsl(210, 80%, 62%)',
  2: 'hsl(185, 75%, 58%)',
  3: 'hsl(35, 85%, 62%)',
  4: 'hsl(16, 85%, 60%)',
  5: 'hsl(330, 70%, 65%)',
};

const diamondColors = [
  'hsl(187, 90%, 65%)',
  'hsl(290, 78%, 72%)',
  'hsl(45, 90%, 68%)',
  'hsl(10, 90%, 68%)',
  'hsl(215, 90%, 68%)',
  'hsl(160, 80%, 60%)',
];

const moduleShell =
  'relative w-[min(92vw,420px)] h-[260px] rounded-xl overflow-hidden border border-white/20';

const PaintModule = ({ onComplete }: { onComplete: () => void }) => {
  const allNumbers = useMemo(() => new Set(paintGrid.flat()), []);
  const [filledNumbers, setFilledNumbers] = useState<Set<number>>(new Set());
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (filledNumbers.size === allNumbers.size) onComplete();
  }, [filledNumbers, allNumbers, onComplete]);

  const fillNumber = (value: number) => {
    if (!allNumbers.has(value)) return;
    setFilledNumbers((prev) => new Set([...prev, value]));
  };

  const isComplete = filledNumbers.size === allNumbers.size;

  return (
    <div className="w-[min(92vw,420px)]">
      <div className={`${moduleShell} h-[220px]`}>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://picsum.photos/800/500?grayscale)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="absolute inset-0 bg-black/35 p-3 grid grid-cols-8 gap-1">
          {paintGrid.flatMap((row, r) =>
            row.map((num, c) => {
              const filled = filledNumbers.has(num);
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => fillNumber(num)}
                  className="rounded-[4px] border border-white/20 text-[10px] font-semibold"
                  style={{
                    background: filled ? paintColors[num] : 'hsl(230, 20%, 16%)',
                    color: filled ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.78)',
                  }}
                >
                  {num}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-2 glass-panel px-2 py-2 rounded-lg flex items-center gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.replace(/[^1-9]/g, '').slice(0, 1))}
          placeholder="number"
          className="w-20 h-8 rounded-md bg-black/50 border border-white/30 px-2 text-white text-sm outline-none"
        />
        <button
          onClick={() => {
            const n = Number(inputValue);
            if (n) fillNumber(n);
          }}
          className="nav-button h-8 px-3 text-xs"
        >
          Fill number
        </button>
        <p className="scene-text text-xs text-white/80 ml-auto">
          {isComplete ? 'Completed ✓' : `${filledNumbers.size}/${allNumbers.size} colors filled`}
        </p>
      </div>
    </div>
  );
};

const ScratchModule = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scratching, setScratching] = useState(false);
  const [progress, setProgress] = useState(0);
  const binsRef = useRef<Set<number>>(new Set());
  const completedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0b0b12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    const binX = Math.max(0, Math.min(19, Math.floor((x / canvas.width) * 20)));
    const binY = Math.max(0, Math.min(11, Math.floor((y / canvas.height) * 12)));
    binsRef.current.add(binY * 20 + binX);

    const p = Math.min(100, Math.round((binsRef.current.size / (20 * 12)) * 100));
    setProgress(p);

    if (p >= 85 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="w-[min(92vw,420px)]">
      <div className={`${moduleShell} h-[220px]`}>
        <div
          ref={wrapperRef}
          className="absolute inset-0"
          onMouseDown={(e) => {
            setScratching(true);
            scratchAt(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => scratching && scratchAt(e.clientX, e.clientY)}
          onMouseUp={() => setScratching(false)}
          onMouseLeave={() => setScratching(false)}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, hsl(205, 90%, 60%) 0%, hsl(280, 90%, 65%) 40%, hsl(20, 90%, 62%) 100%)',
            }}
          />
          <canvas ref={canvasRef} width={420} height={260} className="absolute inset-0 w-full h-full" />
        </div>
      </div>
      <div className="mt-2 glass-panel px-2 py-2 rounded-lg flex items-center justify-between">
        <p className="scene-text text-xs text-white/80">Click + drag to scratch</p>
        <p className="scene-text text-xs text-white/80">{progress >= 85 ? 'Completed ✓' : `${progress}% revealed`}</p>
      </div>
    </div>
  );
};

const DiamondModule = ({ onComplete }: { onComplete: () => void }) => {
  const [placed, setPlaced] = useState<boolean[]>(Array(20).fill(false));

  useEffect(() => {
    if (placed.every(Boolean)) onComplete();
  }, [placed, onComplete]);

  const placeDiamond = (idx: number) => {
    setPlaced((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  return (
    <div className={`${moduleShell} p-3 bg-gradient-to-br from-black/55 to-black/25`}>
      <div className="h-full grid grid-cols-5 gap-2">
        {placed.map((isPlaced, idx) => {
          const color = diamondColors[idx % diamondColors.length];
          return (
            <button
              key={idx}
              onClick={() => placeDiamond(idx)}
              className="rounded-md border border-white/20 bg-white/5 flex items-center justify-center"
            >
              {isPlaced ? (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: -45 }}
                  transition={{ duration: 0.25 }}
                  className="w-4 h-4 block shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                  style={{ background: color }}
                />
              ) : (
                <span className="text-[10px] text-white/35">+</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="scene-text text-xs text-white/80 mt-2 text-right">
        {placed.filter(Boolean).length}/{placed.length} placed
      </p>
    </div>
  );
};

const FlowersModule = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStage((s) => {
        if (s >= 3) return 3;
        return s + 1;
      });
    }, 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (stage >= 3) onComplete();
  }, [stage, onComplete]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`${moduleShell} bg-gradient-to-b from-purple-900/30 to-black/40 flex flex-col items-center justify-center`}
    >
      <motion.div
        className="text-6xl mb-2"
        animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        style={{ opacity: stage >= 1 ? 1 : 0.25 }}
      >
        🌻
      </motion.div>
      <div className="flex gap-3">
        <motion.div
          className="text-4xl"
          animate={{ y: [0, -3, 0], x: [-3, 0, -3] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }}
          style={{ opacity: stage >= 2 ? 1 : 0.25 }}
        >
          🌹
        </motion.div>
        <motion.div
          className="text-4xl"
          animate={{ y: [0, -3, 0], x: [3, 0, 3] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 0.4 }}
          style={{ opacity: stage >= 3 ? 1 : 0.25 }}
        >
          🌸
        </motion.div>
      </div>
      <p className="scene-text text-xs text-white/75 mt-3">Bouquet assembling… {Math.round((stage / 3) * 100)}%</p>
    </motion.div>
  );
};

const ThingsMade = () => {
  const [selectedCraft, setSelectedCraft] = useState<string | null>(null);
  const [completedCrafts, setCompletedCrafts] = useState<Set<string>>(new Set());

  const handleCraftComplete = (id: string) => {
    setCompletedCrafts((prev) => new Set([...prev, id]));
  };

  const completionCount = completedCrafts.size;

  const outerStoryByProgress = [
    ['"We turned memories…"', '"into something we could build together"'],
    ['"One piece came alive first…"', '"and it made us want to create more"'],
    ['"Two crafts in, we had a rhythm"', '"your patience made everything softer"'],
    ['"Almost everything was glowing now"', '"it stopped feeling like craft… felt like us"'],
    ['"We didn’t just make art"', '"we made a little world together"'],
  ] as const;

  const [outerLine1, outerLine2] = outerStoryByProgress[completionCount] ?? outerStoryByProgress[0];

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Warm creative ambience */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, hsl(35, 50%, 18%) 0%, hsl(255, 40%, 12%) 50%, hsl(255, 35%, 8%) 100%)',
        }}
      />

      {/* Soft craft glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 380,
          height: 240,
          top: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse, hsl(35, 90%, 65%, 0.14) 0%, hsl(280, 85%, 65%, 0.1) 48%, transparent 74%)',
          filter: 'blur(42px)',
        }}
        animate={{ opacity: [0.38, 0.68, 0.38] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="scene-text text-3xl md:text-4xl mb-3 relative z-10 text-white"
      >
        🎨 The Things We Made
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="scene-text text-sm text-white/80 mb-6 relative z-10"
      >
        Click each craft to explore
      </motion.p>

      {/* Craft grid / selection */}
      {!selectedCraft ? (
        <motion.div
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {crafts.map((craft) => (
            <motion.button
              key={craft.id}
              onClick={() => setSelectedCraft(craft.id)}
              className="glass-panel rounded-xl px-4 py-3 text-center relative overflow-hidden"
              whileHover={{ scale: 1.05, borderColor: 'hsl(var(--primary))' }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-3xl md:text-4xl mb-1">{craft.emoji}</p>
              <p className="scene-text text-xs md:text-sm text-white/90">{craft.name}</p>
              {completedCrafts.has(craft.id) && (
                <motion.div
                  className="absolute top-1 right-1 text-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key={selectedCraft}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 flex flex-col items-center mb-4"
        >
          {selectedCraft === 'paint' && <PaintModule onComplete={() => handleCraftComplete('paint')} />}
          {selectedCraft === 'scratch' && <ScratchModule onComplete={() => handleCraftComplete('scratch')} />}
          {selectedCraft === 'diamond' && <DiamondModule onComplete={() => handleCraftComplete('diamond')} />}
          {selectedCraft === 'flowers' && <FlowersModule onComplete={() => handleCraftComplete('flowers')} />}
        </motion.div>
      )}

      {/* Narrative text */}
      <div className="relative z-10 text-center max-w-xl space-y-2">
        {!selectedCraft && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="scene-text text-base md:text-lg italic text-white/95"
            >
              {outerLine1}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="scene-text text-base md:text-lg italic text-white/95"
            >
              {outerLine2}
            </motion.p>
            <p className="scene-text text-xs text-white/75 mt-1">{completionCount}/{crafts.length} complete</p>
          </>
        )}

        {selectedCraft === 'paint' && (
          <>
            <motion.p className="scene-text text-base md:text-lg italic text-white/90">
              "We turned a memory… into something we could build together"
            </motion.p>
            {completedCrafts.has('paint') && (
              <motion.p className="scene-text text-sm md:text-base text-emerald-300 mt-1">
                "Every number found its color" ✓
              </motion.p>
            )}
          </>
        )}

        {selectedCraft === 'scratch' && (
          <>
            <motion.p className="scene-text text-base md:text-lg italic text-white/90">
              "Some things were hidden… until you brought them out"
            </motion.p>
            {completedCrafts.has('scratch') && (
              <motion.p className="scene-text text-sm md:text-base text-emerald-300 mt-1">
                "And then the whole color story showed up" ✓
              </motion.p>
            )}
          </>
        )}

        {selectedCraft === 'diamond' && (
          <>
            <motion.p className="scene-text text-base md:text-lg italic text-white/90">
              "Piece by piece… you made it shine"
            </motion.p>
            {completedCrafts.has('diamond') && (
              <motion.p className="scene-text text-sm md:text-base text-emerald-300 mt-1">
                "Every little stud caught the light" ✓
              </motion.p>
            )}
          </>
        )}

        {selectedCraft === 'flowers' && (
          <>
            <motion.p className="scene-text text-base md:text-lg italic text-white/90">
              "You made flowers… and somehow… they felt alive"
            </motion.p>
            <motion.p className="scene-text text-lg md:text-xl text-white font-medium mt-3">
              "And of course… sunflowers"
            </motion.p>
            {completedCrafts.has('flowers') && (
              <motion.p className="scene-text text-sm md:text-base text-emerald-300 mt-1">
                "Your bouquet looked like a heartbeat" ✓
              </motion.p>
            )}
          </>
        )}

        {selectedCraft && (
          <motion.button
            onClick={() => setSelectedCraft(null)}
            className="nav-button mt-4 px-6 py-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ThingsMade;
