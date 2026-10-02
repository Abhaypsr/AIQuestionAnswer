import { useEffect, useMemo, useState } from 'react';
import { questions } from '../data/questions';
import questionBatch from '../data/questions/q6-q20.json';
import question21 from '../data/questions/q21.json';
import questionBatch22 from '../data/questions/q22-q25.json';
import questionBatch26 from '../data/questions/q26-q29.json';
import question30 from '../data/questions/q30.json';
import questionBatch31 from '../data/questions/q31-q35.json';
import questionBatch36 from '../data/questions/q36-q70.json';
import extractedQuestions from '../PDF/Q69_Q117_extracted.json';
import caseStudy from '../data/caseStudies/ai103-case-study.json';
import { adaptExtractedQuestions } from '../data/questions/adaptExtractedQuestions';
import { notes } from './notes';

const PAGE_SIZE = 10;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function readRoute() {
  if (/\/AI103\/notes\/?$/i.test(window.location.pathname)) {
    return { screen: 'notes', page: 0 };
  }

  const pageMatch = window.location.pathname.match(/\/AI103\/(\d+)\/?$/i);
  if (pageMatch) {
    return { screen: 'course', page: Math.max(0, Number(pageMatch[1]) - 1) };
  }

  if (/\/AI901\/?$/i.test(window.location.pathname)) {
    return { screen: 'upcoming', page: 0 };
  }

  return { screen: 'home', page: 0 };
}

const ai103Path = (pageNumber) => `${basePath}/AI103/${pageNumber}`;
const ai103NotesPath = `${basePath}/AI103/notes`;
const homePath = import.meta.env.BASE_URL || '/';

function App() {
  const [view, setView] = useState('questions');
  const [route, setRoute] = useState(readRoute);
  const { page, screen } = route;
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [pendingConfiguration, setPendingConfiguration] = useState('');

  const regularQuestions = useMemo(
    () => [
      ...questions,
      ...questionBatch,
      ...question21,
      ...questionBatch22,
      ...questionBatch26,
      ...question30,
      ...questionBatch31,
      ...questionBatch36.filter((question) => question.number < 69),
      ...adaptExtractedQuestions(extractedQuestions)
    ].filter((question) => question.number > 2),
    []
  );
  const totalPages = Math.ceil(regularQuestions.length / PAGE_SIZE);
  const pageQuestions = useMemo(
    () => regularQuestions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [page, regularQuestions]
  );

  useEffect(() => {
    const syncRoute = () => {
      const nextRoute = readRoute();
      if (nextRoute.screen === 'course' && nextRoute.page >= totalPages) {
        nextRoute.page = Math.max(0, totalPages - 1);
        window.history.replaceState({}, '', ai103Path(nextRoute.page + 1));
      }
      setRoute(nextRoute);
      setView('questions');
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [totalPages]);

  const openAI103 = () => {
    setRoute({ screen: 'course', page: 0 });
    setView('questions');
    window.history.pushState({}, '', ai103Path(1));
  };

  const openAI901 = () => {
    setRoute({ screen: 'upcoming', page: 0 });
    window.history.pushState({}, '', `${basePath}/AI901` || '/AI901');
  };

  const openNotes = () => {
    setRoute({ screen: 'notes', page: 0 });
    window.history.pushState({}, '', ai103NotesPath);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setRoute({ screen: 'home', page: 0 });
    setView('questions');
    window.history.pushState({}, '', homePath);
  };

  const changePage = (nextPage) => {
    const boundedPage = Math.max(0, Math.min(totalPages - 1, nextPage));
    setRoute({ screen: 'course', page: boundedPage });
    window.history.pushState({}, '', ai103Path(boundedPage + 1));
    window.scrollTo(0, 0);
  };

  const updateSelection = (questionId, choiceId, multiSelect = false) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (multiSelect) {
        return {
          ...prev,
          [questionId]: current.includes(choiceId)
            ? current.filter((id) => id !== choiceId)
            : [...current, choiceId]
        };
      }

      return {
        ...prev,
        [questionId]: [choiceId]
      };
    });
  };

  const updateFieldSelection = (questionId, fieldId, choiceId) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] ?? [];
      const fieldPrefix = `${fieldId}:`;
      const otherSelections = current.filter((value) => !value.startsWith(fieldPrefix));

      return {
        ...prev,
        [questionId]: choiceId ? [...otherSelections, `${fieldId}:${choiceId}`] : otherSelections
      };
    });
  };

  const assignConfiguration = (questionId, pipelineId, configurationId) => {
    updateFieldSelection(questionId, pipelineId, configurationId);
    setPendingConfiguration('');
  };

  const handleCheckAnswer = (questionId) => {
    setSubmitted((prev) => ({ ...prev, [questionId]: true }));
  };

  const renderQuestion = (question) => {
    const selected = selectedAnswers[question.id] ?? [];
    const isSubmitted = submitted[question.id];
    const correctChoices = new Set(
      question.gradingAvailable === false ? [] : question.correctAnswers || []
    );
    const renderCodeDropField = (field) => {
      const fieldPrefix = `${field.id}:`;
      const selectedField = selected.find((value) => value.startsWith(fieldPrefix));
      const selectedConfigurationId = selectedField?.slice(fieldPrefix.length);
      const selectedConfiguration = question.configurations.find(
        (configuration) => configuration.id === selectedConfigurationId
      );
      const isCorrect = selectedConfigurationId
        && correctChoices.has(`${field.id}:${selectedConfigurationId}`);
      const isWrong = isSubmitted && selectedConfigurationId && !isCorrect;

      return (
        <button
          key={field.id}
          type="button"
          className={[
            'drop-target',
            'code-drop-target',
            isSubmitted && isCorrect ? 'correct' : '',
            isWrong ? 'wrong' : ''
          ].join(' ')}
          aria-label={`${field.label} drop target`}
          onClick={() => {
            if (pendingConfiguration) {
              assignConfiguration(question.id, field.id, pendingConfiguration);
            }
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const configurationId = event.dataTransfer.getData('text/plain');
            if (configurationId) {
              assignConfiguration(question.id, field.id, configurationId);
            }
          }}
        >
          {selectedConfiguration?.label || field.placeholder}
        </button>
      );
    };

    return (
      <div key={question.id} className="question-card">
        <div className="question-header">
          <span className="question-number">Question {question.number}</span>
          <span className="question-type">{question.type}</span>
        </div>

        {question.questionType === 'yes-no-matrix'
          || question.questionType === 'drag-drop'
          || question.questionType === 'multi-dropdown'
          || (question.question || '').includes('\n') ? (
          <div className="question-prompt">
            {question.question || 'Question text is missing from the source JSON.'}
          </div>
        ) : (
          <h3>{question.question || 'Question text is missing from the source JSON.'}</h3>
        )}

        {question.code && <pre className="question-code">{question.code}</pre>}

        {question.image && (
          <img
            className="question-exhibit"
            src={question.image}
            alt={question.imageAlt || `Exhibit for question ${question.number}`}
          />
        )}

        {question.caseStudy && (
          <div className="case-study-block">
            <strong>Case Study:</strong>
            <p>{question.caseStudy}</p>
          </div>
        )}

        {question.questionType === 'single-choice' && (
          <div className="options">
            {question.options.map((option) => {
              const isSelected = selected.includes(option.id);
              const isCorrect = correctChoices.has(option.id);
              const showCorrect = isSubmitted && isCorrect;
              const showWrong = isSubmitted && isSelected && !isCorrect;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={[
                    'option-btn',
                    isSelected ? 'selected' : '',
                    showCorrect ? 'correct' : '',
                    showWrong ? 'wrong' : ''
                  ].join(' ')}
                  onClick={() => updateSelection(question.id, option.id)}
                >
                  <span>{option.label}</span>
                  {isSubmitted && (isCorrect || isSelected) && (
                    <span className="mark">{isCorrect ? '✓' : '✕'}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {question.questionType === 'multi-select' && (
          <div className="options">
            {question.options.map((option) => {
              const isSelected = selected.includes(option.id);
              const isCorrect = correctChoices.has(option.id);
              const showCorrect = isSubmitted && isCorrect;
              const showWrong = isSubmitted && isSelected && !isCorrect;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={[
                    'option-btn',
                    isSelected ? 'selected' : '',
                    showCorrect ? 'correct' : '',
                    showWrong ? 'wrong' : ''
                  ].join(' ')}
                  onClick={() => updateSelection(question.id, option.id, true)}
                >
                  <span>{option.label}</span>
                  {isSubmitted && (isCorrect || isSelected) && (
                    <span className="mark">{isCorrect ? '✓' : '✕'}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {question.questionType === 'yes-no' && (
          <div className="options yes-no">
            {['Yes', 'No'].map((value) => {
              const optionId = value.toLowerCase();
              const isSelected = selected.includes(optionId);
              const isCorrect = correctChoices.has(optionId);
              const showCorrect = isSubmitted && isCorrect;
              const showWrong = isSubmitted && isSelected && !isCorrect;

              return (
                <button
                  key={value}
                  type="button"
                  className={[
                    'option-btn',
                    isSelected ? 'selected' : '',
                    showCorrect ? 'correct' : '',
                    showWrong ? 'wrong' : ''
                  ].join(' ')}
                  onClick={() => updateSelection(question.id, optionId)}
                >
                  {value}
                </button>
              );
            })}
          </div>
        )}

        {question.questionType === 'yes-no-matrix' && (
          <div className="yes-no-matrix">
            <div className="matrix-header" aria-hidden="true">
              <span>Statements</span>
              <span>Yes</span>
              <span>No</span>
            </div>
            {question.statements.map((statement) => {
              const fieldPrefix = `${statement.id}:`;
              const selectedField = selected.find((value) => value.startsWith(fieldPrefix));
              const selectedValue = selectedField ? selectedField.slice(fieldPrefix.length) : '';

              return (
                <div className="matrix-row" key={statement.id}>
                  <span className="matrix-statement">{statement.text}</span>
                  {['yes', 'no'].map((value) => {
                    const isCorrect = correctChoices.has(`${statement.id}:${value}`);
                    const isWrong = isSubmitted && selectedValue === value && !isCorrect;

                    return (
                    <label
                      className={[
                        'matrix-choice',
                        isSubmitted && isCorrect ? 'correct' : '',
                        isWrong ? 'wrong' : ''
                      ].join(' ')}
                      key={value}
                    >
                      <input
                        type="radio"
                        name={`q-${question.id}-${statement.id}`}
                        value={value}
                        checked={selectedValue === value}
                        onChange={() => updateFieldSelection(question.id, statement.id, value)}
                      />
                      <span className="visually-hidden">{value}</span>
                    </label>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {question.questionType === 'dropdown' && (
          <div className="dropdown-wrap">
            <label htmlFor={`q-${question.id}`}>Select answer</label>
            <select
              id={`q-${question.id}`}
              value={selected[0] || ''}
              onChange={(e) => updateSelection(question.id, e.target.value)}
            >
              <option value="">Choose an option</option>
              {question.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {question.questionType === 'multi-dropdown' && (
          <div className="answer-fields">
            {question.answerFields.map((field) => {
              const fieldPrefix = `${field.id}:`;
              const selectedField = selected.find((value) => value.startsWith(fieldPrefix));
              const selectedValue = selectedField ? selectedField.slice(fieldPrefix.length) : '';
              const correctField = question.gradingAvailable === false
                ? undefined
                : question.correctAnswers?.find((value) => value.startsWith(fieldPrefix));
              const correctValue = correctField ? correctField.slice(fieldPrefix.length) : '';
              const isCorrect = selectedValue && selectedValue === correctValue;
              const isWrong = question.gradingAvailable !== false
                && isSubmitted
                && selectedValue
                && selectedValue !== correctValue;

              return (
                <div key={field.id} className="dropdown-wrap">
                  <label htmlFor={`q-${question.id}-${field.id}`}>{field.label}</label>
                  <select
                    id={`q-${question.id}-${field.id}`}
                    className={[
                      isSubmitted && isCorrect ? 'correct' : '',
                      isWrong ? 'wrong' : ''
                    ].join(' ')}
                    value={selectedValue}
                    onChange={(e) => updateFieldSelection(question.id, field.id, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {field.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}

        {question.questionType === 'drag-drop' && (
          <div className="drag-drop-board">
            <section className="drag-drop-panel" aria-label="Configurations">
              <h4>{question.sourceLabel || 'Configurations'}</h4>
              <div className="drag-drop-list">
                {question.configurations.map((configuration) => (
                  <button
                    key={configuration.id}
                    type="button"
                    className={`drag-option ${pendingConfiguration === configuration.id ? 'selected' : ''}`}
                    draggable
                    aria-pressed={pendingConfiguration === configuration.id}
                    onClick={() => setPendingConfiguration(configuration.id)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', configuration.id);
                      event.dataTransfer.effectAllowed = 'copy';
                      setPendingConfiguration(configuration.id);
                    }}
                  >
                    {configuration.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="drag-drop-panel" aria-label="Answer Area">
              <h4>{question.targetLabel || 'Answer Area'}</h4>
              {question.dropFields ? (
                <div className="code-template">
                  <div>{question.codeLines[0]}</div>
                  <div className="code-indent">{question.codeLines[1]}</div>
                  <div className="code-indent code-assignment">
                    {renderCodeDropField(question.dropFields[0])}
                    <span>:</span>
                    {renderCodeDropField(question.dropFields[1])}
                    <span>,</span>
                  </div>
                  <div className="code-indent">{question.codeLines[2]}</div>
                  <div className="code-indent-2">{question.codeLines[3]}</div>
                  <div className="code-indent">{question.codeLines[4]}</div>
                  <div>{question.codeLines[5]}</div>
                </div>
              ) : (
              <div className="pipeline-targets">
                {question.pipelines.map((pipeline) => {
                  const fieldPrefix = `${pipeline.id}:`;
                  const selectedField = selected.find((value) => value.startsWith(fieldPrefix));
                  const selectedConfigurationId = selectedField?.slice(fieldPrefix.length);
                  const selectedConfiguration = question.configurations.find(
                    (configuration) => configuration.id === selectedConfigurationId
                  );
                  const isCorrect = selectedConfigurationId
                    && correctChoices.has(`${pipeline.id}:${selectedConfigurationId}`);
                  const isWrong = isSubmitted && selectedConfigurationId && !isCorrect;

                  return (
                    <div className="pipeline-target-row" key={pipeline.id}>
                      <span>{pipeline.label}:</span>
                      <button
                        type="button"
                        className={[
                          'drop-target',
                          isSubmitted && isCorrect ? 'correct' : '',
                          isWrong ? 'wrong' : ''
                        ].join(' ')}
                        aria-label={`${pipeline.label} configuration`}
                        onClick={() => {
                          if (pendingConfiguration) {
                            assignConfiguration(question.id, pipeline.id, pendingConfiguration);
                          }
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          const configurationId = event.dataTransfer.getData('text/plain');
                          if (configurationId) {
                            assignConfiguration(question.id, pipeline.id, configurationId);
                          }
                        }}
                      >
                        {selectedConfiguration?.label || 'Configuration'}
                      </button>
                      {selectedConfiguration && (
                        <button
                          type="button"
                          className="clear-target"
                          aria-label={`Clear ${pipeline.label} configuration`}
                          onClick={() => updateFieldSelection(question.id, pipeline.id, '')}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              )}
            </section>
          </div>
        )}

        {isSubmitted && Array.isArray(question.correctAnswers) && (
          <div className="answer-reveal">
            {question.gradingAvailable === false ? (
              <>
                <strong>Answer from source:</strong>{' '}
                {question.sourceCorrectAnswer ?? 'No answer is present in the source JSON.'}
              </>
            ) : question.questionType === 'drag-drop' ? (
              <>
                <strong>Correct assignments:</strong>
                <ul>
                  {(question.dropFields || question.pipelines).map((field) => {
                    const answer = question.correctAnswers.find((value) => value.startsWith(`${field.id}:`));
                    const configurationId = answer?.slice(field.id.length + 1);
                    const configuration = question.configurations.find((item) => item.id === configurationId);

                    return <li key={field.id}>{field.label}: {configuration?.label}</li>;
                  })}
                </ul>
              </>
            ) : question.questionType === 'multi-dropdown' ? (
              <>
                <strong>Correct selections:</strong>
                <ul>
                  {question.answerFields.map((field) => {
                    const answer = question.correctAnswers.find((value) => value.startsWith(`${field.id}:`));
                    const optionId = answer?.slice(field.id.length + 1);
                    const option = field.options.find((item) => item.id === optionId);

                    return <li key={field.id}>{field.label}: {option?.label}</li>;
                  })}
                </ul>
              </>
            ) : question.questionType === 'yes-no-matrix' ? (
              <>
                <strong>Correct answers:</strong>
                <ul>
                  {question.statements.map((statement) => {
                    const answer = question.correctAnswers.find((value) => value.startsWith(`${statement.id}:`));
                    const answerValue = answer?.slice(statement.id.length + 1);

                    return (
                      <li key={statement.id}>
                        {statement.text} {answerValue ? `Answer: ${answerValue.toUpperCase()}` : ''}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <>
                <strong>Correct answer:</strong>{' '}
                {question.options
                  .filter((option) => correctChoices.has(option.id))
                  .map((option) => option.label)
                  .join(', ')}
              </>
            )}
          </div>
        )}

        {Array.isArray(question.correctAnswers) && (
          <button className="check-btn" type="button" onClick={() => handleCheckAnswer(question.id)}>
            Check Answer
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={goHome}>Exam Questions</button>
        {(screen === 'course' || screen === 'notes') && <div className="course-badge">AI-103</div>}
      </header>

      <main className="content">
        {screen === 'home' && (
          <section className="course-home">
            <div className="page-header">
              <h1>Choose an exam</h1>
            </div>
            <div className="course-cards">
              <button className="course-card" type="button" onClick={openAI103}>
                <span className="course-card-code">AI-103</span>
                <span className="course-card-mark" aria-hidden="true">103</span>
                <span className="course-card-copy">
                  <span className="course-card-title">AI-103 Questions</span>
                  <span className="course-card-description">Practice the full question bank with answer feedback.</span>
                </span>
              </button>
              <button className="course-card" type="button" onClick={openAI901}>
                <span className="course-card-code">AI-901</span>
                <span className="course-card-mark" aria-hidden="true">901</span>
                <span className="course-card-copy">
                  <span className="course-card-title">AI-901 Questions</span>
                  <span className="course-card-description">Question set in preparation. Upcoming.</span>
                </span>
              </button>
            </div>
          </section>
        )}

        {screen === 'upcoming' && (
          <section className="upcoming-page">
            <button className="back-link" type="button" onClick={goHome}>All exams</button>
            <div className="page-header">
              <h1>AI-901 Questions</h1>
              <p>Upcoming</p>
            </div>
          </section>
        )}

        {screen === 'notes' && (
          <section className="notes-page">
            <nav className="course-toolbar" aria-label="AI-103 navigation">
              <button className="back-link" type="button" onClick={goHome}>All exams</button>
              <button className="back-link" type="button" onClick={openAI103}>AI-103 Questions</button>
            </nav>
            <div className="page-header">
              <h1>AI-103 Notes</h1>
              <p>Download the course documents.</p>
            </div>
            <div className="notes-list">
              {notes.map((note) => (
                <article className="note-row" key={note.name}>
                  <div className="note-details">
                    <span className="note-type">Word document</span>
                    <h2>{note.name}</h2>
                  </div>
                  <a className="note-download" href={note.url} download={note.name}>
                    Download
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        {screen === 'course' && (
          <>
            <nav className="course-toolbar" aria-label="Course navigation">
              <button className="back-link" type="button" onClick={goHome}>All exams</button>
              <button className="back-link" type="button" onClick={openNotes}>Notes</button>
              <div className="view-tabs">
                <button
                  type="button"
                  className={view === 'questions' ? 'tab active' : 'tab'}
                  onClick={() => setView('questions')}
                >
                  Questions
                </button>
                <button
                  type="button"
                  className={view === 'caseStudy' ? 'tab active' : 'tab'}
                  onClick={() => setView('caseStudy')}
                >
                  Case Study
                </button>
              </div>
            </nav>

            {view === 'questions' && (
              <>
                <section className="page-header">
                  <h1>AI-301</h1>
                </section>

                <section className="questions-stack">{pageQuestions.map(renderQuestion)}</section>

                <div className="pagination">
                  <button type="button" disabled={page === 0} onClick={() => changePage(page - 1)}>
                    Previous
                  </button>
                  <label className="page-jump" htmlFor="page-jump">
                    <span>Page {page + 1} of {totalPages}</span>
                    <select
                      id="page-jump"
                      value={page}
                      onChange={(event) => changePage(Number(event.target.value))}
                    >
                      {Array.from({ length: totalPages }, (_, index) => (
                        <option key={index} value={index}>Go to page {index + 1}</option>
                      ))}
                    </select>
                  </label>
                  <button type="button" disabled={page >= totalPages - 1} onClick={() => changePage(page + 1)}>
                    Next
                  </button>
                </div>
              </>
            )}

            {view === 'caseStudy' && (
              <section className="case-study-page">
                <div className="page-header">
                  <h1>{caseStudy.title}</h1>
                  <p>{caseStudy.summary}</p>
                </div>

                <div className="case-study-card">
                  {caseStudy.sections.map((section) => (
                    <article key={section.heading} className="case-study-section">
                      <h2>{section.heading}</h2>
                      <p>{section.content}</p>
                    </article>
                  ))}

                  {caseStudy.questions && caseStudy.questions.length > 0 && (
                    <div className="case-study-questions">
                      {caseStudy.questions.map((question) => renderQuestion(question))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
