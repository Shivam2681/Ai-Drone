"use client"
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, AlertTriangle, Battery, Wifi, Compass } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const DroneSwarmDashboard = () => {
  const [drones, setDrones] = useState([
    { id: 'Drone_0', position: [0, 0, 0], battery: 100, status: 'initializing', history: [] },
    { id: 'Drone_1', position: [10, 10, 5], battery: 95, status: 'active', history: [] },
    { id: 'Drone_2', position: [-5, 8, 10], battery: 87, status: 'active', history: [] }
  ]);
  
  const [missionStatus, setMissionStatus] = useState('active');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setDrones(prevDrones => 
        prevDrones.map(drone => {
          const newPosition = [
            drone.position[0] + (Math.random() - 0.5) * 2,
            drone.position[1] + (Math.random() - 0.5) * 2,
            drone.position[2] + (Math.random() - 0.5)
          ];
          const newBattery = Math.max(drone.battery - 0.1, 0);
          
          if (newBattery < 20) {
            addAlert(`Low battery warning for ${drone.id}: ${newBattery.toFixed(1)}%`);
          }
          
          return {
            ...drone,
            position: newPosition,
            battery: newBattery,
            history: [...drone.history.slice(-20), { time: elapsedTime, altitude: newPosition[2] }]
          };
        })
      );
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPaused, elapsedTime]);
  
  const addAlert = (message) => {
    setAlerts(prev => [...prev.slice(-4), { id: Date.now(), message }]);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };
  
  const formatPosition = (pos) => pos.map(p => p.toFixed(2)).join(', ');
  
  const Visualization3D = () => {
    return (
      <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-lg p-4 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {drones.map(drone => (
            <div
              key={drone.id}
              className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"
              style={{
                left: `${(drone.position[0] + 50) * 0.8}%`,
                top: `${(drone.position[1] + 50) * 0.8}%`,
                transform: `scale(${1 + drone.position[2] / 20})`
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full font-mono min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Mission Control */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">AI-Powered Drone Swarm Control System</h2>
            <div className="flex space-x-2">
              <button 
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button 
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setMissionStatus('complete');
                  setIsPaused(true);
                }}
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-base sm:text-lg">
              Mission Time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
            </div>
            <span className={`text-sm ${getStatusColor(missionStatus)}`}>
              Status: {missionStatus.toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* 3D Visualization */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Live Swarm Visualization</h2>
          <Visualization3D />
        </div>
        
        {/* Alert System */}
        <div className="space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Alert</h3>
                  <p className="text-sm text-yellow-700 break-words">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Drone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drones.map(drone => (
            <div key={drone.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold">{drone.id}</h3>
                <span className={`text-sm ${getStatusColor(drone.status)}`}>
                  {drone.status}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm sm:text-base">
                  <Compass className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">Position: ({formatPosition(drone.position)})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 flex-shrink-0" />
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        drone.battery > 50 ? 'bg-blue-600' :
                        drone.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${drone.battery}%` }}
                    ></div>
                  </div>
                  <span className="text-sm sm:text-base whitespace-nowrap">{drone.battery.toFixed(1)}%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm sm:text-base">
                  <Wifi className="w-4 h-4 flex-shrink-0" />
                  <span>Signal Strength: Excellent</span>
                </div>
                
                <div className="mt-4 w-full h-24 sm:h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={drone.history}>
                      <Line 
                        type="monotone" 
                        dataKey="altitude" 
                        stroke="#3b82f6" 
                        dot={false}
                      />
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* System Metrics */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">System Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="font-semibold text-sm sm:text-base">Average Altitude</div>
              <div className="text-xl sm:text-2xl">
                {(drones.reduce((acc, d) => acc + d.position[2], 0) / drones.length).toFixed(2)}m
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="font-semibold text-sm sm:text-base">Swarm Spread</div>
              <div className="text-xl sm:text-2xl">
                {(Math.max(...drones.map(d => Math.hypot(...d.position))) - 
                  Math.min(...drones.map(d => Math.hypot(...d.position)))).toFixed(2)}m
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="font-semibold text-sm sm:text-base">Average Battery</div>
              <div className="text-xl sm:text-2xl">
                {(drones.reduce((acc, d) => acc + d.battery, 0) / drones.length).toFixed(1)}%
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="font-semibold text-sm sm:text-base">Mission Progress</div>
              <div className="text-xl sm:text-2xl">
                {Math.min(100, (elapsedTime / 300 * 100)).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneSwarmDashboard;