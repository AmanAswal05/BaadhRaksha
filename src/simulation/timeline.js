/**
 * BaadhRaksha — Simulation Playback Controller for Kharghar
 */

import { state } from '../state.js';

class SimulationController {
  constructor() {
    this.timer = null;
  }

  start() {
    state.simulation.active = true;
    this.scheduleNextTick();
    state.notify();
  }

  pause() {
    state.simulation.active = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    state.notify();
  }

  setSpeed(speed) {
    state.simulation.speed = speed;
    if (state.simulation.active) {
      this.pause();
      this.start();
    } else {
      state.notify();
    }
  }

  nextStage() {
    if (state.simulation.stageIndex < state.simulation.totalStages - 1) {
      this.goToStage(state.simulation.stageIndex + 1);
    } else {
      this.pause();
    }
  }

  prevStage() {
    if (state.simulation.stageIndex > 0) {
      this.goToStage(state.simulation.stageIndex - 1);
    }
  }

  goToStage(index) {
    state.simulation.stageIndex = index;
    state.recalculateAllRisks();
    state.notify();
  }

  reset() {
    this.pause();
    state.simulation.stageIndex = 0;
    state.setSelectedDistrict('sector-20');
    state.recalculateAllRisks();
    state.notify();
  }

  scheduleNextTick() {
    if (!state.simulation.active) return;
    const interval = 4500 / (state.simulation.speed || 1);

    this.timer = setTimeout(() => {
      if (!state.simulation.active) return;
      if (state.simulation.stageIndex < state.simulation.totalStages - 1) {
        this.nextStage();
        this.scheduleNextTick();
      } else {
        this.pause();
      }
    }, interval);
  }
}

export const simulationController = new SimulationController();
