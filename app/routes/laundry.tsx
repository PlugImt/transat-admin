import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiClock } from 'react-icons/fi';
import { GiWashingMachine, GiClothes } from 'react-icons/gi';

import type { Route, Machine, LaundryData } from "./+types/laundry";

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
      countdownInterval.current = setInterval(() => {
        setLocalData(prevData => {
          if (!prevData) return null;
          
          const newData: LaundryData = JSON.parse(JSON.stringify(prevData));
          
          // Update washing machines
          newData.washing_machine = newData.washing_machine.map(machine => {
            if (!machine.available && machine.time_left > 0) {
              return { ...machine, time_left: machine.time_left - 1 };
            }
            return machine;
          });
          
          // Update dryers
          newData.dryer = newData.dryer.map(machine => {
            if (!machine.available && machine.time_left > 0) {
              return { ...machine, time_left: machine.time_left - 1 };
            }
            return machine;
          });
          
          return newData;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, [laundryData]);

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

  // Calculate progress percentage
  const calculateProgress = (machine: Machine) => {
    if (machine.available || !laundryData) return 0;
    
    // Find the original time from the initial API data
    const originalMachine = laundryData[machine.number < 15 ? 'washing_machine' : 'dryer'].find(
      m => m.number === machine.number
    );
    
    if (!originalMachine || originalMachine.time_left <= 0) return 0;
    
    const totalTime = originalMachine.time_left;
    const remaining = machine.time_left;
    
    // Calculate percentage completed (inverse of remaining)
    return 100 - (remaining / totalTime * 100);
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
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { 
      repeat: Infinity, 
      repeatType: "reverse" as const,
      duration: 2
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="card stats-card max-w-screen-lg mx-auto mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-text-primary">
            {t('laundry.title')}
          </h1>
          <p className="text-text-primary opacity-80 text-center max-w-2xl mx-auto">
            {t('laundry.description')}
          </p>
        </div>

        <div className="flex justify-between items-center mb-2 px-2">
          {lastUpdated && (
            <p className="text-sm opacity-70">
              {t('laundry.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={fetchLaundryData}
            className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors"
            disabled={loading}
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
          className="card bg-red-900 bg-opacity-20 text-red-300 mb-8"
        >
          <p>{error}</p>
          <button 
            onClick={fetchLaundryData}
            className="mt-4 text-accent hover:underline"
          >
            {t('laundry.tryAgain')}
          </button>
        </motion.div>
      )}

      {loading && !localData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="skeleton-loader h-8 w-48 mb-6"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-loader h-16 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="card">
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
            className="card"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex items-center mb-6">
              <GiWashingMachine className="text-accent text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-text-primary">{t('laundry.washingMachines')}</h2>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {localData?.washing_machine.map((machine) => {
                  const isInUse = !machine.available && machine.time_left > 0;
                  const progressPercent = calculateProgress(machine);
                  
                  return (
                    <motion.div 
                      key={machine.number}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden"
                    >
                      {/* Background progress bar */}
                      <div className={`absolute inset-0 ${
                        isInUse ? 'bg-red-800' : 'bg-green-800'
                      } bg-opacity-10 rounded-lg`}></div>
                      
                      {/* Animated progress indicator */}
                      {isInUse && (
                        <motion.div 
                          className="absolute top-0 bottom-0 left-0 bg-red-500 bg-opacity-20 rounded-l-lg"
                          initial={{ width: '0%' }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ ease: "linear" }}
                        />
                      )}
                      
                      {/* Content */}
                      <div className={`relative z-10 flex items-center justify-between p-4 rounded-lg border ${
                        machine.available 
                          ? 'border-green-500' 
                          : 'border-red-500'
                      }`}>
                        <div className="flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            machine.available ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'
                          }`}>
                            <span className="font-bold">{machine.number}</span>
                          </div>
                          <div className="ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              machine.available ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'
                            }`}>
                              {machine.available ? t('laundry.available') : t('laundry.inUse')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {isInUse ? (
                            <motion.div 
                              animate={pulseAnimation}
                              className="flex items-center text-red-300"
                            >
                              <FiClock className="mr-2" />
                              <span className="font-mono text-lg">
                                {formatTimeLeft(machine.time_left)}
                              </span>
                            </motion.div>
                          ) : (
                            <span className="font-mono text-lg text-green-300">
                              {machine.available ? "Ready" : "Finished"}
                            </span>
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
            className="card"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex items-center mb-6">
              <GiClothes className="text-accent text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-text-primary">{t('laundry.dryers')}</h2>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {localData?.dryer.map((machine) => {
                  const isInUse = !machine.available && machine.time_left > 0;
                  const progressPercent = calculateProgress(machine);
                  
                  return (
                    <motion.div 
                      key={machine.number}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden"
                    >
                      {/* Background progress bar */}
                      <div className={`absolute inset-0 ${
                        isInUse ? 'bg-red-800' : 'bg-green-800'
                      } bg-opacity-10 rounded-lg`}></div>
                      
                      {/* Animated progress indicator */}
                      {isInUse && (
                        <motion.div 
                          className="absolute top-0 bottom-0 left-0 bg-red-500 bg-opacity-20 rounded-l-lg"
                          initial={{ width: '0%' }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ ease: "linear" }}
                        />
                      )}
                      
                      {/* Content */}
                      <div className={`relative z-10 flex items-center justify-between p-4 rounded-lg border ${
                        machine.available 
                          ? 'border-green-500' 
                          : 'border-red-500'
                      }`}>
                        <div className="flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            machine.available ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'
                          }`}>
                            <span className="font-bold">{machine.number}</span>
                          </div>
                          <div className="ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              machine.available ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'
                            }`}>
                              {machine.available ? t('laundry.available') : t('laundry.inUse')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {isInUse ? (
                            <motion.div 
                              animate={pulseAnimation}
                              className="flex items-center text-red-300"
                            >
                              <FiClock className="mr-2" />
                              <span className="font-mono text-lg">
                                {formatTimeLeft(machine.time_left)}
                              </span>
                            </motion.div>
                          ) : (
                            <span className="font-mono text-lg text-green-300">
                              {machine.available ? "Ready" : "Finished"}
                            </span>
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