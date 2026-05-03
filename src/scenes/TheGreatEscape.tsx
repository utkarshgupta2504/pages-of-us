import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reverse cipher mapping
const cipherMap: { [key: string]: string } = {
  Z: 'A', Y: 'B', X: 'C', W: 'D', V: 'E', U: 'F', T: 'G', S: 'H', R: 'I',
  Q: 'J', P: 'K', O: 'L', N: 'M', M: 'N', L: 'O', K: 'P', J: 'Q', I: 'R',
  H: 'S', G: 'T', F: 'U', E: 'V', D: 'W', C: 'X', B: 'Y', A: 'Z',
};

const decodeCipher = (word: string): string => {
  return word.split('').map(c => cipherMap[c.toUpperCase()] || c).join('');
};

const TheGreatEscape = () => {
  // Step progression
  const [currentStep, setCurrentStep] = useState(0);
  const [stepComplete, setStepComplete] = useState(false);
  const [canAdvance, setCanAdvance] = useState(false);

  // Step-specific states
  const [cipherRevealed, setCipherRevealed] = useState(false);
  const [keyRetrieved, setKeyRetrieved] = useState(false);
  const [chainUnlocked, setChainUnlocked] = useState(false);
  const [caseNumberRevealed, setCaseNumberRevealed] = useState(false);
  const [ladderPieces, setLadderPieces] = useState([false, false, false, false]);
  const [cardSequence, setCardSequence] = useState<number[]>([]);
  const [draggedWords, setDraggedWords] = useState<{ [key: number]: boolean }>({});
  const [wordPositions, setWordPositions] = useState<{ [key: number]: number }>({});
  const [doorOpen, setDoorOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Story tracking
  const [visibleNarrative, setVisibleNarrative] = useState<string[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);

  // Auto-progress to next step when current is complete
  useEffect(() => {
    if (stepComplete && currentStep < 7) {
      setCanAdvance(false);
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setStepComplete(false);
        setCanAdvance(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [stepComplete, currentStep]);

  // Timer
  useEffect(() => {
    const timeTimer = setInterval(() => {
      setTimeElapsed((t) => {
        if (t >= 75) return 75;
        return t + 1;
      });
    }, 200);
    return () => clearInterval(timeTimer);
  }, []);

  // Narrative display timing
  useEffect(() => {
    const narratives = [
      { text: "They locked us in…", delay: 800 },
      { text: "You were chained… I wasn't", delay: 2200 },
      { text: "And we had one hour", delay: 3800 },
    ];
    narratives.forEach((n, i) => {
      setTimeout(() => setVisibleNarrative(prev => [...prev, n.text]), n.delay);
    });
    setCanAdvance(true);
  }, []);

  // Track mouse for pipe following (Step 2)
  useEffect(() => {
    if (currentStep !== 2) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (!keyRef.current) return;
      const keyRect = keyRef.current.getBoundingClientRect();
      const distance = Math.hypot(
        e.clientX - keyRect.left - keyRect.width / 2,
        e.clientY - keyRect.top - keyRect.height / 2
      );
      
      if (distance < 100 && !keyRetrieved) {
        setKeyRetrieved(true);
        setStepComplete(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentStep, keyRetrieved]);

  // Handle ladder assembly (step 4)
  const handleLadderPiece = (index: number) => {
    const newPieces = [...ladderPieces];
    newPieces[index] = true;
    setLadderPieces(newPieces);
    if (newPieces.every(p => p)) {
      setStepComplete(true);
    }
  };

  // Handle card puzzle (step 5)
  const handleCardClick = (cardNum: number) => {
    const newSequence = [...cardSequence, cardNum];
    setCardSequence(newSequence);
    if (newSequence.length === 3 && JSON.stringify(newSequence) === JSON.stringify([1, 2, 3])) {
      setStepComplete(true);
    } else if (newSequence.length === 3) {
      setCardSequence([]);
    }
  };

  // Handle word dragging (step 6)
  const handleWordDragStart = (wordIdx: number) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('wordIdx', String(wordIdx));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleWordDrop = (slotIdx: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const wordIdx = parseInt(e.dataTransfer.getData('wordIdx'));
    const newPositions = { ...wordPositions, [wordIdx]: slotIdx };
    setWordPositions(newPositions);

    // Check if puzzle is complete: slot 0=0, slot 1=2, slot 2=1 (Together, Free, Finally)
    if (Object.keys(newPositions).length === 3) {
      const isCorrect =
        newPositions[0] === 0 &&
        newPositions[2] === 1 &&
        newPositions[1] === 2;
      if (isCorrect) {
        setStepComplete(true);
      }
    }
  };

  // Handle final escape
  const handleEscape = () => {
    setDoorOpen(true);
    setShowFinal(true);
  };

  const timeDisplay = `${Math.floor(timeElapsed / 60)}:${String(timeElapsed % 60).padStart(2, '0')}`;
  const timeExceeded = timeElapsed > 60;

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Dark prison ambience */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, hsl(255, 35%, 10%) 0%, hsl(245, 40%, 12%) 40%, hsl(235, 45%, 8%) 100%)',
        }}
      />

      {/* Ambient spotlight */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 440,
          height: 280,
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse at center, hsl(50, 90%, 60%, 0.08) 0%, hsl(280, 70%, 50%, 0.04) 48%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 5.2, repeat: Infinity }}
      />

      {/* Timer (always visible) */}
      <motion.div
        className={`glass-panel px-6 py-3 rounded-xl mb-6 relative z-10 ${timeExceeded ? 'border-amber-400/50' : 'border-white/20'}`}
        animate={timeExceeded ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.8, repeat: timeExceeded ? Infinity : 0 }}
      >
        <p className={`scene-text text-3xl md:text-4xl text-center font-mono ${timeExceeded ? 'text-amber-300' : 'text-white'}`}>
          {timeDisplay}
        </p>
        {timeExceeded && (
          <motion.p
            className="scene-text text-xs text-amber-300 text-center mt-1"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            +{timeElapsed - 60}m over
          </motion.p>
        )}
      </motion.div>

      {/* Main content area */}
      <AnimatePresence mode="wait">
        {/* STEP 0: INTRO - LOCKED IN */}
        {currentStep === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center space-y-6 max-w-lg"
          >
            <motion.div className="flex gap-8 justify-center items-center text-6xl">
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⛓️
              </motion.span>
              <span>😰</span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚶
              </motion.span>
            </motion.div>
            <div className="space-y-3">
              {visibleNarrative.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="scene-text text-lg md:text-xl italic text-white/90"
                >
                  "{text}"
                </motion.p>
              ))}
            </div>
            <motion.button
              onClick={() => {
                setCanAdvance(false);
                setStepComplete(true);
              }}
              disabled={!canAdvance}
              className={`mt-4 px-6 py-2 border rounded-lg text-white scene-text transition-all ${
                canAdvance
                  ? 'glass-panel border-white/20 hover:border-white/40 cursor-pointer'
                  : 'border-white/10 opacity-50 cursor-default'
              }`}
              whileHover={canAdvance ? { scale: 1.05 } : {}}
              whileTap={canAdvance ? { scale: 0.95 } : {}}
            >
              Begin
            </motion.button>
          </motion.div>
        )}

        {/* STEP 1: REVERSE CIPHER */}
        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center space-y-6 max-w-lg"
          >
            <p className="scene-text text-lg text-white/70">The first clue… wasn't obvious</p>
            
            <div className="space-y-4">
              <div className="glass-panel px-6 py-4 rounded-xl border border-white/20">
                <p className="scene-text text-3xl font-mono text-amber-300 mb-2">HVWDIH</p>
                <p className="scene-text text-xs text-white/50">A → Z, B → Y, C → X...</p>
              </div>

              <motion.button
                onClick={() => setCipherRevealed(true)}
                disabled={!canAdvance}
                className={`glass-panel px-8 py-3 rounded-xl border transition-all w-full ${
                  canAdvance
                    ? 'border-white/20 hover:border-white/40 cursor-pointer'
                    : 'border-white/10 opacity-50 cursor-default'
                }`}
                whileHover={canAdvance ? { scale: 1.02 } : {}}
                whileTap={canAdvance ? { scale: 0.98 } : {}}
              >
                <p className="scene-text text-white">{cipherRevealed ? '✓ Decoded' : 'Reveal'}</p>
              </motion.button>
            </div>

            {cipherRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="glass-panel px-6 py-4 rounded-xl border border-emerald-400/50 bg-emerald-500/10"
                >
                  <p className="scene-text text-3xl font-mono text-emerald-300">RESCUE</p>
                </motion.div>
                <motion.button
                  onClick={() => setStepComplete(true)}
                  disabled={!canAdvance}
                  className={`px-4 py-2 text-white scene-text text-sm border transition-all ${
                    canAdvance
                      ? 'border-emerald-300/50 hover:border-emerald-300 cursor-pointer'
                      : 'border-white/10 opacity-50 cursor-default'
                  }`}
                  whileHover={canAdvance ? { scale: 1.05 } : {}}
                >
                  Continue
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 2: KEY RETRIEVAL (PIPE TOOL) */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center space-y-6 max-w-lg"
            ref={containerRef}
          >
            <p className="scene-text text-lg text-white/70">You couldn't reach it… so we found a way</p>
            
            <p className="scene-text text-xs text-white/50 mb-2">Move your cursor to the key →</p>

            <div className="relative h-48 flex items-center justify-center">
              {/* Pipe following cursor */}
              <motion.div
                className="absolute text-6xl pointer-events-none"
                animate={{
                  x: mousePos.x - 200,
                  y: mousePos.y - 150,
                }}
                transition={{ type: 'spring', damping: 20, mass: 0.5 }}
              >
                ⚒️
              </motion.div>

              {/* Key (target) */}
              <motion.div
                ref={keyRef}
                className="absolute text-6xl"
                animate={keyRetrieved ? { x: 0, y: 120, scale: 0.5, opacity: 0.3 } : { x: 0, y: 0 }}
              >
                🔑
              </motion.div>

              {/* Chain visual */}
              {!keyRetrieved && (
                <motion.div
                  className="absolute text-3xl top-12"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⛓️
                </motion.div>
              )}
            </div>

            {keyRetrieved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-2"
              >
                <p className="scene-text text-emerald-300 text-sm">✓ The chain broke free</p>
                <motion.button
                  onClick={() => setStepComplete(true)}
                  disabled={!canAdvance}
                  className={`px-4 py-2 text-white scene-text text-sm border transition-all rounded-lg ${
                    canAdvance
                      ? 'border-emerald-300/50 hover:border-emerald-300 cursor-pointer'
                      : 'border-white/10 opacity-50 cursor-default'
                  }`}
                  whileHover={canAdvance ? { scale: 1.05 } : {}}
                >
                  Continue
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 3: CASE FILE CLUE */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center space-y-6 max-w-lg"
          >
            <p className="scene-text text-lg text-white/70">The answer… was literally on us</p>
            
            <div className="flex gap-4 justify-center items-center text-5xl">
              <span>👕</span>
              <span className="text-3xl">+</span>
              <span>📋</span>
            </div>

            <motion.button
              onClick={() => setCaseNumberRevealed(true)}
              className="glass-panel px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <p className="scene-text text-2xl font-mono text-white">
                {caseNumberRevealed ? '7734' : '????'}
              </p>
            </motion.button>

            {caseNumberRevealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-2"
              >
                <p className="scene-text text-sm text-white/60">Case number 7734</p>
                <motion.button
                  onClick={() => setStepComplete(true)}
                  className="px-4 py-2 text-white scene-text text-sm border border-white/30 rounded-lg hover:border-white/60 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  Continue
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 4: LADDER BUILD */}
        {currentStep === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center space-y-6 max-w-lg"
          >
            <p className="scene-text text-lg text-white/70">Step by step… we built our way up</p>
            
            <div className="space-y-3">
              {ladderPieces.map((completed, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleLadderPiece(i)}
                  disabled={completed}
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    completed ? 'bg-emerald-500/30 border border-emerald-400' : 'glass-panel border border-white/20 hover:border-white/40'
                  }`}
                  whileHover={!completed ? { scale: 1.02 } : {}}
                  whileTap={!completed ? { scale: 0.98 } : {}}
                >
                  <motion.span
                    animate={completed ? { rotate: 360 } : {}}
                    transition={completed ? { duration: 0.5 } : {}}
                    className="scene-text text-xl"
                  >
                    {completed ? '✓' : '⭕'} Rung {i + 1}
                  </motion.span>
                </motion.button>
              ))}
            </div>

            {ladderPieces.every(p => p) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-2 pt-2"
              >
                <motion.span
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-5xl block"
                >
                  🪜
                </motion.span>
                <motion.button
                  onClick={() => setStepComplete(true)}
                  className="px-4 py-2 text-white scene-text text-sm border border-emerald-300/50 rounded-lg hover:border-emerald-300 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  Continue
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 5: CARD PUZZLE */}
        {currentStep === 5 && (
          <motion.div
            key="step-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center space-y-6 max-w-lg"
          >
            <p className="scene-text text-lg text-white/70">Somewhere in the mess… there was a pattern</p>
            
            <p className="scene-text text-sm text-white/50 mb-2">Click cards in order: 1 → 2 → 3</p>

            <div className="flex gap-4 justify-center flex-wrap">
              {[1, 2, 3].map((num) => {
                const selected = cardSequence.includes(num);
                const correctOrder = cardSequence.indexOf(num);
                return (
                  <motion.button
                    key={num}
                    onClick={() => canAdvance && handleCardClick(num)}
                    disabled={cardSequence.length >= 3 || !canAdvance}
                    className={`w-20 h-28 rounded-xl flex flex-col items-center justify-center transition-all font-bold text-2xl ${
                      selected
                        ? 'bg-blue-500/60 border-2 border-blue-300 shadow-lg shadow-blue-500/50'
                        : 'glass-panel border border-white/20 hover:border-white/40'
                    } ${(cardSequence.length >= 3 || !canAdvance) && !selected ? 'opacity-60' : ''}`}
                    whileHover={cardSequence.length < 3 && canAdvance ? { scale: 1.08 } : {}}
                    whileTap={cardSequence.length < 3 && canAdvance ? { scale: 0.92 } : {}}
                  >
                    <div className="text-2xl mb-2">🂠</div>
                    <div className="text-3xl text-white">{num}</div>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xl text-blue-300 font-bold mt-1"
                      >
                        {correctOrder + 1}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {cardSequence.length > 0 && cardSequence.length < 3 && (
              <p className="scene-text text-xs text-white/60">Progress: {cardSequence.length} / 3</p>
            )}

            {cardSequence.length === 3 && JSON.stringify(cardSequence) !== JSON.stringify([1, 2, 3]) && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <p className="scene-text text-sm text-amber-300">❌ Wrong order, try again</p>
                <motion.button
                  onClick={() => setCardSequence([])}
                  disabled={!canAdvance}
                  className={`px-3 py-1 text-white scene-text text-xs border transition-all rounded ${
                    canAdvance
                      ? 'border-amber-300/50 hover:border-amber-300 cursor-pointer'
                      : 'border-white/10 opacity-50 cursor-default'
                  }`}
                  whileHover={canAdvance ? { scale: 1.05 } : {}}
                >
                  Reset
                </motion.button>
              </motion.div>
            )}

            {JSON.stringify(cardSequence) === JSON.stringify([1, 2, 3]) && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
              >
                <p className="scene-text text-sm text-emerald-300">✓ The pattern aligned</p>
                <motion.button
                  onClick={() => setStepComplete(true)}
                  disabled={!canAdvance}
                  className={`px-4 py-2 text-white scene-text text-sm border transition-all rounded-lg ${
                    canAdvance
                      ? 'border-emerald-300/50 hover:border-emerald-300 cursor-pointer'
                      : 'border-white/10 opacity-50 cursor-default'
                  }`}
                  whileHover={canAdvance ? { scale: 1.05 } : {}}
                >
                  Continue
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 6: WORD PUZZLE - DRAGGABLE */}
        {currentStep === 6 && (
          <motion.div
            key="step-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center space-y-6 max-w-lg"
          >
            <p className="scene-text text-lg text-white/70">It all came together… one word at a time</p>

            <div className="space-y-4">
              {/* Drop zones */}
              <div className="space-y-2">
                <p className="scene-text text-xs text-white/50">Build the phrase:</p>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2].map((slot) => {
                    const wordAtSlot = Object.entries(wordPositions).find(([_, s]) => s === slot)?.[0];
                    const words = ['We', 'solved', 'it'];
                    const wordIdx = wordAtSlot ? parseInt(wordAtSlot) : null;

                    return (
                      <div
                        key={`slot-${slot}`}
                        onDragOver={handleDragOver}
                        onDrop={handleWordDrop(slot)}
                        className="flex-1 min-h-16 glass-panel border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center p-2 hover:border-white/40 transition-all"
                      >
                        {wordIdx !== null ? (
                          <div
                            draggable
                            onDragStart={handleWordDragStart(wordIdx)}
                            className="scene-text font-semibold text-white cursor-grab active:cursor-grabbing"
                          >
                            {words[wordIdx]}
                          </div>
                        ) : (
                          <p className="scene-text text-xs text-white/30">?</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Draggable words */}
              <div className="space-y-2 pt-4">
                <p className="scene-text text-xs text-white/50">Drag words to slots:</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {['We', 'solved', 'it'].map((word, idx) => {
                    const isPlaced = Object.keys(wordPositions).includes(String(idx));

                    return (
                      <div
                        key={word}
                        draggable
                        onDragStart={handleWordDragStart(idx)}
                        className={`px-4 py-2 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
                          isPlaced
                            ? 'bg-emerald-500/30 border border-emerald-300 opacity-60'
                            : 'glass-panel border border-white/20 hover:border-white/40 hover:bg-white/5'
                        }`}
                      >
                        <p className="scene-text font-medium text-white">{word}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset button */}
              {Object.keys(wordPositions).length > 0 && (
                <motion.button
                  onClick={() => setWordPositions({})}
                  disabled={!canAdvance}
                  className={`px-3 py-1 text-white scene-text text-xs border transition-all rounded ${
                    canAdvance
                      ? 'border-white/30 hover:border-white/60 cursor-pointer'
                      : 'border-white/10 opacity-50 cursor-default'
                  }`}
                  whileHover={canAdvance ? { scale: 1.05 } : {}}
                >
                  Reset
                </motion.button>
              )}
            </div>

            {Object.keys(wordPositions).length === 3 &&
              wordPositions[0] === 0 &&
              wordPositions[1] === 1 &&
              wordPositions[2] === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-2 pt-2"
                >
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="scene-text text-lg text-emerald-300"
                  >
                    ✓ "We solved it"
                  </motion.p>
                  <motion.button
                    onClick={() => setStepComplete(true)}
                    disabled={!canAdvance}
                    className={`px-4 py-2 text-white scene-text text-sm border transition-all rounded-lg ${
                      canAdvance
                        ? 'border-emerald-300/50 hover:border-emerald-300 cursor-pointer'
                        : 'border-white/10 opacity-50 cursor-default'
                    }`}
                    whileHover={canAdvance ? { scale: 1.05 } : {}}
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}
          </motion.div>
        )}

        {/* STEP 7: FINAL ESCAPE */}
        {currentStep === 7 && (
          <motion.div
            key="step-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center space-y-6 max-w-lg"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={doorOpen ? { x: 100, opacity: 0 } : {}}
            >
              🚪
            </motion.div>

            {doorOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <motion.div className="text-7xl">☀️</motion.div>
                <p className="scene-text text-lg text-white/90">We didn't make it in time…</p>
                <p className="scene-text text-lg text-white/90">But we didn't stop either</p>
              </motion.div>
            )}

            {!doorOpen && (
              <motion.button
                onClick={handleEscape}
                className="glass-panel px-8 py-4 rounded-xl border border-white/20 hover:border-emerald-400 transition-all"
                whileHover={{ scale: 1.05, borderColor: 'hsl(120, 70%, 50%)' }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="scene-text text-lg text-white">Unlock the Door</p>
              </motion.button>
            )}

            {showFinal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4 pt-4"
              >
                <motion.span
                  className="text-7xl block"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  🏅
                </motion.span>
                <p className="scene-text text-lg text-white font-medium">
                  Extra {timeElapsed - 60} minutes…<br />and we still made it out
                </p>
                <p className="scene-text text-base text-emerald-300">Together</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TheGreatEscape;
