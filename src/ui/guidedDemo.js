/**
 * BaadhRaksha - Guided Demo Floating Controller Component
 * Shows interactive overlay steps, navigation (Next, Prev, Exit), and progress bar.
 */

import { state } from '../state.js';
import { guidedDemoController, GUIDED_STEPS } from '../simulation/demo.js';

export function renderGuidedDemoOverlay() {
  if (!state.guidedDemo.active) return '';

  const isHi = state.lang === 'hi';
  const stepIndex = state.guidedDemo.step - 1;
  const currentStep = GUIDED_STEPS[stepIndex] || GUIDED_STEPS[0];
  const progressPercent = Math.round(((stepIndex + 1) / GUIDED_STEPS.length) * 100);

  return `
    <div class="guided-demo-banner">
      <div class="guided-demo-card card">
        <div class="gd-top-bar">
          <div class="gd-step-indicator">
            <span class="gd-badge">HACKATHON GUIDED TOUR</span>
            <span class="gd-counter">Step ${state.guidedDemo.step} of ${state.guidedDemo.totalSteps}</span>
          </div>
          <button class="gd-close" id="btn-gd-exit" title="Exit Presentation">✕</button>
        </div>

        <div class="gd-progress-track">
          <div class="gd-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="gd-content">
          <h3 class="gd-title">${isHi ? currentStep.titleHi : currentStep.titleEn}</h3>
          <p class="gd-desc">${isHi ? currentStep.descHi : currentStep.descEn}</p>
        </div>

        <div class="gd-actions">
          <button class="btn btn-outline btn-sm" id="btn-gd-prev" ${stepIndex === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          <div class="gd-actions-right">
            <button class="btn btn-outline btn-sm" id="btn-gd-stop">
              Exit Tour
            </button>
            <button class="btn btn-primary btn-sm" id="btn-gd-next">
              ${stepIndex === GUIDED_STEPS.length - 1 ? 'Finish Tour ✓' : 'Next Step →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindGuidedDemoEvents(container) {
  const nextBtn = container.querySelector('#btn-gd-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      guidedDemoController.next();
    });
  }

  const prevBtn = container.querySelector('#btn-gd-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      guidedDemoController.prev();
    });
  }

  const exitBtn = container.querySelector('#btn-gd-exit');
  const stopBtn = container.querySelector('#btn-gd-stop');
  if (exitBtn) exitBtn.addEventListener('click', () => guidedDemoController.exit());
  if (stopBtn) stopBtn.addEventListener('click', () => guidedDemoController.exit());
}
