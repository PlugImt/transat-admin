import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiRefreshCw, FiClock } from 'react-icons/fi';
import { GiWashingMachine, GiClothes } from 'react-icons/gi';
import { RiWaterFlashFill } from 'react-icons/ri';
import confetti from 'canvas-confetti';

import type { Route, Machine, LaundryData } from "./+types/laundry";

// Brand colors
const colors = {
  background: "#070402",
  foreground: "#ffe6cc",
  card: "#1e1515",
  primary: "#ec7f32",
  secondary: "#0049a8",
  muted: "#494949",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transat - Laundry" },
    { name: "description", content: "Check the availability of washing machines and dryers" },
  ];
};

export default function Laundry() {
  const { t } = useTranslation();
  const [laundryData, setLaundryData] = useState<LaundryData | null>(null);
  const [localData, setLocalData] = useState<LaundryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const [showConfetti, setShowConfetti] = useState<number | null>(null);
  const [finishedMachines, setFinishedMachines] = useState<number[]>([]);
  const machineRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  const triggerConfetti = (machineNumber: number) => {
    setShowConfetti(machineNumber);
    
    const element = machineRefs.current[machineNumber];
    if (element) {
      const rect = element.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y: y - 0.1 },
        colors: [colors.primary, colors.secondary, colors.foreground],
      });
    }
    
    setTimeout(() => setShowConfetti(null), 3000);
  };

  const fetchLaundryData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://transat.destimt.fr/api/washingmachines');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLaundryData(data.data);
        setLocalData(JSON.parse(JSON.stringify(data.data))); // Deep copy for local countdown
        setLastUpdated(new Date());
      } else {
        throw new Error('Failed to fetch laundry data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Start countdown timer
  useEffect(() => {
    // Clear existing interval if any
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }

    if (localData) {
      // Track currently in-use machines to detect when they finish
      const inUseMachines: number[] = [];
      
      [...localData.washing_machine, ...localData.dryer]
        .filter(m => !m.available && m.time_left > 0)
        .forEach(m => inUseMachines.push(m.number));
      
      countdownInterval.current = setInterval(() => {
        setLocalData(prevData => {
          if (!prevData) return null;
          
          const newData: LaundryData = JSON.parse(JSON.stringify(prevData));
          const justFinished: number[] = [];
          
          // Update washing machines
          newData.washing_machine = newData.washing_machine.map(machine => {
            if (!machine.available && machine.time_left > 0) {
              const newTimeLeft = machine.time_left - 1;
              // Check if machine just finished
              if (newTimeLeft === 0 && !finishedMachines.includes(machine.number)) {
                justFinished.push(machine.number);
              }
              return { ...machine, time_left: newTimeLeft };
            }
            return machine;
          });
          
          // Update dryers
          newData.dryer = newData.dryer.map(machine => {
            if (!machine.available && machine.time_left > 0) {
              const newTimeLeft = machine.time_left - 1;
              // Check if machine just finished
              if (newTimeLeft === 0 && !finishedMachines.includes(machine.number)) {
                justFinished.push(machine.number);
              }
              return { ...machine, time_left: newTimeLeft };
            }
            return machine;
          });
          
          // Trigger confetti for machines that just finished
          if (justFinished.length > 0) {
            // Add to finished machines list
            setFinishedMachines(prev => [...prev, ...justFinished]);
            // Trigger confetti for the first one
            setTimeout(() => triggerConfetti(justFinished[0]), 500);
          }
          
          return newData;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, [laundryData, finishedMachines]);

  useEffect(() => {
    fetchLaundryData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchLaundryData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Format time left in minutes and seconds
  const formatTimeLeft = (seconds: number) => {
    if (seconds <= 0) return '-';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage based on estimated total times
  const calculateProgress = (machine: Machine) => {
    if (machine.available || machine.time_left <= 0) return 100;
    
    // Standard durations in seconds
    const WASHING_DURATION = 40 * 60; // 40 minutes for washing machine
    const DRYING_DURATION = 60 * 60;  // 60 minutes for dryer
    
    // Determine max duration based on machine type
    const maxDuration = machine.number < 15 ? WASHING_DURATION : DRYING_DURATION;
    
    // Calculate percentage completed
    return ((maxDuration - machine.time_left) / maxDuration) * 100;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: {
        duration: 0.5
      }
    }
  };

  const waterDropVariants = {
    start: { 
      y: -10, 
      opacity: 0 
    },
    animate: { 
      y: 20, 
      opacity: [0, 1, 0],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const bubbleVariants = {
    start: { scale: 0.5, opacity: 0.7 },
    animate: {
      scale: [0.5, 1.2, 0.8],
      opacity: [0.7, 1, 0],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { 
      repeat: Infinity, 
      repeatType: "reverse" as const,
      duration: 1.5
    }
  };

  const shakeVariants = {
    start: { rotate: 0 },
    animate: {
      rotate: [0, -1, 2, -2, 1, 0],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 2,
        repeatDelay: 1
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto relative">
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="card stats-card max-w-screen-lg mx-auto mb-6" style={{ backgroundColor: colors.card }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: colors.foreground }}>
            {t('laundry.title')}
          </h1>
          <p className="opacity-80 text-center max-w-2xl mx-auto" style={{ color: colors.foreground }}>
            {t('laundry.description')}
          </p>
        </div>

        <div className="flex justify-between items-center mb-2 px-2">
          {lastUpdated && (
            <p className="text-sm opacity-70" style={{ color: colors.foreground }}>
              {t('laundry.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: `${colors.primary}33` 
            }}
            onClick={fetchLaundryData}
            className="flex items-center gap-2 transition-colors px-4 py-2 rounded-full"
            disabled={loading}
            style={{ color: colors.primary }}
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
            {loading ? t('laundry.refreshing') : t('laundry.refresh')}
          </motion.button>
        </div>
      </motion.section>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-opacity-20 mb-8"
          style={{ backgroundColor: `${colors.primary}22`, color: colors.primary }}
        >
          <p>{error}</p>
          <button 
            onClick={fetchLaundryData}
            className="mt-4 hover:underline"
            style={{ color: colors.primary }}
          >
            {t('laundry.tryAgain')}
          </button>
        </motion.div>
      )}

      {loading && !localData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card" style={{ backgroundColor: colors.card }}>
            <div className="skeleton-loader h-8 w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-loader h-16 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="card" style={{ backgroundColor: colors.card }}>
            <div className="skeleton-loader h-8 w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-loader h-16 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Washing Machines */}
          <motion.div 
            className="card relative overflow-hidden"
            style={{ backgroundColor: colors.card }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Background water drops for washing machines */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`drop-${i}`}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    color: colors.primary
                  }}
                  variants={waterDropVariants}
                  initial="start"
                  animate="animate"
                  custom={i}
                >
                  <RiWaterFlashFill size={10 + Math.random() * 8} />
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center mb-6 relative z-10">
              <motion.div
                variants={shakeVariants}
                initial="start"
                animate="animate"
              >
                <GiWashingMachine style={{ color: colors.primary }} className="text-2xl mr-3" />
              </motion.div>
              <h2 className="text-2xl font-bold" style={{ color: colors.foreground }}>
                {t('laundry.washingMachines')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {localData?.washing_machine.map((machine) => {
                  const isInUse = !machine.available && machine.time_left > 0;
                  const progressPercent = calculateProgress(machine);
                  const justFinished = showConfetti === machine.number;
                  
                  return (
                    <motion.div 
                      key={machine.number}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative overflow-hidden rounded-lg"
                      style={{ 
                        borderWidth: '2px',
                        borderColor: machine.available 
                          ? colors.secondary 
                          : machine.time_left === 0 
                            ? colors.primary
                            : colors.muted
                      }}
                      ref={el => machineRefs.current[machine.number] = el}
                    >
                      {/* Background progress bar */}
                      <div 
                        className="absolute inset-0 rounded-lg opacity-20"
                        style={{ 
                          backgroundColor: machine.available 
                            ? colors.secondary
                            : machine.time_left === 0
                              ? colors.primary
                              : colors.muted
                        }}
                      ></div>
                      
                      {/* Animated progress indicator */}
                      {!machine.available && (
                        <motion.div 
                          className="absolute top-0 bottom-0 left-0 rounded-l-lg"
                          style={{ backgroundColor: colors.primary, opacity: 0.3 }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      )}
                      
                      {/* Bubbles animation for active machines */}
                      {isInUse && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={`bubble-${machine.number}-${i}`}
                              className="absolute rounded-full"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${Math.random() * 100}%`,
                                backgroundColor: colors.foreground,
                                width: 4 + Math.random() * 10,
                                height: 4 + Math.random() * 10,
                                opacity: 0.4
                              }}
                              variants={bubbleVariants}
                              initial="start"
                              animate="animate"
                              custom={i}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="relative z-10 flex items-center justify-between p-5 rounded-lg">
                        <div className="flex items-center">
                          <motion.div 
                            className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg"
                            style={{ 
                              backgroundColor: machine.available 
                                ? colors.secondary 
                                : machine.time_left === 0
                                  ? colors.primary
                                  : colors.muted,
                              color: colors.background
                            }}
                            animate={isInUse ? { y: [0, -3, 0] } : {}}
                            transition={{
                              repeat: isInUse ? Infinity : 0,
                              duration: 1,
                              repeatType: "reverse"
                            }}
                          >
                            {machine.number}
                          </motion.div>
                          <div className="ml-4">
                            <motion.span 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ 
                                backgroundColor: machine.available 
                                  ? colors.secondary 
                                  : machine.time_left === 0
                                    ? colors.primary
                                    : colors.muted,
                                color: colors.background
                              }}
                              animate={justFinished ? { scale: [1, 1.5, 1] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              {machine.available 
                                ? t('laundry.available') 
                                : machine.time_left === 0
                                  ? "✨ " + t('laundry.finished') + " ✨"
                                  : t('laundry.inUse')
                              }
                            </motion.span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {isInUse ? (
                            <motion.div 
                              animate={pulseAnimation}
                              className="flex items-center"
                              style={{ color: colors.primary }}
                            >
                              <FiClock className="mr-2" />
                              <span className="font-mono text-xl font-bold" style={{ color: colors.foreground }}>
                                {formatTimeLeft(machine.time_left)}
                              </span>
                            </motion.div>
                          ) : (
                            <motion.span 
                              className="font-mono text-xl font-bold"
                              style={{ 
                                color: machine.available 
                                  ? colors.secondary 
                                  : colors.primary
                              }}
                              animate={justFinished ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                              transition={{ duration: 0.5, repeat: justFinished ? 3 : 0 }}
                            >
                              {machine.available ? "Ready" : "Finished"}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Dryers */}
          <motion.div 
            className="card relative overflow-hidden"
            style={{ backgroundColor: colors.card }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Background heat waves for dryers */}
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="absolute h-8 rounded-full opacity-50"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: colors.primary,
                    width: 30 + Math.random() * 60,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            
            <div className="flex items-center mb-6 relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <GiClothes style={{ color: colors.primary }} className="text-2xl mr-3" />
              </motion.div>
              <h2 className="text-2xl font-bold" style={{ color: colors.foreground }}>
                {t('laundry.dryers')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {localData?.dryer.map((machine) => {
                  const isInUse = !machine.available && machine.time_left > 0;
                  const progressPercent = calculateProgress(machine);
                  const justFinished = showConfetti === machine.number;
                  
                  return (
                    <motion.div 
                      key={machine.number}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative overflow-hidden rounded-lg"
                      style={{ 
                        borderWidth: '2px',
                        borderColor: machine.available 
                          ? colors.secondary 
                          : machine.time_left === 0 
                            ? colors.primary
                            : colors.muted
                      }}
                      ref={el => machineRefs.current[machine.number] = el}
                    >
                      {/* Background progress bar */}
                      <div 
                        className="absolute inset-0 rounded-lg opacity-20"
                        style={{ 
                          backgroundColor: machine.available 
                            ? colors.secondary
                            : machine.time_left === 0
                              ? colors.primary
                              : colors.muted
                        }}
                      ></div>
                      
                      {/* Animated progress indicator */}
                      {!machine.available && (
                        <motion.div 
                          className="absolute top-0 bottom-0 left-0 rounded-l-lg"
                          style={{ backgroundColor: colors.primary, opacity: 0.3 }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      )}
                      
                      {/* Heat waves animation for active dryers */}
                      {isInUse && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={`heat-${machine.number}-${i}`}
                              className="absolute rounded-full"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                bottom: 0,
                                backgroundColor: colors.primary,
                                width: 15 + Math.random() * 20,
                                height: 4,
                                opacity: 0.3
                              }}
                              animate={{
                                y: [0, -20 - Math.random() * 40],
                                opacity: [0.3, 0],
                                width: [15 + Math.random() * 20, 5 + Math.random() * 10]
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 2 + Math.random() * 2,
                                delay: Math.random() * 2
                              }}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="relative z-10 flex items-center justify-between p-5 rounded-lg">
                        <div className="flex items-center">
                          <motion.div 
                            className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg"
                            style={{ 
                              backgroundColor: machine.available 
                                ? colors.secondary 
                                : machine.time_left === 0
                                  ? colors.primary
                                  : colors.muted,
                              color: colors.background
                            }}
                            animate={isInUse ? { rotate: [0, 5, -5, 0] } : {}}
                            transition={{
                              repeat: isInUse ? Infinity : 0,
                              duration: 3,
                            }}
                          >
                            {machine.number}
                          </motion.div>
                          <div className="ml-4">
                            <motion.span 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ 
                                backgroundColor: machine.available 
                                  ? colors.secondary 
                                  : machine.time_left === 0
                                    ? colors.primary
                                    : colors.muted,
                                color: colors.background
                              }}
                              animate={justFinished ? { scale: [1, 1.5, 1] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              {machine.available 
                                ? t('laundry.available') 
                                : machine.time_left === 0
                                  ? "✨ " + t('laundry.finished') + " ✨"
                                  : t('laundry.inUse')
                              }
                            </motion.span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {isInUse ? (
                            <motion.div 
                              animate={pulseAnimation}
                              className="flex items-center"
                              style={{ color: colors.primary }}
                            >
                              <FiClock className="mr-2" />
                              <span className="font-mono text-xl font-bold" style={{ color: colors.foreground }}>
                                {formatTimeLeft(machine.time_left)}
                              </span>
                            </motion.div>
                          ) : (
                            <motion.span 
                              className="font-mono text-xl font-bold"
                              style={{ 
                                color: machine.available 
                                  ? colors.secondary 
                                  : colors.primary
                              }}
                              animate={justFinished ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                              transition={{ duration: 0.5, repeat: justFinished ? 3 : 0 }}
                            >
                              {machine.available ? "Ready" : "Finished"}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 