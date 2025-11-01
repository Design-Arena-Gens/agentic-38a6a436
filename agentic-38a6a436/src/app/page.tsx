"use client";

import { ChangeEvent, useMemo, useState } from "react";
import styles from "./page.module.css";
import type {
  GoalFocus,
  InvestorProfile,
  RiskLevel,
} from "@/lib/recommendation";
import { generatePlan } from "@/lib/recommendation";
import { curatedFunds } from "@/data/funds";

const riskLevels: RiskLevel[] = [
  "Capital Preservation",
  "Balanced",
  "Growth",
  "Aggressive Growth",
];

const goalOptions: GoalFocus[] = [
  "Retirement income",
  "Wealth accumulation",
  "Down payment",
  "Education",
  "Financial independence",
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentage = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const defaultProfile: InvestorProfile = {
  riskLevel: "Balanced",
  timeHorizon: 12,
  initialInvestment: 65000,
  monthlyContribution: 1500,
  targetAmount: 400000,
  goalFocus: "Financial independence",
  sustainabilityBias: true,
  incomePriority: false,
};

export default function Home() {
  const [profile, setProfile] = useState<InvestorProfile>(defaultProfile);
  const plan = useMemo(() => generatePlan(profile), [profile]);
  const finalYear = plan.projection.at(-1);
  const annualContribution = profile.monthlyContribution * 12;
  const projectedFundingRatio =
    finalYear && profile.targetAmount > 0
      ? finalYear.expectedValue / profile.targetAmount
      : 0;

  const handleNumberChange =
    (field: keyof InvestorProfile) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setProfile((prev) => ({
        ...prev,
        [field]: Number.isNaN(value) ? 0 : value,
      }));
    };

  const handleSelectChange =
    (field: keyof InvestorProfile) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      setProfile((prev) => ({
        ...prev,
        [field]: event.target.value as InvestorProfile[typeof field],
      }));
    };

  const handleToggle =
    (field: keyof InvestorProfile) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setProfile((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Agentic Wealth</p>
          <h1>Investment Copilot</h1>
          <p className={styles.heroLead}>
            Encode your goals, risk limits, and cash flow; we spin up an
            institutional-grade plan that adapts in real time.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div>
            <span>Projected CAGR</span>
            <strong>{plan.expectedCagr}%</strong>
          </div>
          <div>
            <span>Funding Ratio</span>
            <strong>
              {percentage.format(projectedFundingRatio)} target
            </strong>
          </div>
          <div>
            <span>Annual Inputs</span>
            <strong>{currency.format(annualContribution)}</strong>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.panel}>
          <header>
            <h2>Set Your Mandate</h2>
            <p>
              Adjust assumptions and watch the allocation, cash flow plan, and
              agent narrative respond instantly.
            </p>
          </header>
          <div className={styles.formGrid}>
            <label>
              <span>Risk Posture</span>
              <select
                value={profile.riskLevel}
                onChange={handleSelectChange("riskLevel")}
              >
                {riskLevels.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Primary Goal</span>
              <select
                value={profile.goalFocus}
                onChange={handleSelectChange("goalFocus")}
              >
                {goalOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Time Horizon (years)</span>
              <input
                type="number"
                min={1}
                max={40}
                value={profile.timeHorizon}
                onChange={handleNumberChange("timeHorizon")}
              />
            </label>
            <label>
              <span>Starting Capital ($)</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={profile.initialInvestment}
                onChange={handleNumberChange("initialInvestment")}
              />
            </label>
            <label>
              <span>Monthly Contribution ($)</span>
              <input
                type="number"
                min={0}
                step={100}
                value={profile.monthlyContribution}
                onChange={handleNumberChange("monthlyContribution")}
              />
            </label>
            <label>
              <span>Target Amount ($)</span>
              <input
                type="number"
                min={0}
                step={5000}
                value={profile.targetAmount}
                onChange={handleNumberChange("targetAmount")}
              />
            </label>
            <label className={styles.switchField}>
              <input
                type="checkbox"
                checked={profile.sustainabilityBias}
                onChange={handleToggle("sustainabilityBias")}
              />
              <span>Prioritize sustainability screens</span>
            </label>
            <label className={styles.switchField}>
              <input
                type="checkbox"
                checked={profile.incomePriority}
                onChange={handleToggle("incomePriority")}
              />
              <span>Need supplemental income</span>
            </label>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.agentCard}>
            <header>
              <h3>Agent Verdict</h3>
              <span>{plan.name}</span>
            </header>
            <p className={styles.agentNarrative}>{plan.agentMessage}</p>
            <div className={styles.agentMeta}>
              <div>
                <strong>{plan.expectedCagr}%</strong>
                <span>Expected CAGR</span>
              </div>
              <div>
                <strong>{plan.downsideCagr}%</strong>
                <span>Stress Scenario</span>
              </div>
              <div>
                <strong>{currency.format(finalYear?.expectedValue ?? 0)}</strong>
                <span>Year {profile.timeHorizon} Balance</span>
              </div>
            </div>
          </article>

          <article className={styles.allocationCard}>
            <header>
              <h3>Strategic Allocation</h3>
              <span>{plan.rebalancingNote}</span>
            </header>
            <div className={styles.allocationList}>
              {plan.allocation.map((slice) => (
                <div key={slice.assetClass} className={styles.allocationRow}>
                  <div className={styles.allocationLabel}>
                    <strong>{slice.assetClass}</strong>
                    <span>{slice.description}</span>
                  </div>
                  <div className={styles.allocationBar}>
                    <div
                      style={{ width: `${slice.percentage}%` }}
                      aria-hidden
                    />
                    <span>{slice.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.projectionCard}>
            <header>
              <h3>Capital Trajectory</h3>
              <span>
                Includes monthly contributions of {currency.format(profile.monthlyContribution)}.
              </span>
            </header>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Expected</th>
                  <th>Optimistic</th>
                  <th>Stress Test</th>
                  <th>Paid In</th>
                </tr>
              </thead>
              <tbody>
                {plan.projection.map((item) => (
                  <tr key={item.year}>
                    <td>{item.year}</td>
                    <td>{currency.format(item.expectedValue)}</td>
                    <td>{currency.format(item.optimisticValue)}</td>
                    <td>{currency.format(item.stressedValue)}</td>
                    <td>{currency.format(item.cumulativeContributions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className={styles.insightsCard}>
            <header>
              <h3>Tactical Moves</h3>
              <span>Keep the agent in sync with your advisor cadence.</span>
            </header>
            <ul>
              {plan.insights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </article>

          <article className={styles.fundCard}>
            <header>
              <h3>Implementation Menu</h3>
              <span>Low-cost ETFs curated for this mandate.</span>
            </header>
            <div className={styles.fundList}>
              {curatedFunds.map((fund) => (
                <div key={fund.symbol} className={styles.fundRow}>
                  <div>
                    <strong>
                      {fund.symbol} · {fund.name}
                    </strong>
                    <span>{fund.description}</span>
                    <span className={styles.fundCategory}>{fund.category}</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Expense</dt>
                      <dd>{fund.expenseRatio.toFixed(2)}%</dd>
                    </div>
                    <div>
                      <dt>Yield</dt>
                      <dd>{fund.yield.toFixed(1)}%</dd>
                    </div>
                    <div>
                      <dt>YTD</dt>
                      <dd>{fund.ytdReturn.toFixed(1)}%</dd>
                    </div>
                    <div>
                      <dt>3Y</dt>
                      <dd>{fund.threeYearReturn.toFixed(1)}%</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
