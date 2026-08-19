import type { VisionRoadmapDocument } from "@/lib/vision-roadmap";

const PHASE_LABELS = {
  foundation: "Foundation",
  "30": "Days 1-30",
  "60": "Days 31-60",
  "90": "Days 61-90",
} as const;

function FlowArrow() {
  return (
    <div className="vision-roadmap-flow-arrow" aria-hidden>
      <div className="vision-roadmap-flow-arrow__line" />
      <div className="vision-roadmap-flow-arrow__head" />
    </div>
  );
}

export function VisionRoadmapDocumentView({
  doc,
}: {
  doc: VisionRoadmapDocument;
}) {
  return (
    <article className="vision-roadmap">
      <header className="vision-roadmap-hero">
        <p className="vision-roadmap-eyebrow">WeLaunch - Vision Roadmap</p>
        <h1 className="vision-roadmap-title">{doc.title}</h1>
        <p className="vision-roadmap-company">{doc.companyName}</p>
        {doc.domain ? (
          <p className="vision-roadmap-domain">{doc.domain}</p>
        ) : null}
        <p className="vision-roadmap-subtitle">{doc.subtitle}</p>
        <p className="vision-roadmap-narrative">{doc.narrative}</p>
      </header>

      <div className="vision-roadmap-journey">
        <section className="vision-roadmap-stage">
          <div className="vision-roadmap-stage__badge">1x Today</div>
          <h2 className="vision-roadmap-stage__title">{doc.baseline.headline}</h2>
          <p className="vision-roadmap-stage__summary">{doc.baseline.summary}</p>
          <div className="vision-roadmap-pain-grid">
            {doc.baseline.painPoints.map((point) => (
              <div key={point.title} className="vision-roadmap-pain-card">
                <h3>{point.title}</h3>
                <p>{point.description}</p>
                {point.impact ? (
                  <p className="vision-roadmap-pain-card__impact">{point.impact}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <FlowArrow />

        <section className="vision-roadmap-stage vision-roadmap-stage--north-star">
          <div className="vision-roadmap-stage__badge vision-roadmap-stage__badge--goal">
            60-Day North Star
          </div>
          <h2 className="vision-roadmap-stage__title">Your goal</h2>
          <blockquote className="vision-roadmap-goal-quote">
            {doc.northStar.goal}
          </blockquote>
          <p className="vision-roadmap-stage__summary">{doc.northStar.summary}</p>
          {doc.northStar.aims.length ? (
            <ul className="vision-roadmap-aims">
              {doc.northStar.aims.map((aim) => (
                <li key={aim}>{aim}</li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

      <section className="vision-roadmap-section">
        <div className="vision-roadmap-section__header">
          <p className="vision-roadmap-eyebrow">Strategic priorities</p>
          <h2 className="vision-roadmap-section__title">What leadership should prioritize</h2>
          <p className="vision-roadmap-section__lead">
            These priorities translate the roadmap into focused workstreams instead of
            a high-level vision alone.
          </p>
        </div>
        <div className="vision-roadmap-priority-grid">
          {doc.strategicPriorities.map((priority) => (
            <div key={priority.title} className="vision-roadmap-priority-card">
              <h3>{priority.title}</h3>
              <p>{priority.rationale}</p>
              {priority.initiatives.length ? (
                <ul>
                  {priority.initiatives.map((initiative) => (
                    <li key={initiative}>{initiative}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {doc.agents.length ? (
        <section className="vision-roadmap-section">
          <div className="vision-roadmap-section__header">
            <p className="vision-roadmap-eyebrow">Agent package</p>
            <h2 className="vision-roadmap-section__title">How we get there</h2>
            <p className="vision-roadmap-section__lead">
              Each agent maps to a specific operational pain point and rolls out in
              phased deployment.
            </p>
          </div>
          <div className="vision-roadmap-agent-grid">
            {doc.agents.map((agent, index) => (
              <div key={agent.id} className="vision-roadmap-agent-card">
                <div className="vision-roadmap-agent-card__meta">
                  <span className="vision-roadmap-agent-card__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="vision-roadmap-agent-card__phase">
                    {PHASE_LABELS[agent.deployPhase]}
                  </span>
                </div>
                <h3 className="vision-roadmap-agent-card__name">{agent.name}</h3>
                <p className="vision-roadmap-agent-card__role">{agent.role}</p>
                <dl className="vision-roadmap-agent-card__details">
                  <div>
                    <dt>Pain</dt>
                    <dd>{agent.painPoint}</dd>
                  </div>
                  <div>
                    <dt>Solution</dt>
                    <dd>{agent.solution}</dd>
                  </div>
                  <div>
                    <dt>Outcome</dt>
                    <dd>{agent.outcome}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="vision-roadmap-section">
        <div className="vision-roadmap-section__header">
          <p className="vision-roadmap-eyebrow">Phased timeline</p>
          <h2 className="vision-roadmap-section__title">30 / 60 / 90 day roadmap</h2>
        </div>
        <div className="vision-roadmap-timeline">
          {doc.phases.map((phase, index) => (
            <div key={phase.day} className="vision-roadmap-timeline__phase">
              <div className="vision-roadmap-timeline__marker">
                <span>{phase.day}</span>
                {index < doc.phases.length - 1 ? (
                  <div className="vision-roadmap-timeline__connector" />
                ) : null}
              </div>
              <div className="vision-roadmap-timeline__body">
                <h3>{phase.title}</h3>
                <p>{phase.focus}</p>
                {phase.milestones.length ? (
                  <ul>
                    {phase.milestones.map((milestone) => (
                      <li key={milestone}>{milestone}</li>
                    ))}
                  </ul>
                ) : null}
                {phase.successCriteria.length ? (
                  <div className="vision-roadmap-timeline__success">
                    <p>Success criteria</p>
                    <ul>
                      {phase.successCriteria.map((criterion) => (
                        <li key={criterion}>{criterion}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {phase.agentNames.length ? (
                  <p className="vision-roadmap-timeline__agents">
                    <span>Agents active:</span> {phase.agentNames.join(", ")}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vision-roadmap-section">
        <div className="vision-roadmap-section__header">
          <p className="vision-roadmap-eyebrow">Execution readiness</p>
          <h2 className="vision-roadmap-section__title">{doc.executionReadiness.headline}</h2>
          <p className="vision-roadmap-section__lead">
            {doc.executionReadiness.summary}
          </p>
        </div>
        <div className="vision-roadmap-readiness-grid">
          {doc.executionReadiness.items.map((item) => (
            <div key={`${item.category}-${item.title}`} className="vision-roadmap-readiness-card">
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="vision-roadmap-outcomes">
        <p className="vision-roadmap-eyebrow">Measurable outcomes</p>
        <h2 className="vision-roadmap-outcomes__headline">
          {doc.outcomes.headlineMetric}
        </h2>
        <p className="vision-roadmap-outcomes__summary">{doc.outcomes.summary}</p>
        {doc.outcomes.metrics.length ? (
          <div className="vision-roadmap-metrics">
            {doc.outcomes.metrics.map((metric) => (
              <div key={metric.label} className="vision-roadmap-metric">
                <p className="vision-roadmap-metric__label">{metric.label}</p>
                <p className="vision-roadmap-metric__target">{metric.target}</p>
                <p className="vision-roadmap-metric__desc">{metric.description}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </article>
  );
}
